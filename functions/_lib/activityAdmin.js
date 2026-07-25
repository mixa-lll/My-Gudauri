import { slugify } from './admin';

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const decimal = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const status = (value) => ['draft', 'published', 'archived'].includes(value) ? value : 'draft';

export async function listAdminActivities(db) {
  const { results } = await db.prepare(`
    SELECT a.id, a.slug, a.status, a.name, a.category, a.card_image_url AS image, a.sort_order, a.updated_at,
      COALESCE((SELECT json_group_array(item.label) FROM (SELECT label FROM activity_tags WHERE activity_id = a.id ORDER BY sort_order, id LIMIT 3) item), '[]') AS tags_json
    FROM activities a ORDER BY a.sort_order, a.name
  `).all();
  return results.map((item) => ({ ...item, tags: JSON.parse(item.tags_json || '[]') }));
}

export async function getAdminActivity(db, slug) {
  const base = await db.prepare('SELECT * FROM activities WHERE slug = ?').bind(slug).first();
  if (!base) return null;
  const [tags, facts, included, excluded, equipment, schedule, media, reviews] = await db.batch([
    db.prepare('SELECT label FROM activity_tags WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label, value FROM activity_facts WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM activity_included WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM activity_excluded WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM activity_equipment WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT time_label AS time, title, description FROM activity_schedule WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT media_type AS type, url, thumbnail_url, alt, is_featured AS featured FROM activity_media WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT author_name AS author, context_label AS context, rating, review_date AS date, body, avatar_url AS avatar, is_published AS published FROM activity_reviews WHERE activity_id = ? ORDER BY sort_order, id').bind(base.id)
  ]);
  return {
    ...base,
    tags: tags.results.map((item) => item.label),
    facts: facts.results,
    included: included.results.map((item) => item.label),
    excluded: excluded.results.map((item) => item.label),
    equipment: equipment.results.map((item) => item.label),
    schedule: schedule.results,
    media: media.results.map((item) => ({ ...item, featured: Boolean(item.featured) })),
    reviewsList: reviews.results.map((item) => ({ ...item, published: Boolean(item.published) }))
  };
}

async function replaceRelations(db, activityId, payload) {
  const statements = [
    db.prepare('DELETE FROM activity_tags WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_facts WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_included WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_excluded WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_equipment WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_schedule WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_media WHERE activity_id = ?').bind(activityId),
    db.prepare('DELETE FROM activity_reviews WHERE activity_id = ?').bind(activityId)
  ];
  (Array.isArray(payload.tags) ? payload.tags : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO activity_tags (activity_id, label, sort_order) VALUES (?, ?, ?)').bind(activityId, text(label), index)));
  (Array.isArray(payload.facts) ? payload.facts : []).filter((item) => text(item?.label) && text(item?.value)).forEach((item, index) => statements.push(db.prepare('INSERT INTO activity_facts (activity_id, label, value, sort_order) VALUES (?, ?, ?, ?)').bind(activityId, text(item.label), text(item.value), index)));
  (Array.isArray(payload.included) ? payload.included : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO activity_included (activity_id, label, sort_order) VALUES (?, ?, ?)').bind(activityId, text(label), index)));
  (Array.isArray(payload.excluded) ? payload.excluded : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO activity_excluded (activity_id, label, sort_order) VALUES (?, ?, ?)').bind(activityId, text(label), index)));
  (Array.isArray(payload.equipment) ? payload.equipment : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO activity_equipment (activity_id, label, sort_order) VALUES (?, ?, ?)').bind(activityId, text(label), index)));
  (Array.isArray(payload.schedule) ? payload.schedule : []).filter((item) => text(item?.time) && text(item?.title)).forEach((item, index) => statements.push(db.prepare('INSERT INTO activity_schedule (activity_id, time_label, title, description, sort_order) VALUES (?, ?, ?, ?, ?)').bind(activityId, text(item.time), text(item.title), text(item.description) || null, index)));
  (Array.isArray(payload.media) ? payload.media : []).filter((item) => text(item?.url)).forEach((item, index) => statements.push(db.prepare('INSERT INTO activity_media (activity_id, media_type, url, thumbnail_url, alt, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(activityId, item.type === 'video' ? 'video' : 'image', text(item.url), text(item.thumbnail_url || item.thumbnail) || null, text(item.alt, 'Activity photo'), item.featured ? 1 : 0, index)));
  (Array.isArray(payload.reviewsList) ? payload.reviewsList : []).filter((item) => text(item?.author) && text(item?.body)).forEach((item, index) => statements.push(db.prepare('INSERT INTO activity_reviews (activity_id, author_name, context_label, rating, review_date, body, avatar_url, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(activityId, text(item.author), text(item.context, 'Activity'), Math.max(1, Math.min(5, integer(item.rating, 5))), text(item.date), text(item.body), text(item.avatar) || null, item.published === false ? 0 : 1, index)));
  await db.batch(statements);
}

export async function saveActivity(db, payload, currentSlug) {
  const name = text(payload.name);
  const slug = slugify(payload.slug || name);
  const category = text(payload.category);
  const description = text(payload.description);
  if (!name || !slug || !category || !description) throw new Error('Name, slug, category and description are required. Images are optional.');
  const values = [
    slug, status(payload.status), name, category, description,
    text(payload.card_image_url) || null, text(payload.hero_image_url) || null, text(payload.hero_image_alt) || null,
    Math.max(0, decimal(payload.price_amount)), text(payload.currency, 'GEL').toUpperCase(), text(payload.price_suffix) || null,
    Math.max(0, Math.min(5, decimal(payload.rating))), Math.max(0, integer(payload.review_count)),
    text(payload.catalog_group, 'other'), text(payload.skill_level) || null, text(payload.duration_group) || null, text(payload.format) || null,
    integer(payload.sort_order)
  ];
  let activityId;
  if (currentSlug) {
    const existing = await db.prepare('SELECT id FROM activities WHERE slug = ?').bind(currentSlug).first();
    if (!existing) return null;
    await db.prepare('UPDATE activities SET slug=?, status=?, name=?, category=?, description=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, price_amount=?, currency=?, price_suffix=?, rating=?, review_count=?, catalog_group=?, skill_level=?, duration_group=?, format=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, existing.id).run();
    activityId = existing.id;
  } else {
    const created = await db.prepare('INSERT INTO activities (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, skill_level, duration_group, format, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...values).run();
    activityId = created.meta.last_row_id;
  }
  await replaceRelations(db, activityId, payload);
  return getAdminActivity(db, slug);
}
