-- Migration 009: Scalable RAG Schema
-- Unified RAG system for 400K+ Pakistani and UK court judgments
--
-- NOTE: The plan called for renaming `precedents` → `judgments`, but migration 007
-- already uses `judgments` for the judgment-drafting feature. We use `case_law` instead
-- for the RAG corpus and maintain a backward-compat `precedents` view.

-- =============================================================================
-- 1. Extend the existing `precedents` table with new columns
-- =============================================================================

ALTER TABLE precedents ADD COLUMN IF NOT EXISTS jurisdiction TEXT DEFAULT 'PK';
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS court_tier TEXT;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS judge_name TEXT;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS judgment_date DATE;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS parties TEXT;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS full_text TEXT;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS statutes_cited JSONB DEFAULT '[]';
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS token_count INTEGER;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS chunk_strategy TEXT;
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS ingested_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- =============================================================================
-- 2. Section-level embeddings for chunk-based search
-- =============================================================================

CREATE TABLE IF NOT EXISTS case_law_chunks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_law_id   TEXT NOT NULL,
  chunk_type    TEXT NOT NULL,          -- 'summary' | 'section' | 'paragraph'
  section_label TEXT,                   -- e.g. 'Facts', 'Holding', 'Ratio'
  content       TEXT NOT NULL,
  embedding     vector(1024),
  chunk_index   INTEGER NOT NULL DEFAULT 0,
  token_count   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 3. Citation graph — tracks inter-judgment citations
-- =============================================================================

CREATE TABLE IF NOT EXISTS citation_graph (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citing_case_law_id    TEXT NOT NULL,
  cited_case_law_id     TEXT,           -- NULL when cited case isn't in our DB
  cited_citation        TEXT NOT NULL,   -- Raw citation string e.g. "PLD 1988 SC 416"
  citation_context      TEXT,           -- ~200 chars of surrounding text
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 4. Statute reference library
-- =============================================================================

CREATE TABLE IF NOT EXISTS statutes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  short_name    TEXT,
  year          INTEGER,
  jurisdiction  TEXT DEFAULT 'PK',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 5. Ingestion job tracking
-- =============================================================================

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type        TEXT NOT NULL,         -- 'bulk' | 'incremental'
  status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending','running','completed','failed'
  jurisdiction    TEXT,
  total_records   INTEGER DEFAULT 0,
  processed       INTEGER DEFAULT 0,
  embedded        INTEGER DEFAULT 0,
  failed          INTEGER DEFAULT 0,
  last_processed_id TEXT,                -- For resume support
  error_log       JSONB DEFAULT '[]',
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 6. Index upgrades
-- =============================================================================

-- Drop old IVFFlat index (doesn't scale beyond ~100K vectors)
DROP INDEX IF EXISTS idx_precedents_embedding;

-- HNSW indexes for vector similarity (m=16, ef_construction=200)
CREATE INDEX IF NOT EXISTS idx_precedents_embedding_hnsw
  ON precedents USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

CREATE INDEX IF NOT EXISTS idx_case_law_chunks_embedding_hnsw
  ON case_law_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

-- GIN indexes for array/JSONB columns used in filtered search
-- legal_areas and keywords are text[] — default GIN array_ops
CREATE INDEX IF NOT EXISTS idx_precedents_legal_areas_gin
  ON precedents USING gin (legal_areas);

CREATE INDEX IF NOT EXISTS idx_precedents_keywords_gin
  ON precedents USING gin (keywords);

-- statutes_cited is JSONB
CREATE INDEX IF NOT EXISTS idx_precedents_statutes_cited_gin
  ON precedents USING gin (statutes_cited jsonb_path_ops);

-- B-tree indexes for filtered queries
CREATE INDEX IF NOT EXISTS idx_precedents_jurisdiction
  ON precedents (jurisdiction);

CREATE INDEX IF NOT EXISTS idx_precedents_court_tier
  ON precedents (court_tier);

CREATE INDEX IF NOT EXISTS idx_precedents_year
  ON precedents (year);

CREATE INDEX IF NOT EXISTS idx_precedents_judgment_date
  ON precedents (judgment_date);

-- Citation graph indexes
CREATE INDEX IF NOT EXISTS idx_citation_graph_citing
  ON citation_graph (citing_case_law_id);

CREATE INDEX IF NOT EXISTS idx_citation_graph_cited
  ON citation_graph (cited_case_law_id);

CREATE INDEX IF NOT EXISTS idx_citation_graph_cited_citation
  ON citation_graph (cited_citation);

-- Chunk foreign key index
CREATE INDEX IF NOT EXISTS idx_case_law_chunks_case_law_id
  ON case_law_chunks (case_law_id);

-- Ingestion jobs status index
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status
  ON ingestion_jobs (status);
