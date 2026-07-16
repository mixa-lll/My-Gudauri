CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_url TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '/',
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (slug, name, description, icon_url, href, sort_order) VALUES
  ('instructors', 'Instructors', 'Ski, snowboard', '/assets/navbar/icon-instructors.png', '/instructors', 10),
  ('rent', 'Rent', 'Skis, Snowboards, Gloves, Helmets, Goggles', '/assets/navbar/icon-rent.png', '/rental', 20),
  ('transfer', 'Transfer', 'Batumi - Gudauri, Tbilisi - Gudauri', '/assets/navbar/icon-transfer.png', '/transfers', 30),
  ('activity', 'Activity', 'Freeride, Ski Touring, Heli-skiing, Excursions', '/assets/navbar/icon-activity.png', '/activities', 40),
  ('services', 'Services', 'Photo & Video Shoot, Nanny', '/assets/navbar/icon-services.png', '/services', 50),
  ('places', 'Places', 'Hotels, restaurants, events', '/assets/navbar/icon-places.png', '/places', 60);

CREATE INDEX categories_enabled_order_idx ON categories(is_enabled, sort_order, name);
