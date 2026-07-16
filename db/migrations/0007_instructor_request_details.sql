ALTER TABLE instructor_requests ADD COLUMN request_type TEXT NOT NULL DEFAULT 'specific_instructor'
  CHECK (request_type IN ('specific_instructor', 'manager_match'));
ALTER TABLE instructor_requests ADD COLUMN date_range_start TEXT;
ALTER TABLE instructor_requests ADD COLUMN date_range_end TEXT;
ALTER TABLE instructor_requests ADD COLUMN session_slots_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE instructor_requests ADD COLUMN company_type TEXT;
ALTER TABLE instructor_requests ADD COLUMN children_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE instructor_requests ADD COLUMN languages_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE instructor_requests ADD COLUMN activities_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE instructor_requests ADD COLUMN pace TEXT;
ALTER TABLE instructor_requests ADD COLUMN budget TEXT;
ALTER TABLE instructor_requests ADD COLUMN participants_json TEXT NOT NULL DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_instructor_requests_type_created
  ON instructor_requests(request_type, created_at DESC);
