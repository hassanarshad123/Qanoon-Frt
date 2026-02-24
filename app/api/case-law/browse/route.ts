import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api";
import { browse } from "@/lib/rag";
import type { SearchFilters } from "@/lib/rag/types";

/**
 * POST /api/case-law/browse
 * Case Law Repository — paginated browsing with filters and sorting.
 */
export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { filters, sortBy = "date", sortOrder = "desc", limit = 20, offset = 0 } = body;

    const searchFilters: SearchFilters = {};
    if (filters?.jurisdiction) searchFilters.jurisdiction = filters.jurisdiction;
    if (filters?.courtTier) searchFilters.courtTier = filters.courtTier;
    if (filters?.courts) searchFilters.courts = filters.courts;
    if (filters?.yearFrom) searchFilters.yearFrom = filters.yearFrom;
    if (filters?.yearTo) searchFilters.yearTo = filters.yearTo;
    if (filters?.legalAreas) searchFilters.legalAreas = filters.legalAreas;

    const result = await browse({
      filters: searchFilters,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    return NextResponse.json({
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      judgments: result.judgments.map((j) => ({
        id: j.id,
        caseName: j.caseName,
        citation: j.citation,
        court: j.court,
        year: j.year,
        jurisdiction: j.jurisdiction,
        courtTier: j.courtTier,
        judgeName: j.judgeName,
        judgmentDate: j.judgmentDate,
        parties: j.parties,
        legalAreas: j.legalAreas,
        summary: j.summary,
      })),
    });
  } catch (err: any) {
    console.error("[case-law/browse] Error:", err);
    return NextResponse.json(
      { error: err.message || "Browse failed" },
      { status: 500 }
    );
  }
}
