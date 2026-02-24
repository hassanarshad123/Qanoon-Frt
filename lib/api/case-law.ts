import { apiFetch } from "./client";

export interface CaseLawSearchResult {
  results: CaseLawEntry[];
  total: number;
  offset: number;
  limit: number;
}

export interface CaseLawEntry {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  date: string;
  judge: string | null;
  summary: string;
  relevanceScore: number;
}

export interface CaseLawDetail {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  date: string;
  judge: string | null;
  fullText: string;
  headnotes: string[];
  statutes: string[];
  relatedCaseIds: string[];
}

export const caseLawApi = {
  search(data: {
    query: string;
    filters?: Record<string, unknown>;
    limit?: number;
    offset?: number;
  }): Promise<CaseLawSearchResult> {
    return apiFetch("/case-law/search", { method: "POST", body: data });
  },

  browse(data: {
    filters?: Record<string, unknown>;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    offset?: number;
  }): Promise<CaseLawSearchResult> {
    return apiFetch("/case-law/browse", { method: "POST", body: data });
  },

  get(id: string): Promise<CaseLawDetail> {
    return apiFetch(`/case-law/${id}`);
  },

  batchEmbeddings(texts: string[]): Promise<{ embeddings: (number[] | null)[] }> {
    return apiFetch("/embeddings/batch", { method: "POST", body: { texts } });
  },
};
