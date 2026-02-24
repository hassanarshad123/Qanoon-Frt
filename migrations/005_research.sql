CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE research_conversations (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title       TEXT NOT NULL DEFAULT 'New Research',
  case_id     TEXT,
  legal_areas JSONB DEFAULT '[]'::jsonb,
  status      TEXT NOT NULL DEFAULT 'active',
  pinned      BOOLEAN NOT NULL DEFAULT false,
  mode        TEXT NOT NULL DEFAULT 'general',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE research_messages (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  conversation_id     TEXT NOT NULL REFERENCES research_conversations(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content             TEXT NOT NULL DEFAULT '',
  structured_response JSONB,
  citations           JSONB DEFAULT '[]'::jsonb,
  rag_context         JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rc_created ON research_conversations(created_at DESC);
CREATE INDEX idx_rc_pinned ON research_conversations(pinned) WHERE pinned = true;
CREATE INDEX idx_rm_conv ON research_messages(conversation_id, created_at);

ALTER TABLE precedents ADD COLUMN IF NOT EXISTS embedding vector(1024);
CREATE INDEX IF NOT EXISTS idx_precedents_embedding
  ON precedents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
