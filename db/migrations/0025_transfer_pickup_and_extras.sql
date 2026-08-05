PRAGMA foreign_keys = ON;

-- A route is a direction between two towns; where the driver actually meets the
-- guest is a property of the *request*, not of a separate product. Splitting
-- "Tbilisi Airport → Gudauri" and "Tbilisi → Gudauri" into two routes made the
-- same ride look like two offers at one price, and it hid vehicles: the minivan
-- and the minibus only existed on the city route, so a guest arriving by plane
-- could not find them at all. One route per direction, pickup chosen at booking.

CREATE TABLE transfer_pickup_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route_id INTEGER NOT NULL REFERENCES transfer_routes(id) ON DELETE CASCADE,
  -- 'airport' collects a flight; 'city' an address; 'custom' a map pin the
  -- guest describes in their own words.
  kind TEXT NOT NULL CHECK (kind IN ('airport', 'city', 'custom')),
  label TEXT NOT NULL,
  hint TEXT,
  requires_flight INTEGER NOT NULL DEFAULT 0,
  requires_address INTEGER NOT NULL DEFAULT 0,
  is_default INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_transfer_pickup_points_route ON transfer_pickup_points (route_id, sort_order, id);

-- Add-ons a guest can request with the ride. Priced columns exist so a paid
-- extra needs no schema change; everything seeded here is free of charge, which
-- is what the public FAQ already promises about child seats.
CREATE TABLE transfer_extras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  label TEXT NOT NULL,
  description TEXT,
  price_amount REAL NOT NULL DEFAULT 0 CHECK (price_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GEL',
  -- 'per_request' bills once; 'per_unit' multiplies by the chosen quantity.
  price_unit TEXT NOT NULL DEFAULT 'per_request' CHECK (price_unit IN ('per_request', 'per_unit')),
  max_quantity INTEGER NOT NULL DEFAULT 1 CHECK (max_quantity >= 1),
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO transfer_extras (slug, label, description, price_amount, price_unit, max_quantity, sort_order) VALUES
  ('child-seat', 'Child seat', 'Rear-facing or forward-facing seat, fitted before pickup. Tell us the age in the comment.', 0, 'per_unit', 4, 10),
  ('booster-seat', 'Booster seat', 'For children who have outgrown a full seat.', 0, 'per_unit', 4, 20),
  ('ski-rack', 'Ski or snowboard rack', 'Roof rack for skis and boards that do not fit inside.', 0, 'per_request', 1, 30),
  ('extra-stop', 'Extra stop on the way', 'A short stop for a shop, a viewpoint or a second address.', 0, 'per_unit', 3, 40),
  ('name-sign', 'Meeting sign with your name', 'The driver waits in arrivals holding a sign.', 0, 'per_request', 1, 50);

-- Merge the two Tbilisi routes into one. Route 1 (the airport route) survives as
-- the canonical Tbilisi direction and inherits the city route's offers.
UPDATE transfers
SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'tbilisi-airport-gudauri')
WHERE route_id = (SELECT id FROM transfer_routes WHERE slug = 'tbilisi-city-gudauri');

UPDATE transfer_vehicle_reviews
SET route_id = (SELECT id FROM transfer_routes WHERE slug = 'tbilisi-airport-gudauri')
WHERE route_id = (SELECT id FROM transfer_routes WHERE slug = 'tbilisi-city-gudauri');

UPDATE transfer_routes
SET slug = 'tbilisi-gudauri',
    origin_name = 'Tbilisi',
    zone_type = 'City & airport',
    duration_label = '~2 hours',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'tbilisi-airport-gudauri';

DELETE FROM transfer_routes WHERE slug = 'tbilisi-city-gudauri';

-- The card badge follows the route, so every Tbilisi offer now reads the same.
UPDATE transfers SET category = 'Gudauri ↔ Tbilisi', updated_at = CURRENT_TIMESTAMP WHERE catalog_group = 'tbilisi';

-- Pickup points per route. Tbilisi and Kutaisi are airport-first arrivals;
-- Batumi and Kazbegi are town pickups; Vladikavkaz adds the border crossing.
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'airport', 'Tbilisi International Airport', 'We track your flight and wait in arrivals.', 1, 0, 1, 10 FROM transfer_routes WHERE slug = 'tbilisi-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'city', 'Any address in Tbilisi', 'Hotel, apartment or a street address in the city.', 0, 1, 0, 20 FROM transfer_routes WHERE slug = 'tbilisi-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'custom', 'Another meeting point', 'Describe the place and we will agree the exact spot.', 0, 0, 0, 30 FROM transfer_routes WHERE slug = 'tbilisi-gudauri';

INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'airport', 'Kutaisi International Airport', 'We track your flight and wait in arrivals.', 1, 0, 1, 10 FROM transfer_routes WHERE slug = 'kutaisi-airport-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'city', 'Any address in Kutaisi', 'Hotel, apartment or a street address in the city.', 0, 1, 0, 20 FROM transfer_routes WHERE slug = 'kutaisi-airport-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'custom', 'Another meeting point', 'Describe the place and we will agree the exact spot.', 0, 0, 0, 30 FROM transfer_routes WHERE slug = 'kutaisi-airport-gudauri';

INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'city', 'Any address in Batumi', 'Hotel, apartment or a street address in the city.', 0, 1, 1, 10 FROM transfer_routes WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'airport', 'Batumi International Airport', 'We track your flight and wait in arrivals.', 1, 0, 0, 20 FROM transfer_routes WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'custom', 'Another meeting point', 'Describe the place and we will agree the exact spot.', 0, 0, 0, 30 FROM transfer_routes WHERE slug = 'batumi-gudauri';

INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'city', 'Your address in Kazbegi', 'Hotel or guesthouse in Stepantsminda.', 0, 1, 1, 10 FROM transfer_routes WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'custom', 'Another meeting point', 'Gergeti, a viewpoint or any agreed spot.', 0, 0, 0, 20 FROM transfer_routes WHERE slug = 'kazbegi-gudauri';

INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'airport', 'Vladikavkaz Airport', 'We track your flight and wait in arrivals.', 1, 0, 1, 10 FROM transfer_routes WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'city', 'Any address in Vladikavkaz', 'Hotel, apartment or a street address in the city.', 0, 1, 0, 20 FROM transfer_routes WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_pickup_points (route_id, kind, label, hint, requires_flight, requires_address, is_default, sort_order)
SELECT id, 'custom', 'The Dariali border crossing', 'Meet on either side of the border once you clear passport control.', 0, 0, 0, 30 FROM transfer_routes WHERE slug = 'vladikavkaz-gudauri';
