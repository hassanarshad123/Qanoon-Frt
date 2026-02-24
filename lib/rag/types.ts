// Canonical RAG type definitions for QanoonAI
// All RAG-related types live here; other modules import from this file.

// =============================================================================
// Core entities
// =============================================================================

export interface Judgment {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  legalAreas: string[];
  keywords: string[];
  headnotes: string[];
  summary: string;
  ratio: string;
  // New fields (009 migration)
  jurisdiction: "PK" | "UK" | string;
  courtTier: string | null; // 'supreme','high','appellate','district','tribunal'
  judgeName: string | null;
  judgmentDate: string | null; // ISO date string
  parties: string | null;
  statutesCited: string[];
  sourceUrl: string | null;
  tokenCount: number | null;
  fullText?: string; // Only populated when explicitly requested (lazy-loaded)
  metadata?: Record<string, unknown>;
}

export interface JudgmentChunk {
  id: string;
  judgmentId: string;
  chunkType: "summary" | "section" | "paragraph";
  sectionLabel: string | null;
  content: string;
  chunkIndex: number;
  tokenCount: number | null;
}

export interface CitationLink {
  citingJudgmentId: string;
  citedJudgmentId: string | null;
  citedCitation: string;
  citationContext: string | null;
}

export interface Statute {
  id: string;
  name: string;
  shortName: string | null;
  year: number | null;
  jurisdiction: string;
  description: string | null;
}

export interface IngestionJob {
  id: string;
  jobType: "bulk" | "incremental";
  status: "pending" | "running" | "completed" | "failed";
  jurisdiction: string | null;
  totalRecords: number;
  processed: number;
  embedded: number;
  failed: number;
  lastProcessedId: string | null;
  errorLog: unknown[];
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

// =============================================================================
// Search types
// =============================================================================

export interface SearchFilters {
  jurisdiction?: string;
  courtTier?: string;
  courts?: string[];
  yearFrom?: number;
  yearTo?: number;
  legalAreas?: string[];
  statutesCited?: string[];
  judge?: string;
}

export interface SearchWeights {
  vector: number;   // default 0.60
  fullText: number;  // default 0.25
  metadata: number;  // default 0.15
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  weights?: Partial<SearchWeights>;
  includeChunks?: boolean;
  groupByJudgment?: boolean;
}

export interface MatchedChunk {
  chunkId: string;
  chunkType: "summary" | "section" | "paragraph";
  sectionLabel: string | null;
  content: string;
  score: number;
}

export interface SearchResult {
  judgment: Judgment;
  relevanceScore: number;
  matchedKeywords: string[];
  matchedAreas: string[];
  matchedChunks?: MatchedChunk[];
  citationCount?: number;
}

export interface BrowseOptions {
  filters?: SearchFilters;
  sortBy?: "date" | "year" | "court" | "relevance";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface BrowseResult {
  judgments: Judgment[];
  total: number;
  offset: number;
  limit: number;
}

// =============================================================================
// Ingestion types
// =============================================================================

export interface JudgmentRecord {
  caseName: string;
  citation: string;
  court: string;
  year: number;
  jurisdiction?: string;
  courtTier?: string;
  judgeName?: string;
  judgmentDate?: string;
  parties?: string;
  legalAreas?: string[];
  keywords?: string[];
  headnotes?: string[];
  summary?: string;
  ratio?: string;
  fullText?: string;
  statutesCited?: string[];
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ChunkRecord {
  chunkType: "summary" | "section" | "paragraph";
  sectionLabel: string | null;
  content: string;
  chunkIndex: number;
  tokenCount: number;
}

// =============================================================================
// Backward-compat aliases
// =============================================================================

/** @deprecated Use `Judgment` instead */
export type RAGPrecedent = {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  legalAreas: string[];
  keywords: string[];
  headnotes: string[];
  summary: string;
  ratio: string;
};

/** @deprecated Use `SearchResult` instead */
export interface RAGSearchResult {
  precedent: RAGPrecedent;
  relevanceScore: number;
  matchedKeywords: string[];
  matchedAreas: string[];
}

/** Convert a Judgment to the legacy RAGPrecedent shape */
export function toRAGPrecedent(j: Judgment): RAGPrecedent {
  return {
    id: j.id,
    caseName: j.caseName,
    citation: j.citation,
    court: j.court,
    year: j.year,
    legalAreas: j.legalAreas,
    keywords: j.keywords,
    headnotes: j.headnotes,
    summary: j.summary,
    ratio: j.ratio,
  };
}

/** Convert a SearchResult to the legacy RAGSearchResult shape */
export function toRAGSearchResult(r: SearchResult): RAGSearchResult {
  return {
    precedent: toRAGPrecedent(r.judgment),
    relevanceScore: r.relevanceScore,
    matchedKeywords: r.matchedKeywords,
    matchedAreas: r.matchedAreas,
  };
}
