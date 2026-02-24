// Public barrel export for the RAG module
// Import from "@/lib/rag" to access all RAG functionality

// Core search functions
export {
  search,
  browse,
  getJudgment,
  getCitationGraph,
  hybridSearch,
} from "./service";

// Deduplication utility
export { deduplicateResults } from "./merge";

// Cache management
export { clearCache } from "./cache";

// Monitoring
export { getRAGStats } from "./monitoring";
export type { RAGStats } from "./monitoring";

// All types
export type {
  Judgment,
  JudgmentChunk,
  CitationLink,
  Statute,
  IngestionJob,
  SearchFilters,
  SearchWeights,
  SearchOptions,
  SearchResult,
  MatchedChunk,
  BrowseOptions,
  BrowseResult,
  JudgmentRecord,
  ChunkRecord,
  RAGPrecedent,
  RAGSearchResult,
} from "./types";

// Backward-compat converters
export { toRAGPrecedent, toRAGSearchResult } from "./types";
