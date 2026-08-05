PRAGMA foreign_keys = ON;

-- A guest booking a car wants to know which car. The fleet was named after its
-- class — "Comfort sedan" — which the body-type tag beside the name already
-- says, so the name now carries the make and model and lets the tag do the
-- classifying. Models match the photography each vehicle ships with.
UPDATE transfer_vehicles SET make = 'Toyota', model = 'Camry', name = 'Toyota Camry', updated_at = CURRENT_TIMESTAMP WHERE slug = 'comfort-sedan-3';
UPDATE transfer_vehicles SET make = 'Toyota', model = 'Land Cruiser', name = 'Toyota Land Cruiser', updated_at = CURRENT_TIMESTAMP WHERE slug = 'winter-suv-4';
UPDATE transfer_vehicles SET make = 'Chrysler', model = 'Pacifica', name = 'Chrysler Pacifica', updated_at = CURRENT_TIMESTAMP WHERE slug = 'minivan-7';
UPDATE transfer_vehicles SET make = 'Mercedes-Benz', model = 'V-Class', name = 'Mercedes-Benz V-Class', updated_at = CURRENT_TIMESTAMP WHERE slug = 'minivan-6';
UPDATE transfer_vehicles SET make = 'Mercedes-Benz', model = 'Sprinter', name = 'Mercedes-Benz Sprinter', updated_at = CURRENT_TIMESTAMP WHERE slug = 'minibus-16';

-- Offer names follow, since the card splits them into "vehicle · capacity".
UPDATE transfers SET name = (
  SELECT v.name || ' · up to ' || v.seats || ' seats' FROM transfer_vehicles v WHERE v.id = transfers.vehicle_id
), updated_at = CURRENT_TIMESTAMP
WHERE vehicle_id IS NOT NULL;
