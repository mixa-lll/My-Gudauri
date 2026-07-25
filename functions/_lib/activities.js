function parseJson(value) {
  try { return JSON.parse(value || '[]'); } catch { return []; }
}

function priceLabel(amount, currency) {
  const value = Number(amount || 0);
  return `${Number.isInteger(value) ? value : value.toFixed(2)} ${currency || 'GEL'}`;
}

function reviewLabel(count) {
  return `${Number(count || 0)} ${Number(count || 0) === 1 ? 'review' : 'reviews'}`;
}

function mapSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    image: row.card_image_url || null,
    imageAlt: row.hero_image_alt || `${row.name} in Gudauri`,
    rating: row.rating,
    reviews: reviewLabel(row.review_count),
    reviewCount: row.review_count,
    price: priceLabel(row.price_amount, row.currency),
    priceAmount: row.price_amount,
    currency: row.currency,
    priceSuffix: row.price_suffix,
    tags: parseJson(row.tags_json),
    catalogGroup: row.catalog_group,
    skillLevel: row.skill_level,
    durationGroup: row.duration_group,
    format: row.format
  };
}

const SUMMARY_SELECT = `
  SELECT a.*,
    COALESCE((
      SELECT json_group_array(item.label) FROM (
        SELECT label FROM activity_tags WHERE activity_id = a.id ORDER BY sort_order, id
      ) item
    ), '[]') AS tags_json
  FROM activities a
`;

export async function listActivities(db) {
  const result = await db.prepare(`${SUMMARY_SELECT} WHERE a.status = 'published' ORDER BY a.sort_order, a.name`).all();
  return result.results.map(mapSummary);
}

export async function getActivity(db, slug) {
  const row = await db.prepare(`${SUMMARY_SELECT} WHERE a.status = 'published' AND a.slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return null;

  const [facts, included, excluded, equipment, schedule, media, reviews] = await db.batch([
    db.prepare('SELECT label, value FROM activity_facts WHERE activity_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT label FROM activity_included WHERE activity_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT label FROM activity_excluded WHERE activity_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT label FROM activity_equipment WHERE activity_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT time_label AS time, title, description FROM activity_schedule WHERE activity_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT media_type, url, thumbnail_url, alt, is_featured FROM activity_media WHERE activity_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT author_name, context_label, rating, review_date, body, avatar_url FROM activity_reviews WHERE activity_id = ? AND is_published = 1 ORDER BY sort_order, id').bind(row.id)
  ]);

  return {
    ...mapSummary(row),
    heroImage: row.hero_image_url || row.card_image_url || null,
    heroImageAlt: row.hero_image_alt || `${row.name} in Gudauri`,
    facts: facts.results.map((item) => ({ label: item.label, value: item.value })),
    included: included.results.map((item) => item.label),
    excluded: excluded.results.map((item) => item.label),
    equipment: equipment.results.map((item) => item.label),
    schedule: schedule.results,
    media: media.results.map((item) => ({
      type: item.media_type,
      src: item.url,
      thumbnail: item.thumbnail_url || item.url,
      alt: item.alt || `${row.name} in Gudauri`,
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
