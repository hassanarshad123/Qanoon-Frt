// Shared Redis cache for RAG search results
// Uses Upstash Redis so all serverless instances share one cache.
// Falls back gracefully to no-cache if Redis is unavailable.

import { Redis } from "@upstash/redis";
import type { SearchOptions, SearchResult } from "./types";

const TTL_SECONDS = 15 * 60; // 15 minutes

// ---------------------------------------------------------------------------
// Redis client (lazy singleton)
// ---------------------------------------------------------------------------

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// ---------------------------------------------------------------------------
// Public API — same interface as before
// ---------------------------------------------------------------------------

/**
 * Build a deterministic cache key from search options.
 */
export function buildCacheKey(options: SearchOptions): string {
  const key = JSON.stringify({
    q: options.query,
    f: options.filters ?? null,
    l: options.limit ?? 10,
    o: options.offset ?? 0,
    w: options.weights ?? null,
    c: options.includeChunks ?? false,
    g: options.groupByJudgment ?? true,
  });
  // Simple hash
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const chr = key.charCodeAt(i);
    hash = ((hash << 5) - hash + chr) | 0;
  }
  return `rag:${hash}`;
}

/**
 * Get cached results if still valid.
 */
export async function getCached(key: string): Promise<SearchResult[] | null> {
  const r = getRedis();
  if (!r) return null;

  try {
    const data = await r.get<SearchResult[]>(key);
    return data ?? null;
  } catch {
    // Redis unavailable — proceed without cache
    return null;
  }
}

/**
 * Store results in cache.
 */
export async function setCache(
  key: string,
  results: SearchResult[]
): Promise<void> {
  const r = getRedis();
  if (!r) return;

  try {
    await r.set(key, results, { ex: TTL_SECONDS });
  } catch {
    // Redis unavailable — silently skip
  }
}

/**
 * Clear all RAG cache entries.
 */
export async function clearCache(): Promise<void> {
  const r = getRedis();
  if (!r) return;

  try {
    // Scan for rag:* keys and delete them
    let cursor: string | number = 0;
    do {
      const result = await r.scan(cursor, {
        match: "rag:*",
        count: 100,
      });
      const [nextCursor, keys]: [string | number, string[]] = result as any;
      cursor = nextCursor;
      if (keys.length > 0) {
        await r.del(...keys);
      }
    } while (cursor !== 0 && cursor !== "0");
  } catch {
    // Redis unavailable — silently skip
  }
}
