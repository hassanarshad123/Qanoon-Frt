import type { ExtractedCaseData } from "./types";

/**
 * Merge multiple ExtractedCaseData results (from chunked analysis) into one.
 */
export function mergeAnalysisResults(results: ExtractedCaseData[]): ExtractedCaseData {
  if (results.length === 0) {
    return {
      courtInfo: null,
      parties: [],
      facts: [],
      legalIssues: [],
      statutes: [],
      arguments: [],
      rawDocuments: [],
    };
  }

  if (results.length === 1) return results[0];

  // Use first non-null courtInfo
  const courtInfo = results.find((r) => r.courtInfo !== null)?.courtInfo ?? null;

  // Deduplicate parties by name (case-insensitive)
  const seenParties = new Set<string>();
  const parties = results.flatMap((r) => r.parties).filter((p) => {
    const key = p.name.toLowerCase().trim();
    if (seenParties.has(key)) return false;
    seenParties.add(key);
    return true;
  });

  // Concatenate facts and re-number chronologically
  const allFacts = results.flatMap((r) => r.facts);
  const facts = allFacts.map((f, idx) => ({ ...f, order: idx + 1 }));

  // Deduplicate legal issues by content similarity
  const seenIssues = new Set<string>();
  const legalIssues = results.flatMap((r) => r.legalIssues).filter((issue) => {
    const key = issue.content.toLowerCase().trim().slice(0, 100);
    if (seenIssues.has(key)) return false;
    seenIssues.add(key);
    return true;
  });

  // Deduplicate statutes by name
  const seenStatutes = new Set<string>();
  const statutes = results.flatMap((r) => r.statutes).filter((s) => {
    const key = s.name.toLowerCase().trim();
    if (seenStatutes.has(key)) return false;
    seenStatutes.add(key);
    return true;
  });

  // Merge all arguments (no dedup — different chunks may have different arguments)
  const args = results.flatMap((r) => r.arguments);

  // Merge raw documents
  const rawDocuments = results.flatMap((r) => r.rawDocuments || []);

  return {
    courtInfo,
    parties,
    facts,
    legalIssues,
    statutes,
    arguments: args,
    rawDocuments,
  };
}
