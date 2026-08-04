PRAGMA foreign_keys = ON;

-- Fleet fill: every direction gets at least two capacity variants, every
-- transfer gets a real photo gallery, and vehicle_class values are unified
-- (Sedan / Minivan / 4×4 / Minibus) so the catalog's Vehicle filter reads
-- as a clean set of chips.

UPDATE transfers SET vehicle_class = 'Sedan', card_image_url = '/assets/transfers/sedan-black-road.jpg', hero_image_url = '/assets/transfers/sedan-black-road.jpg', updated_at = CURRENT_TIMESTAMP WHERE slug = 'tbilisi-airport-gudauri';
UPDATE transfers SET vehicle_class = 'Minivan', card_image_url = '/assets/transfers/minivan-highway.jpg', hero_image_url = '/assets/transfers/minivan-highway.jpg', updated_at = CURRENT_TIMESTAMP WHERE slug = 'tbilisi-minivan-gudauri';
UPDATE transfers SET vehicle_class = 'Sedan', card_image_url = '/assets/transfers/sedan-snow-road.jpg', hero_image_url = '/assets/transfers/sedan-snow-road.jpg', updated_at = CURRENT_TIMESTAMP WHERE slug = 'kutaisi-gudauri';
UPDATE transfers SET vehicle_class = 'Sedan', card_image_url = '/assets/transfers/sedan-black-road.jpg', hero_image_url = '/assets/transfers/sedan-black-road.jpg', updated_at = CURRENT_TIMESTAMP WHERE slug = 'batumi-gudauri';
UPDATE transfers SET vehicle_class = '4×4', card_image_url = '/assets/transfers/suv-snow-road.jpg', hero_image_url = '/assets/transfers/suv-snow-road.jpg', updated_at = CURRENT_TIMESTAMP WHERE slug = 'kazbegi-gudauri';
UPDATE transfers SET vehicle_class = 'Minivan', card_image_url = '/assets/transfers/minivan-black-front.jpg', hero_image_url = '/assets/transfers/minivan-black-front.jpg', updated_at = CURRENT_TIMESTAMP WHERE slug = 'vladikavkaz-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('tbilisi-suv-gudauri', 'published', '4×4 · up to 4 seats', 'Gudauri ↔ Tbilisi Airport', 'A winter-confident SUV for heavy snow days, with space for four and full ski luggage.', '/assets/transfers/suv-snow-canyon.jpg', '/assets/transfers/suv-snow-canyon.jpg', 'Gudauri ↔ Tbilisi Airport', 220, 'GEL', 'per vehicle', 4.9, 41, 'tbilisi', '4×4', 4, '~2 hours', 'airport', 12);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~2 hours', 0 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Winter tyres', 1 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Ski rack', 2 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', '4×4', 0 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 4', 1 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~2 hours', 2 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Luggage', '4 + skis', 3 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 0 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flight tracking', 1 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 2 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Child seat on request', 3 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('tbilisi-minibus-gudauri', 'published', 'Minibus · up to 16 seats', 'Gudauri ↔ Tbilisi', 'A Sprinter-class minibus for big groups and ski clubs, with a trailer option for equipment.', '/assets/transfers/minibus-snow-road.jpg', '/assets/transfers/minibus-snow-road.jpg', 'Gudauri ↔ Tbilisi', 450, 'GEL', 'per vehicle', 4.8, 27, 'tbilisi', 'Minibus', 16, '~2.5 hours', 'city', 14);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~2.5 hours', 0 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Groups & clubs', 1 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Trailer option', 2 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Minibus', 0 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 16', 1 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~2.5 hours', 2 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Bags', '16 + skis', 3 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Door pickup', 0 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flight tracking', 1 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski trailer', 2 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Water', 3 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('kutaisi-minivan-gudauri', 'published', 'Minivan · up to 7 seats', 'Gudauri ↔ Kutaisi Airport', 'A spacious minivan from Kutaisi airport for families and groups with full ski luggage.', '/assets/transfers/minivan-highway.jpg', '/assets/transfers/minivan-highway.jpg', 'Gudauri ↔ Kutaisi Airport', 520, 'GEL', 'per vehicle', 4.9, 18, 'kutaisi', 'Minivan', 7, '~4.5 hours', 'airport', 32);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~4.5 hours', 0 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 1 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Comfort stop', 2 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Minivan', 0 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 7', 1 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~4.5 hours', 2 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Stops', 'On request', 3 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Meet & greet', 0 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flight tracking', 1 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Comfort stop', 2 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 3 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('batumi-minivan-gudauri', 'published', 'Minivan · up to 7 seats', 'Gudauri ↔ Batumi', 'A coast-to-mountains minivan for groups, with two comfort stops on the long way up.', '/assets/transfers/minivan-highway.jpg', '/assets/transfers/minivan-highway.jpg', 'Gudauri ↔ Batumi', 650, 'GEL', 'per vehicle', 4.7, 12, 'batumi', 'Minivan', 7, '~6 hours', 'city', 42);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~6 hours', 0 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Two stops', 1 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Groups', 2 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Minivan', 0 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 7', 1 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~6 hours', 2 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Stops', 'Two', 3 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Door pickup', 0 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Two comfort stops', 1 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 2 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Water', 3 FROM transfers WHERE slug = 'batumi-minivan-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('kazbegi-minivan-gudauri', 'published', 'Minivan · up to 6 seats', 'Gudauri ↔ Kazbegi', 'A winter-ready minivan across the Cross Pass for groups visiting Kazbegi and Gergeti.', '/assets/transfers/minivan-black-front.jpg', '/assets/transfers/minivan-black-front.jpg', 'Gudauri ↔ Kazbegi', 200, 'GEL', 'per vehicle', 4.8, 22, 'kazbegi', 'Minivan', 6, '~1 hour', 'city', 52);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '~1 hour', 0 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Cross Pass', 1 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Groups', 2 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Minivan', 0 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 6', 1 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Journey', '~1 hour', 2 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Route', 'Cross Pass', 3 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Door pickup', 0 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Winter tyres', 1 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Luggage', 2 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Flexible time', 3 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';

INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES ('vladikavkaz-sedan-gudauri', 'published', 'Sedan · up to 3 seats', 'Gudauri ↔ Vladikavkaz', 'A private sedan across the Dariali border with document guidance on the way.', '/assets/transfers/sedan-black-road.jpg', '/assets/transfers/sedan-black-road.jpg', 'Gudauri ↔ Vladikavkaz', 320, 'GEL', 'per vehicle', 4.8, 15, 'vladikavkaz', 'Sedan', 3, '3–6 hours', 'airport', 62);
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, '3–6 hours', 0 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Border crossing', 1 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_tags (transfer_id, label, sort_order) SELECT id, 'Ski rack', 2 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Class', 'Sedan', 0 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Seats', 'Up to 3', 1 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Border', 'Documents required', 2 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_facts (transfer_id, label, value, sort_order) SELECT id, 'Time', 'Variable', 3 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Airport pickup', 0 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Border guidance', 1 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Ski luggage', 2 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_included (transfer_id, label, sort_order) SELECT id, 'Waiting', 3 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';

-- Photo galleries: three shots per transfer, first one featured.
DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'tbilisi-airport-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-black-road.jpg', 'Comfort sedan on the road', 1, 0 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-snow-road.jpg', 'Sedan in fresh snowfall', 0, 1 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/winter-highway.jpg', 'Winter highway to the mountains', 0, 2 FROM transfers WHERE slug = 'tbilisi-airport-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'tbilisi-minivan-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-highway.jpg', 'Minivan on the mountain highway', 1, 0 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-black-front.jpg', 'Black minivan ready for pickup', 0, 1 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/van-interior-leather.jpg', 'Leather cabin with space for the whole group', 0, 2 FROM transfers WHERE slug = 'tbilisi-minivan-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'kutaisi-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-black-road.jpg', 'Comfort sedan on the road', 1, 0 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-snow-road.jpg', 'Sedan in fresh snowfall', 0, 1 FROM transfers WHERE slug = 'kutaisi-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/winter-highway.jpg', 'Winter highway to the mountains', 0, 2 FROM transfers WHERE slug = 'kutaisi-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'batumi-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-black-road.jpg', 'Comfort sedan on the road', 1, 0 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-snow-road.jpg', 'Sedan in fresh snowfall', 0, 1 FROM transfers WHERE slug = 'batumi-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/winter-highway.jpg', 'Winter highway to the mountains', 0, 2 FROM transfers WHERE slug = 'batumi-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'kazbegi-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/suv-snow-road.jpg', 'Winter-ready 4×4 on a snow road', 1, 0 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/suv-snow-canyon.jpg', '4×4 in the snowy canyon', 0, 1 FROM transfers WHERE slug = 'kazbegi-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/winter-road-peaks.jpg', 'Mountain road under the peaks', 0, 2 FROM transfers WHERE slug = 'kazbegi-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'vladikavkaz-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-black-front.jpg', 'Black minivan ready for pickup', 1, 0 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-highway.jpg', 'Minivan on the mountain highway', 0, 1 FROM transfers WHERE slug = 'vladikavkaz-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/van-interior-leather.jpg', 'Leather cabin with space for the whole group', 0, 2 FROM transfers WHERE slug = 'vladikavkaz-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'tbilisi-suv-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/suv-snow-road.jpg', 'Winter-ready 4×4 on a snow road', 1, 0 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/suv-snow-canyon.jpg', '4×4 in the snowy canyon', 0, 1 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/winter-road-peaks.jpg', 'Mountain road under the peaks', 0, 2 FROM transfers WHERE slug = 'tbilisi-suv-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'tbilisi-minibus-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minibus-snow-road.jpg', 'Sprinter-class minibus by the winter forest', 1, 0 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minibus-mountain-road.jpg', 'Minibus on the mountain road', 0, 1 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minibus-transit.jpg', 'High-roof minibus with group luggage space', 0, 2 FROM transfers WHERE slug = 'tbilisi-minibus-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'kutaisi-minivan-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-highway.jpg', 'Minivan on the mountain highway', 1, 0 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-black-front.jpg', 'Black minivan ready for pickup', 0, 1 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/van-interior-leather.jpg', 'Leather cabin with space for the whole group', 0, 2 FROM transfers WHERE slug = 'kutaisi-minivan-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'batumi-minivan-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-highway.jpg', 'Minivan on the mountain highway', 1, 0 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-black-front.jpg', 'Black minivan ready for pickup', 0, 1 FROM transfers WHERE slug = 'batumi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/van-interior-leather.jpg', 'Leather cabin with space for the whole group', 0, 2 FROM transfers WHERE slug = 'batumi-minivan-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'kazbegi-minivan-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-black-front.jpg', 'Black minivan ready for pickup', 1, 0 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/minivan-highway.jpg', 'Minivan on the mountain highway', 0, 1 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/van-interior-leather.jpg', 'Leather cabin with space for the whole group', 0, 2 FROM transfers WHERE slug = 'kazbegi-minivan-gudauri';

DELETE FROM transfer_media WHERE transfer_id IN (SELECT id FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri');
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-black-road.jpg', 'Comfort sedan on the road', 1, 0 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/sedan-snow-road.jpg', 'Sedan in fresh snowfall', 0, 1 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
INSERT INTO transfer_media (transfer_id, media_type, url, alt, is_featured, sort_order) SELECT id, 'image', '/assets/transfers/winter-highway.jpg', 'Winter highway to the mountains', 0, 2 FROM transfers WHERE slug = 'vladikavkaz-sedan-gudauri';
