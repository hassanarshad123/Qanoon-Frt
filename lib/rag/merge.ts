// Deduplication utility for RAG search results

import type { SearchResult } from "./types";

/**
 * Normalize a citation string for deduplication.
 */
function normalizeCitation(citation: string): string {
  return citation.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Deduplicate search results by normalized citation string.
 * Higher-scored results are kept when duplicates exist.
 */
export function deduplicateResults(
  results: SearchResult[],
  maxResults = 15
): SearchResult[] {
  const seen = new Set<string>();
  const deduped: SearchResult[] = [];

  // Sort by score descending so we keep the best match
  const sorted = [...results].sort(
    (a, b) => b.relevanceScore - a.relevanceScore
  );

  for (const item of sorted) {
    const key = normalizeCitation(item.judgment.citation);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, maxResults);
}
