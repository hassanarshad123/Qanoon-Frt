import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    // Judgment statistics
    const [stats] = await sql(`
      SELECT
        count(*) AS total_judgments,
        count(*) FILTER (WHERE embedding IS NOT NULL) AS embedded_judgments,
        count(DISTINCT jurisdiction) AS jurisdictions,
        count(DISTINCT court_tier) FILTER (WHERE court_tier IS NOT NULL) AS court_tiers,
        min(year) AS earliest_year,
        max(year) AS latest_year
      FROM precedents
    `);

    // Chunk statistics
    const [chunkStats] = await sql(`
      SELECT count(*) AS total_chunks,
             count(*) FILTER (WHERE embedding IS NOT NULL) AS embedded_chunks
      FROM case_law_chunks
    `);

    // Citation graph statistics
    const [citationStats] = await sql(`
      SELECT count(*) AS total_links,
             count(*) FILTER (WHERE cited_case_law_id IS NOT NULL) AS resolved_links
      FROM citation_graph
    `);

    // Jurisdiction breakdown
    const jurisdictions = await sql(`
      SELECT jurisdiction, count(*) AS count
      FROM precedents
      GROUP BY jurisdiction
      ORDER BY count DESC
    `);

    // Court tier breakdown
    const courtTiers = await sql(`
      SELECT court_tier, count(*) AS count
      FROM precedents
      WHERE court_tier IS NOT NULL
      GROUP BY court_tier
      ORDER BY count DESC
    `);

    // Latest ingestion
    const [latestJob] = await sql(`
      SELECT id, job_type, status, total_records, processed, embedded, failed, started_at, completed_at
      FROM ingestion_jobs
      ORDER BY created_at DESC LIMIT 1
    `);

    return NextResponse.json({
      source: "neon_pgvector",
      judgments: {
        total: parseInt(stats?.total_judgments ?? "0"),
        embedded: parseInt(stats?.embedded_judgments ?? "0"),
        coverage: stats?.total_judgments > 0
          ? Math.round((stats.embedded_judgments / stats.total_judgments) * 100)
          : 0,
      },
      chunks: {
        total: parseInt(chunkStats?.total_chunks ?? "0"),
        embedded: parseInt(chunkStats?.embedded_chunks ?? "0"),
      },
      citations: {
        totalLinks: parseInt(citationStats?.total_links ?? "0"),
        resolvedLinks: parseInt(citationStats?.resolved_links ?? "0"),
      },
      yearRange: {
        from: stats?.earliest_year,
        to: stats?.latest_year,
      },
      jurisdictionBreakdown: jurisdictions.map((r: any) => ({
        jurisdiction: r.jurisdiction,
        count: parseInt(r.count),
      })),
      courtTierBreakdown: courtTiers.map((r: any) => ({
        courtTier: r.court_tier,
        count: parseInt(r.count),
      })),
      lastIngestion: latestJob || null,
    });
  } catch (err: any) {
    console.error("[admin/rag/info] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to get RAG info" },
      { status: 500 }
    );
  }
}
