import { VoyageAIClient } from "voyageai";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Voyage AI client (lazy singleton)
// ---------------------------------------------------------------------------

let client: VoyageAIClient | null = null;

function getClient(): VoyageAIClient | null {
  if (!process.env.VOYAGE_API_KEY) return null;
  if (!client) {
    client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });
  }
  return client;
}

// ---------------------------------------------------------------------------
// Upstash Redis for embedding cache (lazy singleton)
// ---------------------------------------------------------------------------

const EMB_TTL_SECONDS = 24 * 60 * 60; // 24 hours

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

/**
 * Simple string hash for cache keys.
 */
function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash + chr) | 0;
  }
  return String(hash >>> 0); // unsigned 32-bit
}

// ---------------------------------------------------------------------------
// Single embedding
// ---------------------------------------------------------------------------

export async function generateEmbedding(
  text: string
): Promise<number[] | null> {
  const c = getClient();
  if (!c) return null;

  // Check Redis cache first
  const r = getRedis();
  const cacheKey = `emb:${hashText(text)}`;

  if (r) {
    try {
      const cached = await r.get<number[]>(cacheKey);
      if (cached) return cached;
    } catch {
      // Redis unavailable — continue to Voyage
    }
  }

  // Call Voyage AI with error resilience
  try {
    const result = await c.embed({
      input: [text],
      model: "voyage-law-2",
    });

    const embedding = result.data?.[0]?.embedding ?? null;

    // Store in Redis cache
    if (embedding && r) {
      try {
        await r.set(cacheKey, embedding, { ex: EMB_TTL_SECONDS });
      } catch {
        // Redis unavailable — skip caching
      }
    }

    return embedding;
  } catch {
    // Voyage API failed (rate limit, network error, etc.)
    // Return null — search will fall back to text-only
    return null;
  }
}

// ---------------------------------------------------------------------------
// Batch embeddings
// ---------------------------------------------------------------------------

export async function generateEmbeddings(
  texts: string[]
): Promise<(number[] | null)[]> {
  const c = getClient();
  if (!c) return texts.map(() => null);

  const r = getRedis();
  const results: (number[] | null)[] = new Array(texts.length).fill(null);
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  // Check cache for each text
  if (r) {
    try {
      const keys = texts.map((t) => `emb:${hashText(t)}`);
      const cached = await r.mget<(number[] | null)[]>(...keys);
      for (let i = 0; i < texts.length; i++) {
        if (cached[i]) {
          results[i] = cached[i];
        } else {
          uncachedIndices.push(i);
          uncachedTexts.push(texts[i]);
        }
      }
    } catch {
      // Redis unavailable — fetch all from Voyage
      for (let i = 0; i < texts.length; i++) {
        uncachedIndices.push(i);
        uncachedTexts.push(texts[i]);
      }
    }
  } else {
    for (let i = 0; i < texts.length; i++) {
      uncachedIndices.push(i);
      uncachedTexts.push(texts[i]);
    }
  }

  // If everything was cached, return early
  if (uncachedTexts.length === 0) return results;

  // Call Voyage AI for uncached texts
  try {
    const apiResult = await c.embed({
      input: uncachedTexts,
      model: "voyage-law-2",
    });

    const embeddings =
      apiResult.data?.map((d) => d.embedding ?? null) ??
      uncachedTexts.map(() => null);

    // Populate results and cache new embeddings
    const toCache: { key: string; value: number[] }[] = [];

    for (let i = 0; i < uncachedIndices.length; i++) {
      const emb = embeddings[i] ?? null;
      results[uncachedIndices[i]] = emb;
      if (emb) {
        toCache.push({
          key: `emb:${hashText(uncachedTexts[i])}`,
          value: emb,
        });
      }
    }

    // Store new embeddings in Redis
    if (r && toCache.length > 0) {
      try {
        const pipeline = r.pipeline();
        for (const { key, value } of toCache) {
          pipeline.set(key, value, { ex: EMB_TTL_SECONDS });
        }
        await pipeline.exec();
      } catch {
        // Redis unavailable — skip caching
      }
    }

    return results;
  } catch {
    // Voyage API failed — return nulls for uncached entries
    return results;
  }
}
