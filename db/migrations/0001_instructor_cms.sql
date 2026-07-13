PRAGMA foreign_keys = ON;

CREATE TABLE instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Instructor',
  card_description TEXT NOT NULL,
  tagline TEXT NOT NULL,
  intro TEXT NOT NULL,
  card_image_url TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  hero_image_alt TEXT NOT NULL,
  booking_avatar_url TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  availability_label TEXT,
  certificate_label TEXT,
  hourly_rate_gel INTEGER NOT NULL DEFAULT 345,
  min_hours INTEGER NOT NULL DEFAULT 2,
  max_hours INTEGER NOT NULL DEFAULT 12,
  hours_step INTEGER NOT NULL DEFAULT 2,
  min_people INTEGER NOT NULL DEFAULT 1,
  max_people INTEGER NOT NULL DEFAULT 10,
  default_hours INTEGER NOT NULL DEFAULT 8,
  default_people INTEGER NOT NULL DEFAULT 2,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disciplines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT NOT NULL
);

CREATE TABLE languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE instructor_disciplines (
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  discipline_id INTEGER NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (instructor_id, discipline_id)
);

CREATE TABLE instructor_languages (
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (instructor_id, language_id)
);

CREATE TABLE instructor_about (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE instructor_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE instructor_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1))
);

CREATE TABLE instructor_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  lesson_label TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_date TEXT NOT NULL,
  body TEXT NOT NULL,
  avatar_url TEXT,
  avatar_position INTEGER NOT NULL DEFAULT 1,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX instructors_public_order_idx ON instructors(status, sort_order, display_name);
CREATE INDEX instructor_media_order_idx ON instructor_media(instructor_id, sort_order);
CREATE INDEX instructor_reviews_order_idx ON instructor_reviews(instructor_id, is_published, sort_order);
