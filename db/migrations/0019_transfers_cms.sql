PRAGMA foreign_keys = ON;

-- Transfers become a CMS collection on the same shape as activities: one object
-- table plus repeatable tags, facts, inclusions, media and reviews. Column names
-- deliberately match `activities` so the shared editor, autofill and media
-- cleanup code applies unchanged.
CREATE TABLE IF NOT EXISTS transfers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  name TEXT NOT NULL,
  -- The route label shown on the card, e.g. "Gudauri ↔ Tbilisi Airport".
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  card_image_url TEXT,
  hero_image_url TEXT,
  hero_image_alt TEXT,
  price_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GEL',
  price_suffix TEXT,
  rating REAL NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  -- The city the route connects Gudauri with; drives the catalog route panel.
  catalog_group TEXT NOT NULL DEFAULT 'other',
  vehicle_class TEXT,
  seats INTEGER,
  duration_label TEXT,
  pickup_type TEXT,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transfer_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transfer_facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transfer_included (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transfer_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transfer_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  context_label TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_date TEXT,
  body TEXT NOT NULL,
  avatar_url TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers (status, sort_order, name);
CREATE INDEX IF NOT EXISTS idx_transfer_tags_transfer ON transfer_tags (transfer_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_transfer_facts_transfer ON transfer_facts (transfer_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_transfer_included_transfer ON transfer_included (transfer_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_transfer_media_transfer ON transfer_media (transfer_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_transfer_reviews_transfer ON transfer_reviews (transfer_id, sort_order, id);

-- Seed carries over the six routes the catalog shipped as static data, with the
-- same slugs so the existing route-panel filters keep matching.
INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('tbilisi-airport-gudauri', 'published', 'Sedan · up to 3 seats', 'Gudauri ↔ Tbilisi Airport', 'A private car with a winter-ready driver, door to door, flight tracked on arrival.', '/assets/design-1/mosaic/transfer-1-144-upd.png', '/assets/design-1/mosaic/transfer-1-144-upd.png', 'Gudauri ↔ Tbilisi Airport', 180, 'GEL', 'per vehicle', 4.9, 128, 'tbilisi', 'Comfort', 3, '~2 hours', 'airport', 10);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~2 hours', 0 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 1 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Ski rack', 2 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Comfort', 0 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 3', 1 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~2 hours', 2 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Driver', 'EN · RU', 3 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 0 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flight tracking', 1 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, '60 min waiting', 2 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 3 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('tbilisi-minivan-gudauri', 'published', 'Minivan · up to 7 seats', 'Gudauri ↔ Tbilisi city', 'Room for a group with skis and boards, with door pickup anywhere in the city.', '/assets/design-1/service-transfer.png', '/assets/design-1/service-transfer.png', 'Gudauri ↔ Tbilisi city', 260, 'GEL', 'per vehicle', 4.8, 94, 'tbilisi', 'Minivan', 7, '~2 hours', 'city', 20);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~2 hours', 0 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Child seats', 1 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Ski rack', 2 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Minivan', 0 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 7', 1 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~2 hours', 2 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Bags', '7 + skis', 3 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Door pickup', 0 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flight tracking', 1 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 2 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Water', 3 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('kutaisi-gudauri', 'published', 'Sedan · up to 3 seats', 'Gudauri ↔ Kutaisi Airport', 'A comfortable cross-country transfer from Kutaisi with a rest stop on the way.', '/assets/design-1/mosaic/transfer-2104-1385.png', '/assets/design-1/mosaic/transfer-2104-1385.png', 'Gudauri ↔ Kutaisi Airport', 420, 'GEL', 'per vehicle', 4.8, 57, 'kutaisi', 'Comfort', 3, '~4.5 hours', 'airport', 30);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~4.5 hours', 0 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 1 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Comfort stop', 2 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Comfort', 0 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 3', 1 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~4.5 hours', 2 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Stops', 'On request', 3 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 0 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flight tracking', 1 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Comfort stop', 2 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 3 FROM transfers WHERE slug = 'kutaisi-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('batumi-gudauri', 'published', 'Sedan · up to 3 seats', 'Gudauri ↔ Batumi', 'A private transfer from the Black Sea coast to Gudauri with flexible comfort stops.', '/assets/design-1/mosaic/transfer-1-144.png', '/assets/design-1/mosaic/transfer-1-144.png', 'Gudauri ↔ Batumi', 520, 'GEL', 'per vehicle', 4.7, 33, 'batumi', 'Comfort', 3, '~6 hours', 'city', 40);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~6 hours', 0 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Two stops', 1 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Ski rack', 2 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Comfort', 0 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 3', 1 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~6 hours', 2 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Stops', 'Two', 3 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Door pickup', 0 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Two comfort stops', 1 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 2 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Water', 3 FROM transfers WHERE slug = 'batumi-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('kazbegi-gudauri', 'published', '4×4 · up to 4 seats', 'Gudauri ↔ Kazbegi', 'A winter-ready 4×4 transfer across the Cross Pass between Kazbegi and Gudauri.', '/assets/design-1/mosaic/tours-1-117-upd.png', '/assets/design-1/mosaic/tours-1-117-upd.png', 'Gudauri ↔ Kazbegi', 150, 'GEL', 'per vehicle', 4.9, 76, 'kazbegi', NULL, 4, '~1 hour', 'city', 50);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~1 hour', 0 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Cross Pass', 1 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Winter-ready', 2 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Vehicle', '4×4', 0 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 4', 1 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~1 hour', 2 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Route', 'Cross Pass', 3 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Door pickup', 0 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Winter-ready 4×4', 1 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Luggage', 2 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flexible time', 3 FROM transfers WHERE slug = 'kazbegi-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('vladikavkaz-gudauri', 'published', 'Minivan · up to 6 seats', 'Gudauri ↔ Vladikavkaz', 'Cross-border transfer with document guidance. Journey time depends on border and road conditions.', '/assets/design-1/service-transfer.png', '/assets/design-1/service-transfer.png', 'Gudauri ↔ Vladikavkaz', 390, 'GEL', 'per vehicle', 4.8, 44, 'vladikavkaz', NULL, 6, NULL, 'airport', 60);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~3–6 hours', 0 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Border crossing', 1 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Ski rack', 2 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Vehicle', 'Minivan', 0 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 6', 1 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Border', 'Documents required', 2 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Time', 'Variable', 3 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Airport pickup', 0 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Border guidance', 1 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 2 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Waiting', 3 FROM transfers WHERE slug = 'vladikavkaz-gudauri';

