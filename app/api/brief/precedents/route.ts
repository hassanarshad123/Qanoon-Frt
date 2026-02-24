import { NextResponse } from "next/server";
import { anthropic } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import { buildPrecedentRankingPrompt } from "@/lib/ai/prompts";
import { requireAuth } from "@/lib/auth/api";
import { search, toRAGSearchResult } from "@/lib/rag";

export const maxDuration = 120;

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { extractedData } = await request.json();

    if (!extractedData) {
      return NextResponse.json(
        { error: "Missing extractedData" },
        { status: 400 }
      );
    }

    // Build search query from extracted data
    const searchTerms: string[] = [];

    if (extractedData.legalIssues) {
      for (const issue of extractedData.legalIssues) {
        searchTerms.push(issue.content);
      }
    }
    if (extractedData.statutes) {
      for (const statute of extractedData.statutes) {
        searchTerms.push(statute.name);
        if (statute.provisions) searchTerms.push(...statute.provisions);
      }
    }
    if (extractedData.arguments) {
      for (const arg of extractedData.arguments) {
        if (arg.supportingCitations) searchTerms.push(...arg.supportingCitations);
      }
    }
    if (extractedData.courtInfo?.caseType) {
      searchTerms.push(extractedData.courtInfo.caseType);
    }

    // Unified RAG search
    const ragQuery = searchTerms.slice(0, 10).join(" ");
    const searchResults = await search({ query: ragQuery, limit: 15 });
    const searchResultsMapped = searchResults.map((r) => ({
      id: r.judgment.id,
      case_name: r.judgment.caseName,
      citation: r.judgment.citation,
      court: r.judgment.court,
      year: r.judgment.year,
      legal_areas: r.judgment.legalAreas,
      keywords: r.judgment.keywords,
      headnotes: r.judgment.headnotes,
      summary: r.judgment.summary,
      ratio: r.judgment.ratio,
    }));

    // Use Claude to re-rank the results
    const legalIssues = (extractedData.legalIssues || []).map(
      (i: any) => i.content
    );
    const statutes = (extractedData.statutes || []).map(
      (s: any) => `${s.name} ${(s.provisions || []).join(", ")}`
    );
    const caseType = extractedData.courtInfo?.caseType || "General";

    const rankingPrompt = buildPrecedentRankingPrompt(
      { legalIssues, statutes, caseType },
      searchResultsMapped.map((r: any) => ({
        id: r.id,
        caseName: r.case_name,
        citation: r.citation,
        summary: r.summary,
        ratio: r.ratio,
        legalAreas: Array.isArray(r.legal_areas) ? r.legal_areas : [],
      }))
    );

    const message = await anthropic.messages.create({
      model: AI_MODELS.rank_precedents,
      max_tokens: 4096,
      messages: [{ role: "user", content: rankingPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    let rankings: any[] = [];

    if (textBlock && textBlock.type === "text") {
      let jsonText = textBlock.text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
      }
      try {
        rankings = JSON.parse(jsonText);
      } catch {
        // Fallback: use search order with default scores
        rankings = searchResultsMapped.map((r: any, i: number) => ({
          id: r.id,
          relevanceScore: Math.max(90 - i * 5, 40),
          matchedKeywords: [],
          matchedAreas: typeof r.legal_areas === "string" ? JSON.parse(r.legal_areas) : r.legal_areas || [],
          explanation: "Matched via full-text search",
        }));
      }
    }

    // Build final RAGSearchResult array
    const results = rankings
      .filter((rank: any) => rank.relevanceScore > 30)
      .slice(0, 10)
      .map((rank: any) => {
        const dbRow = searchResultsMapped.find((r: any) => r.id === rank.id);
        if (!dbRow) return null;

        const legalAreas = dbRow.legal_areas || [];
        const keywords = dbRow.keywords || [];
        const headnotes = dbRow.headnotes || [];

        return {
          precedent: {
            id: dbRow.id,
            caseName: dbRow.case_name,
            citation: dbRow.citation,
            court: dbRow.court,
            year: dbRow.year,
            legalAreas,
            keywords,
            headnotes,
            summary: dbRow.summary,
            ratio: dbRow.ratio,
          },
          relevanceScore: rank.relevanceScore,
          matchedKeywords: rank.matchedKeywords || [],
          matchedAreas: rank.matchedAreas || [],
        };
      })
      .filter(Boolean);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Precedent search error:", error);
    return NextResponse.json(
      { error: error.message || "Precedent search failed" },
      { status: 500 }
    );
  }
}
