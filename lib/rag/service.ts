// Unified RAG search service for QanoonAI
// Replaces lib/research/rag.ts + lib/rag/client.ts + lib/mock/rag-api.ts

import { sql } from "@/lib/db";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { getCached, setCache, buildCacheKey } from "./cache";
import type {
  Judgment,
  SearchOptions,
  SearchResult,
  SearchFilters,
  SearchWeights,
  BrowseOptions,
  BrowseResult,
  CitationLink,
  MatchedChunk,
  RAGSearchResult,
  RAGPrecedent,
} from "./types";
import { toRAGSearchResult } from "./types";

// =============================================================================
// Defaults
// =============================================================================

const DEFAULT_WEIGHTS: SearchWeights = {
  vector: 0.6,
  fullText: 0.25,
  metadata: 0.15,
};

const DEFAULT_LIMIT = 10;

// =============================================================================
// Internal helpers
// =============================================================================

function parseArrayField(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    // Handle PostgreSQL text[] literal: {item1,"item 2",item3}
    if (val.startsWith("{") && val.endsWith("}")) {
      const inner = val.slice(1, -1);
      if (!inner) return [];
      return inner.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
    }
    // Handle JSON array string (from JSONB columns)
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowToJudgment(r: any): Judgment {
  return {
    id: r.id,
    caseName: r.case_name,
    citation: r.citation,
    court: r.court,
    year: r.year,
    legalAreas: parseArrayField(r.legal_areas),
    keywords: parseArrayField(r.keywords),
    headnotes: parseArrayField(r.headnotes),
    summary: r.summary ?? "",
    ratio: r.ratio ?? "",
    jurisdiction: r.jurisdiction ?? "PK",
    courtTier: r.court_tier ?? null,
    judgeName: r.judge_name ?? null,
    judgmentDate: r.judgment_date ? new Date(r.judgment_date).toISOString().split("T")[0] : null,
    parties: r.parties ?? null,
    statutesCited: parseArrayField(r.statutes_cited),
    sourceUrl: r.source_url ?? null,
    tokenCount: r.token_count ?? null,
    fullText: r.full_text ?? undefined,
    metadata: r.metadata ? (typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata) : undefined,
  };
}

/**
 * Build parameterized WHERE clause fragments from search filters.
 * Returns { clauses: string[], params: any[], nextIdx: number }.
 */
function buildFilterClauses(
  filters: SearchFilters | undefined,
  startIdx: number
): { clauses: string[]; params: any[]; nextIdx: number } {
  const clauses: string[] = [];
  const params: any[] = [];
  let idx = startIdx;

  if (!filters) return { clauses, params, nextIdx: idx };

  if (filters.jurisdiction) {
    clauses.push(`p.jurisdiction = $${idx}`);
    params.push(filters.jurisdiction);
    idx++;
  }
  if (filters.courtTier) {
    clauses.push(`p.court_tier = $${idx}`);
    params.push(filters.courtTier);
    idx++;
  }
  if (filters.courts && filters.courts.length > 0) {
    clauses.push(`p.court = ANY($${idx})`);
    params.push(filters.courts);
    idx++;
  }
  if (filters.yearFrom) {
    clauses.push(`p.year >= $${idx}`);
    params.push(filters.yearFrom);
    idx++;
  }
  if (filters.yearTo) {
    clauses.push(`p.year <= $${idx}`);
    params.push(filters.yearTo);
    idx++;
  }
  if (filters.legalAreas && filters.legalAreas.length > 0) {
    // legal_areas is text[] — use array overlap operator
    clauses.push(`p.legal_areas && $${idx}::text[]`);
    params.push(filters.legalAreas);
    idx++;
  }
  if (filters.statutesCited && filters.statutesCited.length > 0) {
    // statutes_cited is JSONB — use ?| operator
    clauses.push(`p.statutes_cited ?| $${idx}`);
    params.push(filters.statutesCited);
    idx++;
  }
  if (filters.judge) {
    clauses.push(`p.judge_name ILIKE $${idx}`);
    params.push(`%${filters.judge}%`);
    idx++;
  }

  return { clauses, params, nextIdx: idx };
}

/**
 * Build ts_query string from natural language query.
 */
function buildTsQuery(query: string): string {
  return query
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .slice(0, 30)
    .join(" | ");
}

// =============================================================================
// Core search — document-level
// =============================================================================

async function documentSearch(
  query: string,
  embedding: number[] | null,
  tsQuery: string,
  filters: SearchFilters | undefined,
  weights: SearchWeights,
  limit: number,
  offset: number
): Promise<{ rows: any[]; mode: string }> {
  const { clauses, params, nextIdx } = buildFilterClauses(filters, 1);
  const whereBase = clauses.length > 0 ? clauses.join(" AND ") + " AND " : "";

  // Determine scoring expression and params
  let scoreParts: string[] = [];
  let queryParams: any[] = [];
  let paramIdx = nextIdx;

  // We always put filter params first
  queryParams = [...params];

  if (embedding && tsQuery.trim()) {
    // Full hybrid
    const embeddingParam = `$${paramIdx}`;
    queryParams.push(`[${embedding.join(",")}]`);
    paramIdx++;
    const tsParam = `$${paramIdx}`;
    queryParams.push(tsQuery);
    paramIdx++;

    scoreParts.push(
      `(1 - (p.embedding <=> ${embeddingParam}::vector)) * ${weights.vector}`
    );
    scoreParts.push(
      `COALESCE(ts_rank(p.search_vector, to_tsquery('english', ${tsParam})), 0) * ${weights.fullText}`
    );
    // Metadata boost: court tier hierarchy + citation count
    scoreParts.push(
      `(CASE p.court_tier
          WHEN 'supreme' THEN 1.0
          WHEN 'high' THEN 0.7
          WHEN 'appellate' THEN 0.5
          WHEN 'district' THEN 0.3
          WHEN 'tribunal' THEN 0.2
          ELSE 0.4
        END) * ${weights.metadata}`
    );

    const scoreExpr = scoreParts.join(" + ");
    const limitParam = `$${paramIdx}`;
    queryParams.push(limit);
    paramIdx++;
    const offsetParam = `$${paramIdx}`;
    queryParams.push(offset);

    const rows = await sql(
      `SELECT p.*, (${scoreExpr}) AS score
       FROM precedents p
       WHERE ${whereBase} p.embedding IS NOT NULL
       ORDER BY score DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryParams
    );

    // If too few results, supplement with vector-only
    if (rows.length < 3 && rows.length < limit) {
      const vectorRows = await sql(
        `SELECT p.*, (1 - (p.embedding <=> $${1}::vector)) AS score
         FROM precedents p
         WHERE ${whereBase.replace(/p\./g, "p.")} p.embedding IS NOT NULL
         ORDER BY p.embedding <=> $${1}::vector
         LIMIT $${2}`,
        [`[${embedding.join(",")}]`, limit, ...params]
      );
      const seen = new Set(rows.map((r: any) => r.id));
      for (const r of vectorRows) {
        if (!seen.has(r.id)) rows.push(r);
      }
      return { rows: rows.slice(0, limit), mode: "hybrid+vector_supplement" };
    }

    return { rows, mode: "hybrid" };
  }

  if (embedding) {
    // Vector only
    const embeddingParam = `$${paramIdx}`;
    queryParams.push(`[${embedding.join(",")}]`);
    paramIdx++;
    const limitParam = `$${paramIdx}`;
    queryParams.push(limit);
    paramIdx++;
    const offsetParam = `$${paramIdx}`;
    queryParams.push(offset);

    const rows = await sql(
      `SELECT p.*, (1 - (p.embedding <=> ${embeddingParam}::vector)) AS score
       FROM precedents p
       WHERE ${whereBase} p.embedding IS NOT NULL
       ORDER BY p.embedding <=> ${embeddingParam}::vector
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryParams
    );
    return { rows, mode: "vector" };
  }

  if (tsQuery.trim()) {
    // Text only
    const tsParam = `$${paramIdx}`;
    queryParams.push(tsQuery);
    paramIdx++;
    const limitParam = `$${paramIdx}`;
    queryParams.push(limit);
    paramIdx++;
    const offsetParam = `$${paramIdx}`;
    queryParams.push(offset);

    const rows = await sql(
      `SELECT p.*, ts_rank(p.search_vector, to_tsquery('english', ${tsParam})) AS score
       FROM precedents p
       WHERE ${whereBase} p.search_vector @@ to_tsquery('english', ${tsParam})
       ORDER BY score DESC
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      queryParams
    );
    return { rows, mode: "text" };
  }

  // Fallback: no query, just return filtered results
  const limitParam = `$${paramIdx}`;
  queryParams.push(limit);
  paramIdx++;
  const offsetParam = `$${paramIdx}`;
  queryParams.push(offset);

  const rows = await sql(
    `SELECT p.*, 0.5 AS score
     FROM precedents p
     ${whereBase ? `WHERE ${whereBase.replace(/ AND $/, "")}` : ""}
     ORDER BY p.year DESC
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    queryParams
  );
  return { rows, mode: "fallback" };
}

// =============================================================================
// Chunk-level search
// =============================================================================

async function chunkSearch(
  embedding: number[] | null,
  tsQuery: string,
  filters: SearchFilters | undefined,
  limit: number
): Promise<Map<string, MatchedChunk[]>> {
  if (!embedding) return new Map();

  const { clauses, params, nextIdx } = buildFilterClauses(filters, 1);
  const filterJoin = clauses.length > 0
    ? `JOIN precedents p ON p.id = c.case_law_id WHERE ${clauses.join(" AND ")} AND c.embedding IS NOT NULL`
    : `WHERE c.embedding IS NOT NULL`;

  const embeddingParam = `$${nextIdx}`;
  params.push(`[${embedding.join(",")}]`);
  const limitParam = `$${nextIdx + 1}`;
  params.push(limit * 3); // Fetch more chunks, then group

  const rows = await sql(
    `SELECT c.id, c.case_law_id, c.chunk_type, c.section_label, c.content,
            (1 - (c.embedding <=> ${embeddingParam}::vector)) AS score
     FROM case_law_chunks c
     ${filterJoin}
     ORDER BY c.embedding <=> ${embeddingParam}::vector
     LIMIT ${limitParam}`,
    params
  );

  // Group by judgment, keep best chunk per judgment
  const grouped = new Map<string, MatchedChunk[]>();
  for (const r of rows) {
    const jId = r.case_law_id;
    if (!grouped.has(jId)) grouped.set(jId, []);
    grouped.get(jId)!.push({
      chunkId: r.id,
      chunkType: r.chunk_type,
      sectionLabel: r.section_label,
      content: r.content,
      score: parseFloat(r.score),
    });
  }

  return grouped;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Hybrid vector + text + metadata search across the case law corpus.
 * Primary search entry point for all tools.
 */
export async function search(options: SearchOptions): Promise<SearchResult[]> {
  const {
    query,
    filters,
    limit = DEFAULT_LIMIT,
    offset = 0,
    includeChunks = false,
    groupByJudgment = true,
  } = options;

  const weights: SearchWeights = {
    ...DEFAULT_WEIGHTS,
    ...options.weights,
  };

  // Check cache
  const cacheKey = buildCacheKey(options);
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Set HNSW ef_search (50 balances speed vs recall)
  await sql(`SET LOCAL hnsw.ef_search = 50`).catch(() => {});

  // Generate embedding + ts_query
  const [embedding, tsQuery] = await Promise.all([
    generateEmbedding(query),
    Promise.resolve(buildTsQuery(query)),
  ]);

  // Document-level search
  const { rows } = await documentSearch(
    query,
    embedding,
    tsQuery,
    filters,
    weights,
    limit,
    offset
  );

  // Optional chunk-level search
  let chunkMap = new Map<string, MatchedChunk[]>();
  if (includeChunks && embedding) {
    chunkMap = await chunkSearch(embedding, tsQuery, filters, limit);
  }

  // Build results
  const results: SearchResult[] = rows.map((r: any) => {
    const judgment = rowToJudgment(r);
    const score = parseFloat(r.score ?? "0.5");
    const legalAreas = judgment.legalAreas;
    const keywords = judgment.keywords;

    return {
      judgment,
      relevanceScore: Math.round(score * 100),
      matchedKeywords: keywords.slice(0, 5),
      matchedAreas: legalAreas,
      matchedChunks: chunkMap.get(r.id)?.slice(0, 3),
      citationCount: undefined,
    };
  });

  // If chunk search found judgments not in document search, append them
  if (includeChunks && groupByJudgment) {
    const docIds = new Set(rows.map((r: any) => r.id));
    const missingIds = Array.from(chunkMap.keys()).filter((id) => !docIds.has(id));
    if (missingIds.length > 0 && missingIds.length <= 20) {
      const placeholders = missingIds.map((_, i) => `$${i + 1}`).join(",");
      const extraRows = await sql(
        `SELECT p.*, 0.4 AS score FROM precedents p WHERE p.id IN (${placeholders})`,
        missingIds
      );
      for (const r of extraRows) {
        const judgment = rowToJudgment(r);
        results.push({
          judgment,
          relevanceScore: Math.round(0.4 * 100),
          matchedKeywords: judgment.keywords.slice(0, 5),
          matchedAreas: judgment.legalAreas,
          matchedChunks: chunkMap.get(r.id)?.slice(0, 3),
        });
      }
    }
  }

  // Sort by score descending, cap at limit
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const final = results.slice(0, limit);

  await setCache(cacheKey, final);
  return final;
}

/**
 * Paginated browse with filters and sorting (no vector search).
 * Used by the Case Law Repository.
 */
export async function browse(options: BrowseOptions): Promise<BrowseResult> {
  const {
    filters,
    sortBy = "date",
    sortOrder = "desc",
    limit = 20,
    offset = 0,
  } = options;

  const { clauses, params, nextIdx } = buildFilterClauses(filters, 1);
  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  const orderMap: Record<string, string> = {
    date: "p.judgment_date",
    year: "p.year",
    court: "p.court",
    relevance: "p.year", // fallback
  };
  const orderCol = orderMap[sortBy] || "p.year";
  const direction = sortOrder === "asc" ? "ASC" : "DESC";

  // Count total
  const countParams = [...params];
  const [countRow] = await sql(
    `SELECT count(*) AS total FROM precedents p ${whereClause}`,
    countParams
  );
  const total = parseInt(countRow?.total ?? "0", 10);

  // Fetch page
  const limitParam = `$${nextIdx}`;
  params.push(limit);
  const offsetParam = `$${nextIdx + 1}`;
  params.push(offset);

  const rows = await sql(
    `SELECT p.* FROM precedents p ${whereClause}
     ORDER BY ${orderCol} ${direction} NULLS LAST
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    params
  );

  return {
    judgments: rows.map(rowToJudgment),
    total,
    offset,
    limit,
  };
}

/**
 * Get a single judgment by ID, optionally including full text.
 */
export async function getJudgment(
  id: string,
  includeFullText = false
): Promise<Judgment | null> {
  const cols = includeFullText
    ? "p.*"
    : `p.id, p.case_name, p.citation, p.court, p.year, p.legal_areas, p.keywords,
       p.headnotes, p.summary, p.ratio, p.jurisdiction, p.court_tier, p.judge_name,
       p.judgment_date, p.parties, p.statutes_cited, p.source_url, p.token_count, p.metadata`;

  const rows = await sql(
    `SELECT ${cols} FROM precedents p WHERE p.id = $1`,
    [id]
  );

  if (rows.length === 0) return null;
  return rowToJudgment(rows[0]);
}

/**
 * Get citation graph for a judgment (both citing and cited).
 */
export async function getCitationGraph(
  judgmentId: string
): Promise<{ citing: CitationLink[]; citedBy: CitationLink[] }> {
  const [citingRows, citedByRows] = await Promise.all([
    sql(
      `SELECT citing_case_law_id, cited_case_law_id, cited_citation, citation_context
       FROM citation_graph WHERE citing_case_law_id = $1`,
      [judgmentId]
    ),
    sql(
      `SELECT citing_case_law_id, cited_case_law_id, cited_citation, citation_context
       FROM citation_graph WHERE cited_case_law_id = $1`,
      [judgmentId]
    ),
  ]);

  const mapRow = (r: any): CitationLink => ({
    citingJudgmentId: r.citing_case_law_id,
    citedJudgmentId: r.cited_case_law_id ?? null,
    citedCitation: r.cited_citation,
    citationContext: r.citation_context ?? null,
  });

  return {
    citing: citingRows.map(mapRow),
    citedBy: citedByRows.map(mapRow),
  };
}

// =============================================================================
// Backward-compat wrapper
// =============================================================================

/**
 * Drop-in replacement for the old `hybridSearch` from `lib/research/rag.ts`.
 * @deprecated Use `search()` instead.
 */
export async function hybridSearch(
  query: string,
  options?: { legalAreas?: string[]; limit?: number }
): Promise<RAGSearchResult[]> {
  const results = await search({
    query,
    filters: options?.legalAreas?.length
      ? { legalAreas: options.legalAreas }
      : undefined,
    limit: options?.limit ?? 10,
  });

  return results.map(toRAGSearchResult);
}
