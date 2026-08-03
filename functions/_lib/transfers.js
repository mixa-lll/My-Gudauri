function parseJson(value) {
  try { return JSON.parse(value || '[]'); } catch { return []; }
}

function priceLabel(amount, currency) {
  const value = Number(amount || 0);
  return `${Number.isInteger(value) ? value : value.toFixed(2)} ${currency || 'GEL'}`;
}

/** Transfers are counted in rides rather than reviews on the public cards. */
function rideLabel(count) {
  return `${Number(count || 0)} ${Number(count || 0) === 1 ? 'ride' : 'rides'}`;
}

function mapSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    // The catalog card shows the route where an activity shows its category.
    category: row.category,
    route: row.category,
    description: row.description,
    image: row.card_image_url || null,
    imageAlt: row.hero_image_alt || row.category,
    rating: row.rating,
    reviews: rideLabel(row.review_count),
    reviewCount: row.review_count,
    price: priceLabel(row.price_amount, row.currency),
    priceAmount: row.price_amount,
    currency: row.currency,
    priceSuffix: row.price_suffix,
    tags: parseJson(row.tags_json),
    catalogGroup: row.catalog_group,
    city: row.catalog_group,
    vehicleClass: row.vehicle_class,
    seats: row.seats,
    duration: row.duration_label,
    pickupType: row.pickup_type
  };
}

const SUMMARY_SELECT = `
  SELECT t.*,
    COALESCE((
      SELECT json_group_array(item.label) FROM (
        SELECT label FROM transfer_tags WHERE transfer_id = t.id ORDER BY sort_order, id
      ) item
    ), '[]') AS tags_json
  FROM transfers t
`;

export async function listTransfers(db) {
  const result = await db.prepare(`${SUMMARY_SELECT} WHERE t.status = 'published' ORDER BY t.sort_order, t.name`).all();
  return result.results.map(mapSummary);
}

export async function getTransfer(db, slug) {
  const row = await db.prepare(`${SUMMARY_SELECT} WHERE t.status = 'published' AND t.slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return null;

  const [facts, included, media, reviews] = await db.batch([
    db.prepare('SELECT label, value FROM transfer_facts WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT label FROM transfer_included WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT media_type, url, thumbnail_url, alt, is_featured FROM transfer_media WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT author_name, context_label, rating, review_date, body, avatar_url FROM transfer_reviews WHERE transfer_id = ? AND is_published = 1 ORDER BY sort_order, id').bind(row.id)
  ]);

  return {
    ...mapSummary(row),
    heroImage: row.hero_image_url || row.card_image_url || null,
    heroImageAlt: row.hero_image_alt || row.category,
    // The catalog renders facts as [label, value] pairs.
    facts: facts.results.map((item) => [item.label, item.value]),
    included: included.results.map((item) => item.label),
    media: media.results.map((item) => ({
      type: item.media_type,
      src: item.url,
      thumbnail: item.thumbnail_url || item.url,
      alt: item.alt,
      featured: Boolean(item.is_featured)
    })),
    reviewsList: reviews.results.map((item) => ({
      author: item.author_name,
      context: item.context_label,
      rating: item.rating,
      date: item.review_date,
      body: item.body,
      avatar: item.avatar_url
    }))
  };
}
