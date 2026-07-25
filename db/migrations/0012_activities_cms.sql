PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  name TEXT NOT NULL,
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
  catalog_group TEXT NOT NULL DEFAULT 'other',
  skill_level TEXT,
  duration_group TEXT,
  format TEXT,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity_facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity_included (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_activities_status_sort ON activities(status, sort_order, name);
CREATE INDEX IF NOT EXISTS idx_activities_catalog_group ON activities(catalog_group);
CREATE INDEX IF NOT EXISTS idx_activity_tags_activity ON activity_tags(activity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_facts_activity ON activity_facts(activity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_included_activity ON activity_included(activity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_media_activity ON activity_media(activity_id, sort_order);

INSERT INTO activities (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, skill_level, duration_group, format, sort_order) VALUES
  ('kazbegi-gergeti', 'published', 'Kazbegi & Gergeti', 'Scenic tour', 'A full-day road trip through the dramatic Terek valley to Stepantsminda and the iconic Gergeti Trinity Church.', '/assets/activities/kobi-mountain-chapel.jpg', '/assets/activities/kobi-mountain-chapel.jpg', 'Snowy mountains and Gergeti church near Kazbegi', 120, 'GEL', 'per guest', 4.9, 86, 'excursions', 'Beginner friendly', 'Full day', 'With transfer', 10),
  ('snowmobile-plateau', 'published', 'Snowmobile plateau ride', 'Winter adventure', 'Ride across open snowfields above Gudauri with a guide and panoramic stops along the way.', '/assets/activities/gudauri-panorama-riders.jpg', '/assets/activities/gudauri-panorama-riders.jpg', 'Riders in snowy Gudauri mountains', 200, 'GEL', 'per ride', 4.8, 52, 'snow-air', 'Beginner friendly', 'Half day', 'Guided', 20),
  ('paragliding-gudauri', 'published', 'Paragliding over Gudauri', 'Air adventure', 'A tandem flight above the Caucasus with a certified pilot and a video of your experience.', '/assets/activities/freeride-ridge.jpg', '/assets/activities/freeride-ridge.jpg', 'Snowy Gudauri ridge viewed from above', 350, 'GEL', 'per guest', 4.9, 114, 'snow-air', 'Beginner friendly', 'Half day', 'Tandem', 30),
  ('heli-ski', 'published', 'Heli-ski drop', 'Advanced', 'Remote Caucasus lines, small groups and a certified mountain guide for experienced freeride guests.', '/assets/activities/powder-turn.png', '/assets/activities/powder-turn.png', 'Skier carving through deep powder', 900, 'GEL', 'per guest', 5, 31, 'freeride', 'Advanced', 'Full day', 'Small group', 40),
  ('freeride-day', 'published', 'Freeride discovery day', 'Ski & snowboard', 'Learn to read the terrain and discover the best snow for the day with a local freeride guide.', '/assets/activities/freeride-team-ridge.jpg', '/assets/activities/freeride-team-ridge.jpg', 'Freeride group on a snowy mountain ridge', 280, 'GEL', 'per guest', 4.9, 67, 'freeride', 'Intermediate+', 'Full day', 'Guided', 50),
  ('gastro-route', 'published', 'Khinkali & mountain wine route', 'Food & culture', 'A relaxed route through family kitchens and cellars with regional dishes and Georgian wine.', '/assets/activities/narovani-valley-road.jpg', '/assets/activities/narovani-valley-road.jpg', 'Road through the Narovani valley in winter', 110, 'GEL', 'per guest', 4.8, 43, 'excursions', 'Beginner friendly', 'Half day', 'With transfer', 60);

INSERT INTO activity_tags (activity_id, label, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), '1 day', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Easy', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Transfer', 2),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), '2 hours', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Equipment', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Guide', 2),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Tandem', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), '15–25 min', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Video', 2),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Advanced', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Full day', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Safety kit', 2),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), '6 hours', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Intermediate+', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Guide', 2),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Half day', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Tastings', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Transfer', 2);

INSERT INTO activity_facts (activity_id, label, value, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Duration', '8 hours', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Group', 'Up to 7', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Languages', 'EN · RU', 2), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Season', 'All year', 3),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Duration', '2 hours', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Level', 'Beginner', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Guests', '1–2', 2), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Season', 'Winter', 3),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Flight', '15–25 min', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Format', 'Tandem', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Pilot', 'Certified', 2), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Video', 'Included', 3),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Duration', 'Full day', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Level', 'Advanced', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Group', 'Up to 4', 2), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Runs', '3–5', 3),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Duration', '6 hours', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Level', 'Intermediate+', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Group', 'Up to 5', 2), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Terrain', 'Off-piste', 3),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Duration', '5 hours', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Group', 'Up to 8', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Meals', 'Included', 2), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Season', 'All year', 3);

INSERT INTO activity_included (activity_id, label, sort_order) VALUES
  ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Local guide', 0), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Return transfer', 1), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Photo stops', 2), ((SELECT id FROM activities WHERE slug = 'kazbegi-gergeti'), 'Water', 3),
  ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Safety briefing', 0), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Helmet', 1), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Fuel', 2), ((SELECT id FROM activities WHERE slug = 'snowmobile-plateau'), 'Local guide', 3),
  ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Certified pilot', 0), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Equipment', 1), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'GoPro video', 2), ((SELECT id FROM activities WHERE slug = 'paragliding-gudauri'), 'Slope transfer', 3),
  ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Mountain guide', 0), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Helicopter drops', 1), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Avalanche kit', 2), ((SELECT id FROM activities WHERE slug = 'heli-ski'), 'Lunch', 3),
  ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Certified guide', 0), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Route planning', 1), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Safety briefing', 2), ((SELECT id FROM activities WHERE slug = 'freeride-day'), 'Radio', 3),
  ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Local host', 0), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Three tastings', 1), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Return transfer', 2), ((SELECT id FROM activities WHERE slug = 'gastro-route'), 'Soft drinks', 3);

INSERT INTO activity_media (activity_id, media_type, url, thumbnail_url, alt, is_featured, sort_order)
SELECT id, 'image', hero_image_url, card_image_url, hero_image_alt, 1, 0 FROM activities;
