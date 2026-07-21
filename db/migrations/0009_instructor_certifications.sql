PRAGMA foreign_keys = ON;

CREATE TABLE instructor_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level TEXT,
  file_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_instructor_certifications_instructor
  ON instructor_certifications (instructor_id, sort_order, id);

INSERT INTO instructor_certifications (instructor_id, title, sort_order)
SELECT id, certificate_label, 0
FROM instructors
WHERE certificate_label IS NOT NULL AND TRIM(certificate_label) <> '';
