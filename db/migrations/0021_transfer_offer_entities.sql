PRAGMA foreign_keys = ON;

-- A public transfer page is an offer assembled from two reusable entities:
-- one vehicle and one bidirectional route. The legacy `transfers` table stays
-- as the offer table so existing slugs, admin links and API clients remain
-- valid while the duplicated vehicle/route data is progressively retired.
CREATE TABLE transfer_vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  name TEXT NOT NULL,
  make TEXT,
  model TEXT,
  class_name TEXT,
  seats INTEGER NOT NULL CHECK (seats > 0),
  large_bags INTEGER NOT NULL DEFAULT 0 CHECK (large_bags >= 0),
  carry_on_bags INTEGER NOT NULL DEFAULT 0 CHECK (carry_on_bags >= 0),
  ski_capacity INTEGER NOT NULL DEFAULT 0 CHECK (ski_capacity >= 0),
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfer_vehicle_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL REFERENCES transfer_vehicles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE transfer_vehicle_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL REFERENCES transfer_vehicles(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE transfer_routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  origin_name TEXT NOT NULL,
  destination_name TEXT NOT NULL DEFAULT 'Gudauri',
  zone_type TEXT,
  distance_km REAL CHECK (distance_km IS NULL OR distance_km > 0),
  duration_label TEXT,
  map_embed_url TEXT,
  map_url TEXT,
  road_notice TEXT,
  is_bidirectional INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transfers ADD COLUMN vehicle_id INTEGER REFERENCES transfer_vehicles(id);
ALTER TABLE transfers ADD COLUMN route_id INTEGER REFERENCES transfer_routes(id);
ALTER TABLE transfers ADD COLUMN exact_vehicle INTEGER NOT NULL DEFAULT 0;

CREATE TABLE transfer_offer_conditions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Reviews belong to the vehicle. route_id records the journey on which the
-- review was earned, so the same review can appear for that vehicle on any
-- route without pretending it evaluates a carrier.
CREATE TABLE transfer_vehicle_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL REFERENCES transfer_vehicles(id) ON DELETE CASCADE,
  route_id INTEGER REFERENCES transfer_routes(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_date TEXT,
  body TEXT NOT NULL,
  avatar_url TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_transfer_offers_vehicle ON transfers (vehicle_id, status, sort_order);
CREATE INDEX idx_transfer_offers_route ON transfers (route_id, status, sort_order);
CREATE INDEX idx_transfer_vehicle_options_vehicle ON transfer_vehicle_options (vehicle_id, sort_order, id);
CREATE INDEX idx_transfer_vehicle_media_vehicle ON transfer_vehicle_media (vehicle_id, sort_order, id);
CREATE INDEX idx_transfer_vehicle_reviews_vehicle ON transfer_vehicle_reviews (vehicle_id, is_published, sort_order, id);
CREATE INDEX idx_transfer_offer_conditions_offer ON transfer_offer_conditions (transfer_id, sort_order, id);

INSERT INTO transfer_vehicles (slug, name, make, model, class_name, seats, large_bags, carry_on_bags, ski_capacity, description) VALUES
  ('comfort-sedan-3', 'Comfort sedan', NULL, NULL, 'Sedan', 3, 3, 2, 2, 'A private winter-ready sedan for up to three passengers.'),
  ('winter-suv-4', 'Winter 4×4', NULL, NULL, '4×4', 4, 4, 2, 4, 'A four-wheel-drive vehicle for heavy snow and mountain road conditions.'),
  ('minivan-7', 'Comfort minivan', NULL, NULL, 'Minivan', 7, 7, 4, 7, 'A spacious minivan for families and groups with ski luggage.'),
  ('minivan-6', 'Comfort minivan', NULL, NULL, 'Minivan', 6, 6, 4, 6, 'A spacious minivan for groups and cross-border journeys.'),
  ('minibus-16', 'Sprinter-class minibus', 'Mercedes-Benz', 'Sprinter or similar', 'Minibus', 16, 16, 8, 16, 'A high-roof minibus with an optional trailer for equipment.');

INSERT INTO transfer_vehicle_options (vehicle_id, label, sort_order)
  SELECT id, 'Winter tyres', 0 FROM transfer_vehicles;
INSERT INTO transfer_vehicle_options (vehicle_id, label, sort_order)
  SELECT id, 'Climate control', 1 FROM transfer_vehicles;
INSERT INTO transfer_vehicle_options (vehicle_id, label, sort_order)
  SELECT id, 'Child seat on request', 2 FROM transfer_vehicles;

INSERT INTO transfer_routes (slug, origin_name, destination_name, zone_type, distance_km, duration_label, road_notice) VALUES
  ('tbilisi-airport-gudauri', 'Tbilisi Airport', 'Gudauri', 'Airport', 120, '~2 hours', 'Journey time can change with traffic and winter road conditions.'),
  ('tbilisi-city-gudauri', 'Tbilisi', 'Gudauri', 'City', 120, '~2 hours', 'The exact city pickup address is added in the request.'),
  ('kutaisi-airport-gudauri', 'Kutaisi Airport', 'Gudauri', 'Airport', 310, '~4.5 hours', 'A comfort stop can be arranged on this long route.'),
  ('batumi-gudauri', 'Batumi', 'Gudauri', 'City', 430, '~6 hours', 'Two comfort stops can be arranged on this long route.'),
  ('kazbegi-gudauri', 'Kazbegi', 'Gudauri', 'City', 35, '~1 hour', 'Cross Pass access depends on current winter road conditions.'),
  ('vladikavkaz-gudauri', 'Vladikavkaz', 'Gudauri', 'Border / airport', 80, '3–6 hours', 'Travel time depends on border queues, documents and road conditions.');

UPDATE transfers SET vehicle_id = (SELECT id FROM transfer_vehicles WHERE slug = 'comfort-sedan-3') WHERE slug IN ('tbilisi-airport-gudauri', 'kutaisi-gudauri', 'batumi-gudauri', 'vladikavkaz-sedan-gudauri');
UPDATE transfers SET vehicle_id = (SELECT id FROM transfer_vehicles WHERE slug = 'winter-suv-4') WHERE slug IN ('kazbegi-gudauri', 'tbilisi-suv-gudauri');
UPDATE transfers SET vehicle_id = (SELECT id FROM transfer_vehicles WHERE slug = 'minivan-7') WHERE slug IN ('tbilisi-minivan-gudauri', 'kutaisi-minivan-gudauri', 'batumi-minivan-gudauri');
UPDATE transfers SET vehicle_id = (SELECT id FROM transfer_vehicles WHERE slug = 'minivan-6') WHERE slug IN ('vladikavkaz-gudauri', 'kazbegi-minivan-gudauri');
UPDATE transfers SET vehicle_id = (SELECT id FROM transfer_vehicles WHERE slug = 'minibus-16') WHERE slug = 'tbilisi-minibus-gudauri';

UPDATE transfers SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'tbilisi-airport-gudauri') WHERE slug IN ('tbilisi-airport-gudauri', 'tbilisi-suv-gudauri');
UPDATE transfers SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'tbilisi-city-gudauri') WHERE slug IN ('tbilisi-minivan-gudauri', 'tbilisi-minibus-gudauri');
UPDATE transfers SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'kutaisi-airport-gudauri') WHERE slug IN ('kutaisi-gudauri', 'kutaisi-minivan-gudauri');
UPDATE transfers SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'batumi-gudauri') WHERE slug IN ('batumi-gudauri', 'batumi-minivan-gudauri');
UPDATE transfers SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'kazbegi-gudauri') WHERE slug IN ('kazbegi-gudauri', 'kazbegi-minivan-gudauri');
UPDATE transfers SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'vladikavkaz-gudauri') WHERE slug IN ('vladikavkaz-gudauri', 'vladikavkaz-sedan-gudauri');

