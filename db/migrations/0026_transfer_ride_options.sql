PRAGMA foreign_keys = ON;

-- The request form now asks about child seats directly on the passenger step,
-- so the option catalog carries only what belongs beside the ride itself. Paid
-- options stay quoted rather than added to the estimate: the operator confirms
-- the final price with the vehicle.
DELETE FROM transfer_extras WHERE slug IN ('child-seat', 'booster-seat', 'name-sign');

UPDATE transfer_extras SET label = 'Ski or snowboard gear', description = 'Roof rack or extra space for skis and boards.', sort_order = 10 WHERE slug = 'ski-rack';
UPDATE transfer_extras SET label = 'Extra stop', description = 'A shop, a viewpoint or a second address on the way.', price_amount = 20, sort_order = 20 WHERE slug = 'extra-stop';

INSERT INTO transfer_extras (slug, label, description, price_amount, price_unit, max_quantity, sort_order) VALUES
  ('night-pickup', 'Night pickup', 'Between 00:00 and 06:00.', 50, 'per_request', 1, 30),
  ('special-item', 'Special item', 'Stroller, bike, wheelchair or anything bulky.', 0, 'per_request', 1, 40);
