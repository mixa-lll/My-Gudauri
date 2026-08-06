-- One operator queue for every guest request.
--
-- Until now each form wrote into its own intake table, so the admin had no
-- single place to work from. `requests` is that place: one row per request in
-- any category, with the category-specific answers kept verbatim in
-- `details_json` so nothing the guest typed is lost. `request_events` is the
-- audit trail the card shows, and `request_slot_offers` holds the alternative
-- times an operator proposes when the asked-for slot is taken.

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'object_page',
  source_label TEXT,
  object_slug TEXT,
  object_name TEXT,
  object_kicker TEXT,
  object_image_url TEXT,
  -- The requested slot, normalised so the object calendar can be queried.
  scheduled_date TEXT,
  scheduled_end_date TEXT,
  scheduled_start TEXT,
  scheduled_end TEXT,
  schedule_label TEXT,
  guest_count INTEGER NOT NULL DEFAULT 1,
  amount REAL,
  currency TEXT NOT NULL DEFAULT 'GEL',
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  messenger TEXT,
  guest_note TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'waiting_guest', 'waiting_payment', 'confirmed', 'completed', 'cancelled')),
  payment_state TEXT NOT NULL DEFAULT 'none'
    CHECK (payment_state IN ('none', 'link_created', 'link_sent', 'paid')),
  payment_link TEXT,
  payment_due_at TEXT,
  operator TEXT,
  resolution_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requests_status_created ON requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_category_created ON requests(category, created_at DESC);
-- The availability check reads this one: everything booked on an object's day.
CREATE INDEX IF NOT EXISTS idx_requests_object_schedule ON requests(category, object_slug, scheduled_date);

CREATE TABLE IF NOT EXISTS request_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'system'
    CHECK (kind IN ('created', 'status', 'note', 'message', 'payment', 'slot', 'system')),
  message TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'system',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_request_events_request ON request_events(request_id, id);

CREATE TABLE IF NOT EXISTS request_slot_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  slot_date TEXT NOT NULL,
  slot_start TEXT NOT NULL,
  slot_end TEXT,
  state TEXT NOT NULL DEFAULT 'offered' CHECK (state IN ('offered', 'accepted', 'withdrawn')),
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_request_slot_offers_request ON request_slot_offers(request_id, id);

-- Backfill: the intake tables stay as the raw log of what was posted, but the
-- operator works from `requests` only, so every existing request moves across.
INSERT INTO requests (
  request_code, category, source, source_label, object_slug, object_name, object_kicker,
  scheduled_date, scheduled_end_date, schedule_label, guest_count, currency,
  contact_name, contact_phone, contact_email, messenger, guest_note, details_json,
  status, created_at, updated_at, status_changed_at
)
SELECT
  r.request_code,
  'instructors',
  CASE r.request_type WHEN 'manager_match' THEN 'manager_match' ELSE 'object_page' END,
  CASE r.request_type WHEN 'manager_match' THEN 'подбор менеджером' ELSE 'со страницы инструктора' END,
  r.instructor_slug,
  COALESCE(r.instructor_name, 'Подбор инструктора'),
  'Инструктор',
  r.date_range_start,
  r.date_range_end,
  r.preferred_dates,
  r.participant_count,
  'GEL',
  r.contact_name,
  r.contact_phone,
  r.contact_email,
  r.messenger,
  r.notes,
  json_object(
    'requestType', r.request_type,
    'discipline', r.discipline,
    'skillLevel', r.skill_level,
    'lessonLanguage', r.lesson_language,
    'companyType', r.company_type,
    'childrenCount', r.children_count,
    'pace', r.pace,
    'budget', r.budget,
    'languages', json(r.languages_json),
    'activities', json(r.activities_json),
    'sessionSlots', json(r.session_slots_json),
    'participants', json(r.participants_json)
  ),
  CASE r.status WHEN 'contacted' THEN 'in_progress' WHEN 'closed' THEN 'completed' ELSE r.status END,
  r.created_at, r.updated_at, r.updated_at
FROM instructor_requests r
WHERE NOT EXISTS (SELECT 1 FROM requests existing WHERE existing.request_code = r.request_code);

INSERT INTO requests (
  request_code, category, source, source_label, object_slug, object_name, object_kicker,
  scheduled_date, scheduled_end_date, scheduled_start,
  schedule_label, guest_count, amount, currency,
  contact_name, contact_phone, contact_email, messenger, details_json,
  status, created_at, updated_at, status_changed_at
)
SELECT
  b.request_code,
  b.category_slug,
  'booking_flow',
  'из формы бронирования',
  b.object_slug,
  b.object_name,
  b.category_slug,
  -- Every flow keeps its own answers, but they agree on where the day and the
  -- pickup time live, so the queue can date a historic request too.
  CASE WHEN json_extract(b.answers_json, '$.date') LIKE '____-__-__' THEN json_extract(b.answers_json, '$.date') END,
  CASE WHEN json_extract(b.answers_json, '$.returnDate') LIKE '____-__-__' THEN json_extract(b.answers_json, '$.returnDate') END,
  CASE WHEN json_extract(b.answers_json, '$.time') LIKE '__:__' THEN json_extract(b.answers_json, '$.time') END,
  '',
  COALESCE(json_extract(b.answers_json, '$.passengers'), json_extract(b.answers_json, '$.participants'), 1),
  b.estimated_total,
  b.currency,
  b.contact_name,
  b.contact_phone,
  b.contact_email,
  b.messenger,
  json_object('flowKey', b.flow_key, 'flowVersion', b.flow_version, 'objectId', b.object_id, 'answers', json(b.answers_json)),
  CASE b.status WHEN 'contacted' THEN 'in_progress' WHEN 'closed' THEN 'completed' ELSE b.status END,
  b.created_at, b.updated_at, b.updated_at
FROM booking_requests b
WHERE NOT EXISTS (SELECT 1 FROM requests existing WHERE existing.request_code = b.request_code);

-- Every request opens its history with the moment it arrived.
INSERT INTO request_events (request_id, kind, message, actor, created_at)
SELECT r.id, 'created', 'Заявка получена — форма на сайте', 'guest', r.created_at
FROM requests r
WHERE NOT EXISTS (SELECT 1 FROM request_events event WHERE event.request_id = r.id);
