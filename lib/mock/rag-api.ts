import { ragPrecedents } from "./rag-precedents";
import type { RAGPrecedent, RAGSearchResult } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 200);

export interface SearchPrecedentsParams {
  keywords?: string[];
  legalAreas?: string[];
  maxResults?: number;
}

export async function searchPrecedents(params: SearchPrecedentsParams): Promise<RAGSearchResult[]> {
  await randomDelay();

  const { keywords = [], legalAreas = [], maxResults = 10 } = params;

  const normalizedKeywords = keywords.map(k => k.toLowerCase());
  const normalizedAreas = legalAreas.map(a => a.toLowerCase());

  const scored: RAGSearchResult[] = ragPrecedents.map(precedent => {
    let score = 0;
    const matchedKeywords: string[] = [];
    const matchedAreas: string[] = [];

    // Keyword matching (0-60 points)
    const precedentKeywords = precedent.keywords.map(k => k.toLowerCase());
    const precedentSummary = precedent.summary.toLowerCase();
    const precedentRatio = precedent.ratio.toLowerCase();

    for (const keyword of normalizedKeywords) {
      // Exact keyword match
      if (precedentKeywords.some(pk => pk.includes(keyword) || keyword.includes(pk))) {
        score += 15;
        matchedKeywords.push(keyword);
      }
      // Summary/ratio text match
      if (precedentSummary.includes(keyword) || precedentRatio.includes(keyword)) {
        score += 5;
        if (!matchedKeywords.includes(keyword)) matchedKeywords.push(keyword);
      }
    }

    // Legal area matching (0-40 points)
    const precedentAreas = precedent.legalAreas.map(a => a.toLowerCase());
    for (const area of normalizedAreas) {
      if (precedentAreas.includes(area)) {
        score += 20;
        matchedAreas.push(area);
      }
    }

    // Normalize to 0-100
    const maxPossible = normalizedKeywords.length * 20 + normalizedAreas.length * 20;
    const normalizedScore = maxPossible > 0 ? Math.min(100, Math.round((score / maxPossible) * 100)) : 0;

    return {
      precedent,
      relevanceScore: normalizedScore,
      matchedKeywords,
      matchedAreas,
    };
  });

  return scored
    .filter(r => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

export async function getPrecedentById(id: string): Promise<RAGPrecedent | undefined> {
  await randomDelay();
  return ragPrecedents.find(p => p.id === id);
}
