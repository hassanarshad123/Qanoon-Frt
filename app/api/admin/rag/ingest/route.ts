import { NextRequest, NextResponse } from "next/server";
import { ingestJudgments, createIngestionJob, getIngestionJobStatus } from "@/lib/rag/ingest";
import type { JudgmentRecord } from "@/lib/rag/types";

/**
 * POST /api/admin/rag/ingest
 * Incremental ingestion — single or small batch of new judgments.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records: JudgmentRecord[] = Array.isArray(body.records)
      ? body.records
      : body.record
        ? [body.record]
        : [];

    if (records.length === 0) {
      return NextResponse.json(
        { error: "No records provided. Send { records: [...] } or { record: {...} }" },
        { status: 400 }
      );
    }

    if (records.length > 100) {
      return NextResponse.json(
        { error: "Too many records for incremental ingestion. Use /api/admin/rag/ingest/bulk for >100 records." },
        { status: 400 }
      );
    }

    const jobId = await createIngestionJob("incremental", records.length);
    const result = await ingestJudgments(records, jobId);

    return NextResponse.json({
      success: true,
      jobId,
      ...result,
    });
  } catch (err: any) {
    console.error("[admin/rag/ingest] Error:", err);
    return NextResponse.json(
      { error: err.message || "Ingestion failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/rag/ingest?jobId=<id>
 * Get ingestion job status.
 */
export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId query parameter required" },
        { status: 400 }
      );
    }

    const status = await getIngestionJobStatus(jobId);
    if (!status) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(status);
  } catch (err: any) {
    console.error("[admin/rag/ingest] Status error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to get status" },
      { status: 500 }
    );
  }
}
