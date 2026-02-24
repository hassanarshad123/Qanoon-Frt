// RAG system monitoring and statistics

import { sql } from "@/lib/db";

export interface RAGStats {
  totalJudgments: number;
  embeddedJudgments: number;
  totalChunks: number;
  embeddedChunks: number;
  citationLinks: number;
  resolvedCitationLinks: number;
  jurisdictionBreakdown: { jurisdiction: string; count: number }[];
  courtTierBreakdown: { courtTier: string; count: number }[];
  yearRange: { from: number | null; to: number | null };
  lastIngestion: {
    id: string;
    status: string;
    processed: number;
    embedded: number;
    failed: number;
    completedAt: string | null;
  } | null;
  indexHealth: "healthy" | "degraded" | "missing";
}

/**
 * Get comprehensive RAG system statistics.
 */
export async function getRAGStats(): Promise<RAGStats> {
  const [
    [judgmentStats],
    [chunkStats],
    [citationStats],
    jurisdictions,
    courtTiers,
    [latestJob],
  ] = await Promise.all([
    sql(`
      SELECT
        count(*) AS total,
        count(*) FILTER (WHERE embedding IS NOT NULL) AS embedded,
        min(year) AS min_year,
        max(year) AS max_year
      FROM precedents
    `),
    sql(`
      SELECT
        count(*) AS total,
        count(*) FILTER (WHERE embedding IS NOT NULL) AS embedded
      FROM case_law_chunks
    `),
    sql(`
      SELECT
        count(*) AS total,
        count(*) FILTER (WHERE cited_case_law_id IS NOT NULL) AS resolved
      FROM citation_graph
    `),
    sql(`
      SELECT jurisdiction, count(*) AS count
      FROM precedents
      GROUP BY jurisdiction
      ORDER BY count DESC
    `),
    sql(`
      SELECT court_tier, count(*) AS count
      FROM precedents
      WHERE court_tier IS NOT NULL
      GROUP BY court_tier
      ORDER BY count DESC
    `),
    sql(`
      SELECT id, status, processed, embedded, failed, completed_at
      FROM ingestion_jobs
      ORDER BY created_at DESC LIMIT 1
    `),
  ]);

  // Check HNSW index existence
  let indexHealth: "healthy" | "degraded" | "missing" = "missing";
  try {
    const indexes = await sql(`
      SELECT indexname FROM pg_indexes
      WHERE tablename = 'precedents' AND indexdef LIKE '%hnsw%'
    `);
    if (indexes.length > 0) {
      indexHealth = "healthy";
    } else {
      // Check for old IVFFlat
      const oldIndexes = await sql(`
        SELECT indexname FROM pg_indexes
        WHERE tablename = 'precedents' AND indexdef LIKE '%ivfflat%'
      `);
      indexHealth = oldIndexes.length > 0 ? "degraded" : "missing";
    }
  } catch {
    indexHealth = "missing";
  }

  return {
    totalJudgments: parseInt(judgmentStats?.total ?? "0"),
    embeddedJudgments: parseInt(judgmentStats?.embedded ?? "0"),
    totalChunks: parseInt(chunkStats?.total ?? "0"),
    embeddedChunks: parseInt(chunkStats?.embedded ?? "0"),
    citationLinks: parseInt(citationStats?.total ?? "0"),
    resolvedCitationLinks: parseInt(citationStats?.resolved ?? "0"),
    jurisdictionBreakdown: jurisdictions.map((r: any) => ({
      jurisdiction: r.jurisdiction ?? "unknown",
      count: parseInt(r.count),
    })),
    courtTierBreakdown: courtTiers.map((r: any) => ({
      courtTier: r.court_tier,
      count: parseInt(r.count),
    })),
    yearRange: {
      from: judgmentStats?.min_year ?? null,
      to: judgmentStats?.max_year ?? null,
    },
    lastIngestion: latestJob
      ? {
          id: latestJob.id,
          status: latestJob.status,
          processed: latestJob.processed,
          embedded: latestJob.embedded,
          failed: latestJob.failed,
          completedAt: latestJob.completed_at,
        }
      : null,
    indexHealth,
  };
}
