import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const start = Date.now();

  try {
    // Check judgment count and embedding coverage
    const [countRow] = await sql(
      `SELECT
        count(*) AS total,
        count(*) FILTER (WHERE embedding IS NOT NULL) AS embedded
       FROM precedents`
    );

    // Check chunk count
    const [chunkRow] = await sql(
      `SELECT
        count(*) AS total,
        count(*) FILTER (WHERE embedding IS NOT NULL) AS embedded
       FROM case_law_chunks`
    );

    // Check latest ingestion job
    const [latestJob] = await sql(
      `SELECT id, status, processed, embedded, failed, completed_at
       FROM ingestion_jobs
       ORDER BY created_at DESC LIMIT 1`
    );

    const responseTimeMs = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      source: "neon_pgvector",
      judgments: {
        total: parseInt(countRow?.total ?? "0"),
        embedded: parseInt(countRow?.embedded ?? "0"),
      },
      chunks: {
        total: parseInt(chunkRow?.total ?? "0"),
        embedded: parseInt(chunkRow?.embedded ?? "0"),
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
      responseTimeMs,
    });
  } catch (err: any) {
    const responseTimeMs = Date.now() - start;
    return NextResponse.json({
      status: "error",
      error: err.message,
      responseTimeMs,
    });
  }
}
