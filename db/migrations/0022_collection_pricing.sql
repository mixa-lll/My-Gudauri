PRAGMA foreign_keys = ON;

-- Pricing moves from the object to the category.
--
-- A rate, the bookable range and the volume ladders are a property of the
-- category, not of one instructor: every instructor works on the same official
-- tariff, and the site's own FAQ promises exactly that. Keeping a copy per card
-- meant a price change was twelve edits and one forgotten draft away from an
-- inconsistent catalog.
--
-- Column names are deliberately generic — `units` is whatever the pricing policy
-- multiplies the rate by (hours for lessons, days for rental, nights for stays)
-- and `group` is the surcharge dimension. One table serves every collection.
CREATE TABLE IF NOT EXISTS collection_pricing (
  collection TEXT PRIMARY KEY,
  currency TEXT NOT NULL DEFAULT 'GEL',
  base_rate REAL NOT NULL DEFAULT 0 CHECK (base_rate >= 0),
  min_units INTEGER NOT NULL DEFAULT 1 CHECK (min_units >= 1),
  max_units INTEGER NOT NULL DEFAULT 1 CHECK (max_units >= 1),
  units_step INTEGER NOT NULL DEFAULT 1 CHECK (units_step >= 1),
  default_units INTEGER NOT NULL DEFAULT 1 CHECK (default_units >= 1),
  default_group INTEGER NOT NULL DEFAULT 1 CHECK (default_group >= 1),
  round_to INTEGER NOT NULL DEFAULT 1 CHECK (round_to >= 1),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_price_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection TEXT NOT NULL REFERENCES collection_pricing(collection) ON DELETE CASCADE,
  dimension TEXT NOT NULL,
  from_units INTEGER NOT NULL CHECK (from_units >= 1),
  percent REAL NOT NULL DEFAULT 0 CHECK (percent >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS collection_price_tiers_step
  ON collection_price_tiers (collection, dimension, from_units);

-- Lift the instructor settings up. Every instructor carries identical values, so
-- MAX() reads the one shared setting rather than picking a winner between rivals.
-- COALESCE covers a fresh database, where migrations run before any seed and
-- MAX() over zero rows is NULL: the platform defaults from src/shared/pricing.js.
INSERT INTO collection_pricing (collection, currency, base_rate, min_units, max_units, units_step, default_units, default_group, round_to)
SELECT 'instructors', 'GEL',
  COALESCE(MAX(hourly_rate_gel), 345), COALESCE(MAX(min_hours), 2),
  COALESCE(MAX(max_hours), 12), COALESCE(MAX(hours_step), 2),
  COALESCE(MAX(default_hours), 8), COALESCE(MAX(default_people), 2),
  COALESCE(MAX(price_round_to), 5)
FROM instructors;

-- The ladders are identical across instructors too, so one card supplies them.
INSERT INTO collection_price_tiers (collection, dimension, from_units, percent, sort_order)
SELECT 'instructors', dimension, from_units, percent, sort_order
FROM instructor_price_tiers
WHERE instructor_id = (SELECT MIN(instructor_id) FROM instructor_price_tiers);
