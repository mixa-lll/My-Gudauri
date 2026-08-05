PRAGMA foreign_keys = ON;

-- Volume pricing for instructor lessons.
--
-- One row per ladder step: “from this many units onwards, apply this percent”.
-- `dimension` names the booking field the step applies to and the pricing policy
-- decides how the percent is read — a discount for hours, a surcharge for extra
-- students. Column names match `src/shared/pricing.js` so the CMS, the API and
-- the site share one shape. Future collections get their own table with the same
-- three columns; the engine itself is collection-agnostic.
CREATE TABLE IF NOT EXISTS instructor_price_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('duration', 'participants')),
  from_units INTEGER NOT NULL CHECK (from_units >= 1),
  percent REAL NOT NULL DEFAULT 0 CHECK (percent >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS instructor_price_tiers_step
  ON instructor_price_tiers (instructor_id, dimension, from_units);

-- Totals are quoted on a 5 GEL grid so a ladder never produces prices like
-- “2 597.85 GEL”. Per instructor, because a premium card may want finer steps.
ALTER TABLE instructors ADD COLUMN price_round_to INTEGER NOT NULL DEFAULT 5;

-- Seed every existing instructor with the platform ladder, so the tiers are
-- visible and editable in the CMS instead of living implicitly in code.
INSERT INTO instructor_price_tiers (instructor_id, dimension, from_units, percent, sort_order)
SELECT id, 'duration', 1, 0, 0 FROM instructors;
INSERT INTO instructor_price_tiers (instructor_id, dimension, from_units, percent, sort_order)
SELECT id, 'duration', 4, 8, 1 FROM instructors;
INSERT INTO instructor_price_tiers (instructor_id, dimension, from_units, percent, sort_order)
SELECT id, 'duration', 8, 15, 2 FROM instructors;
INSERT INTO instructor_price_tiers (instructor_id, dimension, from_units, percent, sort_order)
SELECT id, 'participants', 2, 35, 0 FROM instructors;
INSERT INTO instructor_price_tiers (instructor_id, dimension, from_units, percent, sort_order)
SELECT id, 'participants', 3, 25, 1 FROM instructors;
INSERT INTO instructor_price_tiers (instructor_id, dimension, from_units, percent, sort_order)
SELECT id, 'participants', 5, 15, 2 FROM instructors;
