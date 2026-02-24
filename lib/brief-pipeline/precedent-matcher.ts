import type { ExtractedCaseData } from "./types";
import { search, toRAGSearchResult } from "@/lib/rag";
import type { RAGSearchResult } from "@/lib/rag/types";

export async function matchPrecedents(data: ExtractedCaseData): Promise<RAGSearchResult[]> {
  const keywords = new Set<string>();
  const legalAreas = new Set<string>();

  // Extract keywords from legal issues
  for (const issue of data.legalIssues) {
    const words = issue.content
      .toLowerCase()
      .replace(/[?.,;:]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 4);
    words.forEach(w => keywords.add(w));

    for (const statute of issue.relatedStatutes) {
      keywords.add(statute.toLowerCase());
    }
  }

  // Extract keywords from statutes
  for (const statute of data.statutes) {
    const nameParts = statute.name.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    nameParts.forEach(w => keywords.add(w));
    statute.provisions.forEach(p => keywords.add(p.toLowerCase()));
  }

  // Determine legal areas from case type and statutes
  const caseType = data.courtInfo?.caseType?.toLowerCase() || "";
  if (caseType.includes("constitutional") || caseType.includes("writ")) legalAreas.add("Constitutional");
  if (caseType.includes("criminal")) legalAreas.add("Criminal");
  if (caseType.includes("family")) legalAreas.add("Family");
  if (caseType.includes("corporate")) legalAreas.add("Corporate");

  // Detect from statutes
  const allStatuteText = data.statutes.map(s => s.name.toLowerCase()).join(" ");
  if (allStatuteText.includes("constitution") || allStatuteText.includes("article")) legalAreas.add("Constitutional");
  if (allStatuteText.includes("penal") || allStatuteText.includes("criminal")) legalAreas.add("Criminal");
  if (allStatuteText.includes("family") || allStatuteText.includes("marriage") || allStatuteText.includes("dissolution")) legalAreas.add("Family");
  if (allStatuteText.includes("income tax") || allStatuteText.includes("finance act")) legalAreas.add("Tax");
  if (allStatuteText.includes("companies") || allStatuteText.includes("secp")) legalAreas.add("Corporate");
  if (allStatuteText.includes("land acquisition")) legalAreas.add("Land");
  if (allStatuteText.includes("civil servants") || allStatuteText.includes("appointment")) legalAreas.add("Employment");

  // Also pull keywords from arguments' citations
  for (const arg of data.arguments) {
    for (const cit of arg.supportingCitations) {
      const citWords = cit.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      citWords.forEach(w => keywords.add(w));
    }
  }

  const keywordArray = Array.from(keywords).slice(0, 20);
  const areaArray = Array.from(legalAreas);

  if (keywordArray.length === 0 && areaArray.length === 0) {
    return [];
  }

  // Use unified RAG search with keyword-based query and legal area filters
  const query = keywordArray.join(" ");
  const results = await search({
    query,
    filters: areaArray.length > 0 ? { legalAreas: areaArray } : undefined,
    limit: 10,
  });

  return results.map(toRAGSearchResult);
}
