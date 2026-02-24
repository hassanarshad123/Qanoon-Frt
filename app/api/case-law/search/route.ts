import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api";
import { search } from "@/lib/rag";
import type { SearchFilters } from "@/lib/rag/types";

/**
 * POST /api/case-law/search
 * Case Law Finder — rich search with filters.
 */
export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { query, filters, limit = 20, offset = 0 } = body;

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: "Query must be at least 3 characters" },
        { status: 400 }
      );
    }

    const searchFilters: SearchFilters = {};
    if (filters?.jurisdiction) searchFilters.jurisdiction = filters.jurisdiction;
    if (filters?.courtTier) searchFilters.courtTier = filters.courtTier;
    if (filters?.courts) searchFilters.courts = filters.courts;
    if (filters?.yearFrom) searchFilters.yearFrom = filters.yearFrom;
    if (filters?.yearTo) searchFilters.yearTo = filters.yearTo;
    if (filters?.legalAreas) searchFilters.legalAreas = filters.legalAreas;
    if (filters?.judge) searchFilters.judge = filters.judge;

    const results = await search({
      query,
      filters: searchFilters,
      limit,
      offset,
    });

    return NextResponse.json({
      query,
      resultCount: results.length,
      results: results.map((r) => ({
        id: r.judgment.id,
        caseName: r.judgment.caseName,
        citation: r.judgment.citation,
        court: r.judgment.court,
        year: r.judgment.year,
        jurisdiction: r.judgment.jurisdiction,
        courtTier: r.judgment.courtTier,
        judgeName: r.judgment.judgeName,
        parties: r.judgment.parties,
        legalAreas: r.judgment.legalAreas,
        summary: r.judgment.summary,
        relevanceScore: r.relevanceScore,
        matchedKeywords: r.matchedKeywords,
        matchedAreas: r.matchedAreas,
      })),
    });
  } catch (err: any) {
    console.error("[case-law/search] Error:", err);
    return NextResponse.json(
      { error: err.message || "Search failed" },
      { status: 500 }
    );
  }
}
