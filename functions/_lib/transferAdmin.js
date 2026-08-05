import { TRANSFER_DEFAULTS, resolveTransfer, validateTransfer } from '../../src/shared/transferDefaults.js';
import { toSlug } from '../../src/shared/slug.js';
import { collectMediaGarbage, nextSortOrder, resolveUniqueSlug } from './cms.js';

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const blank = (value) => value === '' || value === null || value === undefined || !Number.isFinite(Number(value));
const optionalInteger = (value, fallback) => blank(value) ? fallback : Math.round(Number(value));
const optionalDecimal = (value, fallback) => blank(value) ? fallback : Number(value);

function routeEnds(label, city) {
  const parts = text(label).split(/\s*↔\s*/).filter(Boolean);
  const gudauriIndex = parts.findIndex((part) => part.toLowerCase() === 'gudauri');
  const other = parts[gudauriIndex === 0 ? 1 : 0] || text(city, 'Transfer point');
  return { origin: other, destination: 'Gudauri' };
}

async function ensureTransferEntities(db, payload, resolved, existing) {
  let vehicleId = optionalInteger(payload.vehicle_id, existing?.vehicle_id ?? null);
  let routeId = optionalInteger(payload.route_id, existing?.route_id ?? null);

  if (!vehicleId) {
    const vehicleSlug = toSlug(payload.vehicle_slug) || toSlug(`${resolved.name}-${payload.seats || resolved.vehicle_class || 'vehicle'}`);
    const found = await db.prepare('SELECT id FROM transfer_vehicles WHERE slug = ?').bind(vehicleSlug).first();
    if (found) vehicleId = found.id;
    else {
      const created = await db.prepare('INSERT INTO transfer_vehicles (slug, name, class_name, seats) VALUES (?, ?, ?, ?)')
        .bind(vehicleSlug, resolved.name, resolved.vehicle_class, Math.max(1, optionalInteger(payload.seats, 1))).run();
      vehicleId = created.meta.last_row_id;
    }
  }

  const ends = routeEnds(resolved.category, resolved.catalog_group);
  if (!routeId) {
    const routeSlug = toSlug(payload.route_slug) || toSlug(`${ends.origin}-gudauri`);
    const found = await db.prepare('SELECT id FROM transfer_routes WHERE slug = ?').bind(routeSlug).first();
    if (found) routeId = found.id;
    else {
      const created = await db.prepare('INSERT INTO transfer_routes (slug, origin_name, destination_name, zone_type, duration_label) VALUES (?, ?, ?, ?, ?)')
        .bind(routeSlug, ends.origin, ends.destination, resolved.pickup_type, resolved.duration_label).run();
      routeId = created.meta.last_row_id;
    }
  }

  await db.batch([
    db.prepare('UPDATE transfer_vehicles SET name=?, class_name=?, seats=?, large_bags=?, carry_on_bags=?, ski_capacity=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .bind(resolved.name, resolved.vehicle_class, Math.max(1, optionalInteger(payload.seats, 1)), Math.max(0, optionalInteger(payload.large_bags, 0)), Math.max(0, optionalInteger(payload.carry_on_bags, 0)), Math.max(0, optionalInteger(payload.ski_capacity, 0)), vehicleId),
    db.prepare('UPDATE transfer_routes SET origin_name=?, destination_name=?, zone_type=?, distance_km=?, duration_label=?, road_notice=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .bind(ends.origin, ends.destination, resolved.pickup_type, optionalDecimal(payload.distance_km, null), resolved.duration_label, text(payload.road_notice) || null, routeId),
  ]);
  return { vehicleId, routeId };
}

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
  const [tags, facts, included, legacyMedia, legacyReviews, vehicleOptions, vehicleMedia, vehicleReviews, conditions, vehicleRecord, routeRecord] = await db.batch([
    db.prepare('SELECT label FROM transfer_tags WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label, value FROM transfer_facts WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM transfer_included WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT media_type AS type, url, thumbnail_url, alt, is_featured AS featured FROM transfer_media WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT author_name AS author, context_label AS context, rating, review_date AS date, body, avatar_url AS avatar, is_published AS published FROM transfer_reviews WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM transfer_vehicle_options WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.vehicle_id),
    db.prepare('SELECT media_type AS type, url, thumbnail_url, alt, is_featured AS featured FROM transfer_vehicle_media WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.vehicle_id),
    db.prepare('SELECT route_id, author_name AS author, rating, review_date AS date, body, avatar_url AS avatar, is_published AS published FROM transfer_vehicle_reviews WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.vehicle_id),
    db.prepare('SELECT id, label, value, description FROM transfer_offer_conditions WHERE transfer_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT large_bags, carry_on_bags, ski_capacity FROM transfer_vehicles WHERE id = ?').bind(base.vehicle_id),
    db.prepare('SELECT distance_km, road_notice FROM transfer_routes WHERE id = ?').bind(base.route_id)
  ]);
  const media = vehicleMedia.results.length ? vehicleMedia : legacyMedia;
  const reviews = vehicleReviews.results.length ? vehicleReviews : legacyReviews;
  return {
    ...base,
    ...(vehicleRecord.results[0] ?? {}),
    ...(routeRecord.results[0] ?? {}),
    tags: tags.results.map((item) => item.label),
    facts: facts.results,
    included: included.results.map((item) => item.label),
    vehicle_options: vehicleOptions.results.map((item) => item.label),
    conditions: conditions.results,
    media: media.results.map((item) => ({ ...item, featured: Boolean(item.featured) })),
    reviewsList: reviews.results.map((item) => ({ ...item, published: Boolean(item.published) }))
  };
}

async function replaceVehicleRelations(db, vehicleId, routeId, transferId, payload) {
  if (!vehicleId) return;
  const statements = [];
  if (Array.isArray(payload.vehicle_options)) {
    statements.push(db.prepare('DELETE FROM transfer_vehicle_options WHERE vehicle_id = ?').bind(vehicleId));
    payload.vehicle_options.filter(Boolean).forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_options (vehicle_id, label, sort_order) VALUES (?, ?, ?)').bind(vehicleId, text(label), index)));
  }
  if (Array.isArray(payload.media)) {
    statements.push(db.prepare('DELETE FROM transfer_vehicle_media WHERE vehicle_id = ?').bind(vehicleId));
    payload.media.filter((item) => text(item?.url)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_media (vehicle_id, media_type, url, thumbnail_url, alt, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(vehicleId, item.type === 'video' ? 'video' : 'image', text(item.url), text(item.thumbnail_url || item.thumbnail) || null, text(item.alt, 'Transfer vehicle photo'), item.featured ? 1 : 0, index)));
  }
  if (Array.isArray(payload.reviewsList)) {
    statements.push(db.prepare('DELETE FROM transfer_vehicle_reviews WHERE vehicle_id = ?').bind(vehicleId));
    payload.reviewsList.filter((item) => text(item?.author) && text(item?.body)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_reviews (vehicle_id, route_id, author_name, rating, review_date, body, avatar_url, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(vehicleId, optionalInteger(item.route_id, routeId), text(item.author), Math.max(1, Math.min(5, integer(item.rating, 5))), text(item.date), text(item.body), text(item.avatar) || null, item.published === false ? 0 : 1, index)));
  }
  if (Array.isArray(payload.conditions)) {
    statements.push(db.prepare('DELETE FROM transfer_offer_conditions WHERE transfer_id = ?').bind(transferId));
    payload.conditions.filter((item) => text(item?.label) && text(item?.value)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_offer_conditions (transfer_id, label, value, description, sort_order) VALUES (?, ?, ?, ?, ?)').bind(transferId, text(item.label), text(item.value), text(item.description) || null, index)));
  }
  if (statements.length) await db.batch(statements);
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

  const existing = currentSlug ? await db.prepare('SELECT id, vehicle_id, route_id FROM transfers WHERE slug = ?').bind(currentSlug).first() : null;
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
  const { vehicleId, routeId } = await ensureTransferEntities(db, payload, resolved, existing);

  const values = [
    slug, resolved.status, resolved.name, resolved.category, resolved.description,
    resolved.card_image_url || null, resolved.hero_image_url || null, resolved.hero_image_alt,
    Math.max(0, optionalDecimal(payload.price_amount, TRANSFER_DEFAULTS.price_amount)), resolved.currency, resolved.price_suffix,
    Math.max(0, Math.min(5, optionalDecimal(payload.rating, TRANSFER_DEFAULTS.rating))), Math.max(0, optionalInteger(payload.review_count, TRANSFER_DEFAULTS.review_count)),
    resolved.catalog_group, resolved.vehicle_class, optionalInteger(payload.seats, null), resolved.duration_label, resolved.pickup_type,
    sortOrder, vehicleId, routeId, payload.exact_vehicle ? 1 : 0
  ];

  let transferId;
  if (existing) {
    await db.prepare('UPDATE transfers SET slug=?, status=?, name=?, category=?, description=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, price_amount=?, currency=?, price_suffix=?, rating=?, review_count=?, catalog_group=?, vehicle_class=?, seats=?, duration_label=?, pickup_type=?, sort_order=?, vehicle_id=?, route_id=?, exact_vehicle=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, existing.id).run();
    transferId = existing.id;
  } else {
    const created = await db.prepare('INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, sort_order, vehicle_id, route_id, exact_vehicle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...values).run();
    transferId = created.meta.last_row_id;
  }

  await replaceRelations(db, transferId, payload);
  await replaceVehicleRelations(db, vehicleId, routeId, transferId, payload);
  const saved = await getAdminTransfer(db, slug);
  const dropped = previousMedia.filter((url) => !transferMediaUrls(saved).includes(url));
  if (dropped.length) await collectMediaGarbage(db, bucket, dropped);
  return saved;
}
