import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api";
import { search } from "@/lib/rag";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.query || body.query.trim().length < 10) {
    return NextResponse.json(
      { error: "Query must be at least 10 characters" },
      { status: 400 },
    );
  }

  const start = Date.now();

  const results = await search({
    query: body.query,
    filters: body.filters,
    limit: body.limit ?? 10,
    includeChunks: body.includeChunks ?? false,
  });

  const responseTimeMs = Date.now() - start;

  return NextResponse.json({
    query: body.query,
    resultCount: results.length,
    results: results.map((r) => ({
      judgment: {
        id: r.judgment.id,
        caseName: r.judgment.caseName,
        citation: r.judgment.citation,
        court: r.judgment.court,
        year: r.judgment.year,
        legalAreas: r.judgment.legalAreas,
        courtTier: r.judgment.courtTier,
        jurisdiction: r.judgment.jurisdiction,
      },
      relevanceScore: r.relevanceScore,
      matchedKeywords: r.matchedKeywords,
      matchedAreas: r.matchedAreas,
      matchedChunks: r.matchedChunks,
    })),
    responseTimeMs,
  });
}
