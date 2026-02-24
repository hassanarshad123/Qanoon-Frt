ALTER TABLE lawyer_profiles
  ADD COLUMN IF NOT EXISTS tour_state JSONB DEFAULT '{}';

-- Migrate existing tour_completed flags into the new JSONB structure
UPDATE lawyer_profiles
  SET tour_state = '{"ch-1": true, "ch-2": true}'
  WHERE tour_completed = true
  AND (tour_state IS NULL OR tour_state = '{}');