INSERT INTO transfer_vehicle_media (vehicle_id, media_type, url, thumbnail_url, alt, is_featured, sort_order)
SELECT t.vehicle_id, m.media_type, m.url, m.thumbnail_url, m.alt, MAX(m.is_featured), MIN(m.sort_order)
FROM transfer_media m JOIN transfers t ON t.id = m.transfer_id
WHERE t.vehicle_id IS NOT NULL
GROUP BY t.vehicle_id, m.url;

INSERT INTO transfer_vehicle_reviews (vehicle_id, route_id, author_name, rating, review_date, body, avatar_url, is_published, sort_order)
SELECT t.vehicle_id, t.route_id, r.author_name, r.rating, r.review_date, r.body, r.avatar_url, r.is_published, r.sort_order
FROM transfer_reviews r JOIN transfers t ON t.id = r.transfer_id
WHERE t.vehicle_id IS NOT NULL;

INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order)
  SELECT id, 'Waiting time', CASE WHEN pickup_type = 'airport' THEN '60 minutes after landing' ELSE '15 minutes' END, 0 FROM transfers;
INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order)
  SELECT id, 'Stops', CASE WHEN duration_label IN ('~4.5 hours', '~6 hours') THEN 'Comfort stops included' ELSE 'On request' END, 1 FROM transfers;
INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order)
  SELECT id, 'Cancellation', 'Free until confirmation', 2 FROM transfers;
INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order)
  SELECT id, 'Children and pets', 'Tell us in the request', 3 FROM transfers;

INSERT INTO transfer_vehicle_reviews (vehicle_id, route_id, author_name, rating, review_date, body, is_published, sort_order)
SELECT v.id, r.id, 'Anna', 5, '2026-02-14', 'The car was clean, warm and had enough room for our luggage and skis.', 1, 0
FROM transfer_vehicles v, transfer_routes r WHERE v.slug = 'comfort-sedan-3' AND r.slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_vehicle_reviews (vehicle_id, route_id, author_name, rating, review_date, body, is_published, sort_order)
SELECT v.id, r.id, 'Daniel', 5, '2026-01-09', 'Plenty of space for the group. The same minivan was comfortable even on the longer road.', 1, 0
FROM transfer_vehicles v, transfer_routes r WHERE v.slug = 'minivan-7' AND r.slug = 'kutaisi-airport-gudauri';
INSERT INTO transfer_vehicle_reviews (vehicle_id, route_id, author_name, rating, review_date, body, is_published, sort_order)
SELECT v.id, r.id, 'Nino', 5, '2026-03-02', 'Confident on the snowy pass and enough room for all four snowboards.', 1, 0
FROM transfer_vehicles v, transfer_routes r WHERE v.slug = 'winter-suv-4' AND r.slug = 'kazbegi-gudauri';
