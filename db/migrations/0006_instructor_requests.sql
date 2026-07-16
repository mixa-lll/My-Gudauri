CREATE TABLE IF NOT EXISTS instructor_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_code TEXT NOT NULL UNIQUE,
  instructor_slug TEXT,
  instructor_name TEXT,
  preferred_dates TEXT NOT NULL,
  time_preferences_json TEXT NOT NULL DEFAULT '[]',
  discipline TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  lesson_language TEXT NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 1,
  has_children INTEGER NOT NULL DEFAULT 0,
  extras_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  messenger TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_instructor_requests_status_created
  ON instructor_requests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_instructor_requests_instructor
  ON instructor_requests(instructor_slug, created_at DESC);
