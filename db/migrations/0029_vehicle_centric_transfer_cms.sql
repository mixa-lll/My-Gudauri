PRAGMA foreign_keys = ON;

-- The admin flow flips to match how the fleet actually works: an operator
-- enters a vehicle once — photos, seats, luggage, options — and then attaches
-- routes with a price each. Every vehicle × route pair is materialised as a row
-- in `transfers`, which is what the public catalog already renders. For that
-- the vehicle needs to own its card imagery and its "what's included" list,
-- and the route needs to know which catalog city panel it belongs to.

ALTER TABLE transfer_vehicles ADD COLUMN card_image_url TEXT;
ALTER TABLE transfer_vehicles ADD COLUMN hero_image_url TEXT;
ALTER TABLE transfer_vehicles ADD COLUMN hero_image_alt TEXT;
ALTER TABLE transfer_vehicles ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 100;

CREATE TABLE transfer_vehicle_included (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL REFERENCES transfer_vehicles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_transfer_vehicle_included_vehicle
  ON transfer_vehicle_included (vehicle_id, sort_order, id);

-- The catalog's direction panel groups routes by city key (tbilisi, kutaisi…).
-- Until now the key lived on each offer; the route is its natural owner.
ALTER TABLE transfer_routes ADD COLUMN city TEXT;
ALTER TABLE transfer_routes ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 100;

-- Backfill vehicles from the first offer that used them.
UPDATE transfer_vehicles SET
  card_image_url = (SELECT t.card_image_url FROM transfers t WHERE t.vehicle_id = transfer_vehicles.id ORDER BY t.sort_order, t.id LIMIT 1),
  hero_image_url = (SELECT COALESCE(t.hero_image_url, t.card_image_url) FROM transfers t WHERE t.vehicle_id = transfer_vehicles.id ORDER BY t.sort_order, t.id LIMIT 1),
  hero_image_alt = name || ' on a mountain road',
  sort_order = COALESCE((SELECT MIN(t.sort_order) FROM transfers t WHERE t.vehicle_id = transfer_vehicles.id), 100);

INSERT INTO transfer_vehicle_included (vehicle_id, label, sort_order)
SELECT t.vehicle_id, i.label, i.sort_order
FROM transfers t
JOIN transfer_included i ON i.transfer_id = t.id
WHERE t.id IN (SELECT MIN(id) FROM transfers WHERE vehicle_id IS NOT NULL GROUP BY vehicle_id);

UPDATE transfer_routes SET
  city = COALESCE(
    (SELECT t.catalog_group FROM transfers t WHERE t.route_id = transfer_routes.id AND t.catalog_group IS NOT NULL AND t.catalog_group <> 'other' LIMIT 1),
    CASE WHEN instr(slug, '-') > 0 THEN substr(slug, 1, instr(slug, '-') - 1) ELSE slug END
  ),
  sort_order = id * 10;
