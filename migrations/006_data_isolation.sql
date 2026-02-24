-- Migration 006: Data Isolation & Judge Profiles
-- Adds user_id to existing tables and creates judge_profiles + activity_log

-- 1. Add user_id to briefs
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_briefs_user_id ON briefs(user_id);

-- 2. Add user_id to research_conversations
ALTER TABLE research_conversations ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_research_conversations_user_id ON research_conversations(user_id);

-- 3. Add user_id to notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- 4. Add user_id to folders
ALTER TABLE folders ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);

-- 5. Judge profiles table
CREATE TABLE IF NOT EXISTS judge_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  court_level TEXT,
  designation TEXT,
  province TEXT,
  city TEXT,
  court_name TEXT,
  tour_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_judge_profiles_user_id ON judge_profiles(user_id);

-- 6. Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
