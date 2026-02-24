-- Expand user roles to support law students and common citizens
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('lawyer', 'judge', 'admin', 'law_student', 'common_person'));
