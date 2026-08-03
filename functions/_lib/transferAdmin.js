import { TRANSFER_DEFAULTS, resolveTransfer, validateTransfer } from '../../src/shared/transferDefaults.js';
import { collectMediaGarbage, nextSortOrder, resolveUniqueSlug } from './cms.js';

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const blank = (value) => value === '' || value === null || value === undefined || !Number.isFinite(Number(value));
const optionalInteger = (value, fallback) => blank(value) ? fallback : Math.round(Number(value));
const optionalDecimal = (value, fallback) => blank(value) ? fallback : Number(value);

export const transferMediaUrls = (record) => [
  record?.card_image_url,
  record?.hero_image_url,
  ...(Array.isArray(record?.media) ? record.media.map((item) => item.url) : []),
].filter(Boolean);

export async function listAdminTransfers(db) {
  const { results } = await db.prepare(`
    SELECT t.id, t.slug, t.status, t.name, t.category, t.card_image_url AS image, t.price_amount, t.currency,
      t.rating, t.review_count AS reviews, t.catalog_group, t.vehicle_class, t.seats, t.sort_order, t.updated_at,
      COALESCE((SELECT json_group_array(item.label) FROM (SELECT label FROM transfer_tags WHERE transfer_id = t.id ORDER BY sort_order, id LIMIT 3) item), '[]') AS tags_json
    FROM transfers t ORDER BY t.updated_at DESC, t.sort_order, t.name
  `).all();
  return results.map((item) => ({ ...item, tags: JSON.parse(item.tags_json || '[]') }));
}

export async function getAdminTransfer(db, slug) {
  const base = await db.prepare('SELECT * FROM transfers WHERE slug = ?').bind(slug).first();
  if (!base) return null;
  const [tags, facts, included, media, reviews] = await db.batch([
    db.prepare('SELECT label FROM transfer_tags WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label, value FROM transfer_facts WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM transfer_included WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT media_type AS type, url, thumbnail_url, alt, is_featured AS featured FROM transfer_media WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT author_name AS author, context_label AS context, rating, review_date AS date, body, avatar_url AS avatar, is_published AS published FROM transfer_reviews WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id)
  ]);
  return {
    ...base,
    tags: tags.results.map((item) => item.label),
    facts: facts.results,
    included: included.results.map((item) => item.label),
    media: media.results.map((item) => ({ ...item, featured: Boolean(item.featured) })),
    reviewsList: reviews.results.map((item) => ({ ...item, published: Boolean(item.published) }))
  };
}

async function replaceRelations(db, transferId, payload) {
  const statements = [
    db.prepare('DELETE FROM transfer_tags WHERE transfer_id = ?').bind(transferId),
    db.prepare('DELETE FROM transfer_facts WHERE transfer_id = ?').bind(transferId),
    db.prepare('DELETE FROM transfer_included WHERE transfer_id = ?').bind(transferId),
    db.prepare('DELETE FROM transfer_media WHERE transfer_id = ?').bind(transferId),
    db.prepare('DELETE FROM transfer_reviews WHERE transfer_id = ?').bind(transferId)
  ];
  (Array.isArray(payload.tags) ? payload.tags : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_tags (transfer_id, label, sort_order) VALUES (?, ?, ?)').bind(transferId, text(label), index)));
  (Array.isArray(payload.facts) ? payload.facts : []).filter((item) => text(item?.label) && text(item?.value)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_facts (transfer_id, label, value, sort_order) VALUES (?, ?, ?, ?)').bind(transferId, text(item.label), text(item.value), index)));
  (Array.isArray(payload.included) ? payload.included : []).filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_included (transfer_id, label, sort_order) VALUES (?, ?, ?)').bind(transferId, text(label), index)));
  (Array.isArray(payload.media) ? payload.media : []).filter((item) => text(item?.url)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_media (transfer_id, media_type, url, thumbnail_url, alt, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(transferId, item.type === 'video' ? 'video' : 'image', text(item.url), text(item.thumbnail_url || item.thumbnail) || null, text(item.alt, 'Transfer photo'), item.featured ? 1 : 0, index)));
  (Array.isArray(payload.reviewsList) ? payload.reviewsList : []).filter((item) => text(item?.author) && text(item?.body)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_reviews (transfer_id, author_name, context_label, rating, review_date, body, avatar_url, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(transferId, text(item.author), text(item.context, 'Transfer'), Math.max(1, Math.min(5, integer(item.rating, 5))), text(item.date), text(item.body), text(item.avatar) || null, item.published === false ? 0 : 1, index)));
  await db.batch(statements);
}

export async function saveTransfer(db, payload, currentSlug, { bucket } = {}) {
  const errors = validateTransfer(payload, { publishing: payload.status === 'published' });
  const firstError = Object.values(errors)[0];
  if (firstError) throw new Error(firstError);

  const existing = currentSlug ? await db.prepare('SELECT id FROM transfers WHERE slug = ?').bind(currentSlug).first() : null;
  if (currentSlug && !existing) return null;
  const previousMedia = existing ? transferMediaUrls(await getAdminTransfer(db, currentSlug)) : [];

  const resolved = resolveTransfer(payload);
  const slug = await resolveUniqueSlug(db, {
    table: 'transfers',
    requested: payload.slug,
    fallback: payload.name,
    currentId: existing?.id,
    conflictMessage: (base) => `Адрес /transfers/${base} уже занят другим трансфером. Выберите другой.`,
  });
  const sortOrder = optionalInteger(payload.sort_order, null) ?? await nextSortOrder(db, 'transfers');

  const values = [
    slug, resolved.status, resolved.name, resolved.category, resolved.description,
    resolved.card_image_url || null, resolved.hero_image_url || null, resolved.hero_image_alt,
    Math.max(0, optionalDecimal(payload.price_amount, TRANSFER_DEFAULTS.price_amount)), resolved.currency, resolved.price_suffix,
    Math.max(0, Math.min(5, optionalDecimal(payload.rating, TRANSFER_DEFAULTS.rating))), Math.max(0, optionalInteger(payload.review_count, TRANSFER_DEFAULTS.review_count)),
    resolved.catalog_group, resolved.vehicle_class, optionalInteger(payload.seats, null), resolved.duration_label, resolved.pickup_type,
    sortOrder
  ];

  let transferId;
  if (existing) {
    await db.prepare('UPDATE transfers SET slug=?, status=?, name=?, category=?, description=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, price_amount=?, currency=?, price_suffix=?, rating=?, review_count=?, catalog_group=?, vehicle_class=?, seats=?, duration_label=?, pickup_type=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, existing.id).run();
    transferId = existing.id;
  } else {
    const created = await db.prepare('INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...values).run();
    transferId = created.meta.last_row_id;
  }

  await replaceRelations(db, transferId, payload);
  const saved = await getAdminTransfer(db, slug);
  const dropped = previousMedia.filter((url) => !transferMediaUrls(saved).includes(url));
  if (dropped.length) await collectMediaGarbage(db, bucket, dropped);
  return saved;
}
