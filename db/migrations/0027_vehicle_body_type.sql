PRAGMA foreign_keys = ON;

-- Body type is what a guest recognises at a glance — a sedan is a different
-- promise from a minibus regardless of what the class is called. It is kept
-- apart from `class_name`, which stays free marketing text, so the catalog can
-- illustrate and filter on a closed set.
ALTER TABLE transfer_vehicles ADD COLUMN body_type TEXT
  CHECK (body_type IS NULL OR body_type IN ('sedan', 'hatchback', 'suv', 'minivan', 'minibus'));

UPDATE transfer_vehicles SET body_type = 'sedan', updated_at = CURRENT_TIMESTAMP WHERE slug = 'comfort-sedan-3';
UPDATE transfer_vehicles SET body_type = 'suv', updated_at = CURRENT_TIMESTAMP WHERE slug = 'winter-suv-4';
UPDATE transfer_vehicles SET body_type = 'minivan', updated_at = CURRENT_TIMESTAMP WHERE slug IN ('minivan-6', 'minivan-7');
UPDATE transfer_vehicles SET body_type = 'minibus', updated_at = CURRENT_TIMESTAMP WHERE slug = 'minibus-16';
