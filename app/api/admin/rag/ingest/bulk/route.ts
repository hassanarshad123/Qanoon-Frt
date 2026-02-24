import { NextRequest, NextResponse } from "next/server";
import { ingestJudgments, createIngestionJob } from "@/lib/rag/ingest";
import type { JudgmentRecord } from "@/lib/rag/types";

/**
 * POST /api/admin/rag/ingest/bulk
 * Trigger bulk ingestion job. Accepts large arrays of records.
 * Processes asynchronously — returns jobId immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records: JudgmentRecord[] = body.records ?? [];
    const jurisdiction: string | undefined = body.jurisdiction;

    if (records.length === 0) {
      return NextResponse.json(
        { error: "No records provided. Send { records: [...] }" },
        { status: 400 }
      );
    }

    const jobId = await createIngestionJob("bulk", records.length, jurisdiction);

    // Run ingestion in background (non-blocking)
    // In serverless, this will run within the request timeout
    // For truly large batches, use the CLI script instead
    ingestJudgments(records, jobId).catch((err) => {
      console.error(`[admin/rag/ingest/bulk] Job ${jobId} failed:`, err);
    });

    return NextResponse.json({
      success: true,
      jobId,
      message: `Bulk ingestion started for ${records.length} records. Poll /api/admin/rag/ingest?jobId=${jobId} for status.`,
    });
  } catch (err: any) {
    console.error("[admin/rag/ingest/bulk] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to start bulk ingestion" },
      { status: 500 }
    );
  }
}
