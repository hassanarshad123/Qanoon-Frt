import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api";
import { getJudgment, getCitationGraph } from "@/lib/rag";

/**
 * GET /api/case-law/[id]
 * Case Law Detail — single judgment with optional full text and citation graph.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const includeFullText = req.nextUrl.searchParams.get("fullText") === "true";
    const includeCitations = req.nextUrl.searchParams.get("citations") === "true";

    const judgment = await getJudgment(id, includeFullText);
    if (!judgment) {
      return NextResponse.json({ error: "Judgment not found" }, { status: 404 });
    }

    let citations = null;
    if (includeCitations) {
      citations = await getCitationGraph(id);
    }

    return NextResponse.json({
      ...judgment,
      citations,
    });
  } catch (err: any) {
    console.error("[case-law/detail] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to get judgment" },
      { status: 500 }
    );
  }
}
