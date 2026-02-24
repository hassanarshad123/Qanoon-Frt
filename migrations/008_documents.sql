-- Migration 008: Documents Feature
-- Vercel Blob-backed document storage

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  page_count INTEGER DEFAULT 0,
  document_type TEXT DEFAULT 'Other',
  blob_url TEXT NOT NULL,
  blob_pathname TEXT NOT NULL,
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  judgment_id UUID REFERENCES judgments(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_brief_id ON documents(brief_id);
CREATE INDEX IF NOT EXISTS idx_documents_judgment_id ON documents(judgment_id);
