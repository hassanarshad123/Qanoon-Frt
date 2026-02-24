-- Migration 007: Judgments Feature
-- Full AI-powered judgment drafting system

CREATE TABLE IF NOT EXISTS judgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  case_title TEXT NOT NULL,
  case_number TEXT,
  court TEXT,
  status TEXT NOT NULL DEFAULT 'generating',
  case_data JSONB DEFAULT '{}',
  rag_results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_judgments_user_id ON judgments(user_id);
CREATE INDEX IF NOT EXISTS idx_judgments_brief_id ON judgments(brief_id);

CREATE TABLE IF NOT EXISTS judgment_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judgment_id UUID NOT NULL REFERENCES judgments(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  review_status TEXT DEFAULT 'pending_review',
  flag_note TEXT,
  regeneration_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_judgment_sections_judgment_id ON judgment_sections(judgment_id);

CREATE TABLE IF NOT EXISTS judgment_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judgment_id UUID NOT NULL REFERENCES judgments(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_judgment_conversations_judgment_id ON judgment_conversations(judgment_id);
