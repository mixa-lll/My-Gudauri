UPDATE categories SET href = '/rental', updated_at = CURRENT_TIMESTAMP WHERE slug = 'rent';
UPDATE categories SET href = '/transfers', updated_at = CURRENT_TIMESTAMP WHERE slug = 'transfer';
UPDATE categories SET href = '/activities', updated_at = CURRENT_TIMESTAMP WHERE slug = 'activity';
UPDATE categories SET href = '/services', updated_at = CURRENT_TIMESTAMP WHERE slug = 'services';
UPDATE categories
SET href = '/places',
    description = 'Restaurants, wellness, local essentials',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'places';

INSERT INTO categories (slug, name, description, icon_url, href, is_enabled, sort_order)
VALUES ('stays', 'Stays', 'Apartments, hotels, chalets', '/assets/navbar/icon-places.png', '/stays', 1, 55)
ON CONFLICT(slug) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  icon_url = excluded.icon_url,
  href = excluded.href,
  is_enabled = excluded.is_enabled,
  sort_order = excluded.sort_order,
  updated_at = CURRENT_TIMESTAMP;
