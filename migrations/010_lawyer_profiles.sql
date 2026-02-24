CREATE TABLE IF NOT EXISTS lawyer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  bar_council_number TEXT,
  years_of_experience TEXT,
  practice_areas TEXT[] DEFAULT '{}',
  province TEXT,
  city TEXT,
  primary_court TEXT,
  firm_type TEXT,
  firm_name TEXT,
  tour_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);
