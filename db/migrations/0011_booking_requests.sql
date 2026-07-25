CREATE TABLE IF NOT EXISTS booking_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_code TEXT NOT NULL UNIQUE,
  category_slug TEXT NOT NULL,
  flow_key TEXT NOT NULL,
  flow_version INTEGER NOT NULL,
  object_id TEXT NOT NULL,
  object_slug TEXT NOT NULL,
  object_name TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  estimated_total REAL,
  currency TEXT NOT NULL DEFAULT 'GEL',
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  messenger TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_category_created
  ON booking_requests(category_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_booking_requests_status_created
  ON booking_requests(status, created_at DESC);
