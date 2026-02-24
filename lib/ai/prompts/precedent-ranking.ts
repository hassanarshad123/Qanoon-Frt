export function buildPrecedentRankingPrompt(
  caseData: {
    legalIssues: string[];
    statutes: string[];
    caseType: string;
  },
  searchResults: {
    id: string;
    caseName: string;
    citation: string;
    summary: string;
    ratio: string;
    legalAreas: string[];
  }[]
): string {
  return `You are a Pakistani legal research expert. Given the following case details and candidate precedents, rank the precedents by relevance and explain why each is relevant.

CASE DETAILS:
- Legal Issues: ${caseData.legalIssues.join("; ")}
- Applicable Statutes: ${caseData.statutes.join("; ")}
- Case Type: ${caseData.caseType}

CANDIDATE PRECEDENTS:
${searchResults.map((p, i) => `${i + 1}. ${p.caseName} (${p.citation})\n   Areas: ${p.legalAreas.join(", ")}\n   Summary: ${p.summary}\n   Ratio: ${p.ratio}`).join("\n\n")}

Return a JSON array (no markdown, no code fences, just raw JSON) sorted by relevance (most relevant first):
[
  {
    "id": "string — precedent id",
    "relevanceScore": number (0-100),
    "matchedKeywords": ["string — relevant terms from the case that match"],
    "matchedAreas": ["string — legal areas that overlap"],
    "explanation": "string — brief explanation of why this precedent is relevant"
  }
]`;
}
