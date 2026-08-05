import { deriveOfferCard, normalizeOffers, resolveVehicle, validateRoutes, validateVehicle } from '../../src/shared/transferDefaults.js';
import { toSlug } from '../../src/shared/slug.js';
import { collectMediaGarbage, nextSortOrder, resolveUniqueSlug } from './cms.js';

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const blank = (value) => value === '' || value === null || value === undefined || !Number.isFinite(Number(value));
const optionalInteger = (value, fallback) => blank(value) ? fallback : Math.round(Number(value));
const optionalDecimal = (value, fallback) => blank(value) ? fallback : Number(value);

/**
 * The admin unit is the vehicle. Every route attached to it with a price is
 * materialised as one row in `transfers` — the table the public catalog
 * renders — so the site keeps working card-by-card while the operator thinks
 * fleet-first.
 */

export const transferMediaUrls = (record) => [
  record?.card_image_url,
  record?.hero_image_url,
  ...(Array.isArray(record?.media) ? record.media.map((item) => item.url) : []),
].filter(Boolean);

export async function listAdminTransfers(db) {
  const { results } = await db.prepare(`
    SELECT v.id, v.slug, v.status, v.name, v.body_type, v.class_name, v.seats,
      v.card_image_url AS image, v.sort_order, v.updated_at,
      (SELECT COUNT(*) FROM transfers t WHERE t.vehicle_id = v.id) AS offers_count,
      (SELECT MIN(t.price_amount) FROM transfers t WHERE t.vehicle_id = v.id AND t.price_amount > 0) AS price_from,
      COALESCE((SELECT t.currency FROM transfers t WHERE t.vehicle_id = v.id LIMIT 1), 'GEL') AS currency,
      COALESCE((SELECT ROUND(AVG(r.rating), 1) FROM transfer_vehicle_reviews r WHERE r.vehicle_id = v.id AND r.is_published = 1), 0) AS rating,
      (SELECT COUNT(*) FROM transfer_vehicle_reviews r WHERE r.vehicle_id = v.id AND r.is_published = 1) AS reviews,
      COALESCE((SELECT json_group_array(item.origin_name) FROM (
        SELECT r.origin_name FROM transfers t JOIN transfer_routes r ON r.id = t.route_id
        WHERE t.vehicle_id = v.id ORDER BY t.sort_order, t.id
      ) item), '[]') AS routes_json
    FROM transfer_vehicles v
    ORDER BY v.updated_at DESC, v.sort_order, v.name
  `).all();
  return results.map((item) => ({ ...item, routes: JSON.parse(item.routes_json || '[]') }));
}

export async function listTransferRoutes(db) {
  const { results } = await db.prepare(`
    SELECT r.id, r.slug, r.status, r.origin_name, r.destination_name, r.zone_type, r.city,
      r.distance_km, r.duration_label, r.road_notice, r.sort_order,
      (SELECT COUNT(*) FROM transfers t WHERE t.route_id = r.id) AS offers_count
    FROM transfer_routes r
    ORDER BY r.sort_order, r.id
  `).all();
  return results.map((route) => ({ ...route, published: route.status === 'published' }));
}

export async function getAdminTransfer(db, slug) {
  const base = await db.prepare('SELECT * FROM transfer_vehicles WHERE slug = ?').bind(slug).first();
  if (!base) return null;
  const [options, included, media, reviews, offers] = await db.batch([
    db.prepare('SELECT label FROM transfer_vehicle_options WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT label FROM transfer_vehicle_included WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT media_type AS type, url, thumbnail_url, alt, is_featured AS featured FROM transfer_vehicle_media WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT route_id, author_name AS author, rating, review_date AS date, body, avatar_url AS avatar, is_published AS published FROM transfer_vehicle_reviews WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.id),
    db.prepare('SELECT id, slug, route_id, price_amount, currency, status, exact_vehicle FROM transfers WHERE vehicle_id = ? ORDER BY sort_order, id').bind(base.id),
  ]);
  return {
    ...base,
    exact_vehicle: offers.results.some((offer) => offer.exact_vehicle),
    vehicle_options: options.results.map((item) => item.label),
    included: included.results.map((item) => item.label),
    media: media.results.map((item) => ({ ...item, featured: Boolean(item.featured) })),
    reviewsList: reviews.results.map((item) => ({ ...item, published: Boolean(item.published) })),
    offers: offers.results.map((offer) => ({
      id: offer.id,
      slug: offer.slug,
      route_id: offer.route_id,
      price_amount: offer.price_amount,
      currency: offer.currency,
      published: offer.status === 'published',
    })),
  };
}

async function replaceVehicleRelations(db, vehicleId, resolved, payload) {
  const statements = [
    db.prepare('DELETE FROM transfer_vehicle_options WHERE vehicle_id = ?').bind(vehicleId),
    db.prepare('DELETE FROM transfer_vehicle_included WHERE vehicle_id = ?').bind(vehicleId),
    db.prepare('DELETE FROM transfer_vehicle_media WHERE vehicle_id = ?').bind(vehicleId),
  ];
  resolved.vehicle_options.forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_options (vehicle_id, label, sort_order) VALUES (?, ?, ?)').bind(vehicleId, label, index)));
  resolved.included.forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_included (vehicle_id, label, sort_order) VALUES (?, ?, ?)').bind(vehicleId, label, index)));
  resolved.media.filter((item) => text(item?.url)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_media (vehicle_id, media_type, url, thumbnail_url, alt, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(vehicleId, item.type === 'video' ? 'video' : 'image', text(item.url), text(item.thumbnail_url || item.thumbnail) || null, text(item.alt, 'Transfer vehicle photo'), item.featured ? 1 : 0, index)));
  if (Array.isArray(payload.reviewsList)) {
    statements.push(db.prepare('DELETE FROM transfer_vehicle_reviews WHERE vehicle_id = ?').bind(vehicleId));
    payload.reviewsList.filter((item) => text(item?.author) && text(item?.body)).forEach((item, index) => statements.push(db.prepare('INSERT INTO transfer_vehicle_reviews (vehicle_id, route_id, author_name, rating, review_date, body, avatar_url, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(vehicleId, optionalInteger(item.route_id, null), text(item.author), Math.max(1, Math.min(5, integer(item.rating, 5))), text(item.date), text(item.body), text(item.avatar) || null, item.published === false ? 0 : 1, index)));
  }
  await db.batch(statements);
}

/** Derived card rows an offer carries: three facts, short tags, included list. */
async function replaceOfferDerivedRows(db, offerId, resolved, route) {
  const card = deriveOfferCard(resolved, route, {});
  const facts = [
    ['Class', resolved.class_name],
    ['Seats', `Up to ${resolved.seats}`],
    ['Journey', card.duration_label],
    ['Luggage', `${resolved.large_bags} + skis`],
  ].filter(([, value]) => text(String(value ?? '')));
  const tags = [card.duration_label, ...resolved.vehicle_options.slice(0, 2)].filter(Boolean);
  const statements = [
    db.prepare('DELETE FROM transfer_tags WHERE transfer_id = ?').bind(offerId),
    db.prepare('DELETE FROM transfer_facts WHERE transfer_id = ?').bind(offerId),
    db.prepare('DELETE FROM transfer_included WHERE transfer_id = ?').bind(offerId),
  ];
  tags.forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_tags (transfer_id, label, sort_order) VALUES (?, ?, ?)').bind(offerId, label, index)));
  facts.forEach(([label, value], index) => statements.push(db.prepare('INSERT INTO transfer_facts (transfer_id, label, value, sort_order) VALUES (?, ?, ?, ?)').bind(offerId, label, String(value), index)));
  resolved.included.forEach((label, index) => statements.push(db.prepare('INSERT INTO transfer_included (transfer_id, label, sort_order) VALUES (?, ?, ?)').bind(offerId, label, index)));
  await db.batch(statements);
}

/** New offers open with the standard ride conditions; operators edit later data in place. */
async function seedOfferConditions(db, offerId, card) {
  await db.batch([
    db.prepare('INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order) VALUES (?, ?, ?, 0)').bind(offerId, 'Waiting time', card.pickup_type === 'airport' ? '60 minutes after landing' : '15 minutes'),
    db.prepare('INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order) VALUES (?, ?, ?, 1)').bind(offerId, 'Stops', 'On request'),
    db.prepare('INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order) VALUES (?, ?, ?, 2)').bind(offerId, 'Cancellation', 'Free until confirmation'),
    db.prepare('INSERT INTO transfer_offer_conditions (transfer_id, label, value, sort_order) VALUES (?, ?, ?, 3)').bind(offerId, 'Children and pets', 'Tell us in the request'),
  ]);
}

function offerStatus(vehicleStatus, published) {
  if (vehicleStatus === 'archived') return 'archived';
  if (vehicleStatus === 'draft') return 'draft';
  return published ? 'published' : 'draft';
}

/** Every attached route becomes a card; detached routes take their card down. */
async function syncOffers(db, vehicleId, resolved, offers, exactVehicle) {
  const routesById = new Map((await db.prepare('SELECT * FROM transfer_routes').all()).results.map((route) => [route.id, route]));
  const existing = (await db.prepare('SELECT id, slug, route_id, sort_order FROM transfers WHERE vehicle_id = ?').bind(vehicleId).all()).results;
  const aggregates = await db.prepare('SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS rating, COUNT(*) AS count FROM transfer_vehicle_reviews WHERE vehicle_id = ? AND is_published = 1').bind(vehicleId).first();

  const keptIds = new Set();
  for (const offer of offers) {
    const route = routesById.get(offer.route_id);
    if (!route) continue;
    const card = deriveOfferCard(resolved, route, offer);
    const current = existing.find((row) => row.id === offer.id) ?? existing.find((row) => row.route_id === offer.route_id && !keptIds.has(row.id));
    const status = offerStatus(resolved.status, offer.published);
    const values = [
      status, card.name, card.category, card.description,
      resolved.card_image_url || null, resolved.hero_image_url || null, resolved.hero_image_alt,
      Math.max(0, optionalDecimal(offer.price_amount, 0)), offer.currency, card.price_suffix,
      aggregates.rating, aggregates.count,
      card.catalog_group, resolved.class_name, resolved.seats, card.duration_label, card.pickup_type,
      vehicleId, offer.route_id, exactVehicle ? 1 : 0,
    ];
    if (current) {
      keptIds.add(current.id);
      await db.prepare('UPDATE transfers SET status=?, name=?, category=?, description=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, price_amount=?, currency=?, price_suffix=?, rating=?, review_count=?, catalog_group=?, vehicle_class=?, seats=?, duration_label=?, pickup_type=?, vehicle_id=?, route_id=?, exact_vehicle=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, current.id).run();
      await replaceOfferDerivedRows(db, current.id, resolved, route);
    } else {
      const slug = await resolveUniqueSlug(db, {
        table: 'transfers',
        requested: null,
        fallback: card.slugBase,
        currentId: null,
        conflictMessage: (base) => `Адрес /transfers/${base} уже занят.`,
      });
      const sortOrder = await nextSortOrder(db, 'transfers');
      const created = await db.prepare('INSERT INTO transfers (slug, status, name, category, description, card_image_url, hero_image_url, hero_image_alt, price_amount, currency, price_suffix, rating, review_count, catalog_group, vehicle_class, seats, duration_label, pickup_type, vehicle_id, route_id, exact_vehicle, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
        slug, ...values.slice(0, 17), vehicleId, offer.route_id, exactVehicle ? 1 : 0, sortOrder
      ).run();
      keptIds.add(created.meta.last_row_id);
      await replaceOfferDerivedRows(db, created.meta.last_row_id, resolved, route);
      await seedOfferConditions(db, created.meta.last_row_id, card);
    }
  }

  const stale = existing.filter((row) => !keptIds.has(row.id));
  for (const row of stale) await db.prepare('DELETE FROM transfers WHERE id = ?').bind(row.id).run();
}

export async function saveTransfer(db, payload, currentSlug, { bucket } = {}) {
  const errors = validateVehicle(payload, { publishing: payload.status === 'published' });
  const firstError = Object.values(errors)[0];
  if (firstError) throw new Error(firstError);

  const existing = currentSlug ? await db.prepare('SELECT id FROM transfer_vehicles WHERE slug = ?').bind(currentSlug).first() : null;
  if (currentSlug && !existing) return null;
  const previousMedia = existing ? transferMediaUrls(await getAdminTransfer(db, currentSlug)) : [];

  const resolved = resolveVehicle(payload);
  let slug = await resolveUniqueSlug(db, {
    table: 'transfer_vehicles',
    requested: payload.slug,
    fallback: payload.name,
    currentId: existing?.id,
    conflictMessage: (base) => `Адрес «${base}» уже занят другой машиной. Выберите другой.`,
  });
  // `/api/admin/transfers/routes` is the routes endpoint, so no vehicle may sit there.
  if (slug === 'routes') slug = `${slug}-vehicle`;
  const sortOrder = optionalInteger(payload.sort_order, null) ?? await nextSortOrder(db, 'transfer_vehicles');

  const values = [
    slug, resolved.status, resolved.name, resolved.body_type, resolved.class_name,
    resolved.seats, resolved.large_bags, resolved.carry_on_bags, resolved.ski_capacity,
    resolved.description, resolved.card_image_url || null, resolved.hero_image_url || null, resolved.hero_image_alt,
    sortOrder,
  ];

  let vehicleId;
  if (existing) {
    await db.prepare('UPDATE transfer_vehicles SET slug=?, status=?, name=?, body_type=?, class_name=?, seats=?, large_bags=?, carry_on_bags=?, ski_capacity=?, description=?, card_image_url=?, hero_image_url=?, hero_image_alt=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(...values, existing.id).run();
    vehicleId = existing.id;
  } else {
    const created = await db.prepare('INSERT INTO transfer_vehicles (slug, status, name, body_type, class_name, seats, large_bags, carry_on_bags, ski_capacity, description, card_image_url, hero_image_url, hero_image_alt, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...values).run();
    vehicleId = created.meta.last_row_id;
  }

  await replaceVehicleRelations(db, vehicleId, resolved, payload);
  await syncOffers(db, vehicleId, resolved, normalizeOffers(payload.offers), Boolean(payload.exact_vehicle));

  const saved = await getAdminTransfer(db, slug);
  const dropped = previousMedia.filter((url) => !transferMediaUrls(saved).includes(url));
  if (dropped.length) await collectMediaGarbage(db, bucket, dropped);
  return saved;
}

export async function deleteVehicle(db, slug, { bucket } = {}) {
  const doomed = await getAdminTransfer(db, slug);
  if (!doomed) return false;
  // Offers reference the vehicle without a cascade, so cards go first.
  await db.prepare('DELETE FROM transfers WHERE vehicle_id = ?').bind(doomed.id).run();
  await db.prepare('DELETE FROM transfer_vehicles WHERE id = ?').bind(doomed.id).run();
  await collectMediaGarbage(db, bucket, transferMediaUrls(doomed));
  return true;
}

/** Re-derive the cards of one route after its info blocks changed. */
async function refreshOffersForRoute(db, routeId) {
  const route = await db.prepare('SELECT * FROM transfer_routes WHERE id = ?').bind(routeId).first();
  if (!route) return;
  const offers = (await db.prepare('SELECT t.id AS offer_id, v.slug AS vehicle_slug FROM transfers t JOIN transfer_vehicles v ON v.id = t.vehicle_id WHERE t.route_id = ?').bind(routeId).all()).results;
  for (const row of offers) {
    const vehicle = await getAdminTransfer(db, row.vehicle_slug);
    if (!vehicle) continue;
    const resolved = resolveVehicle(vehicle);
    const card = deriveOfferCard(resolved, route, {});
    await db.prepare('UPDATE transfers SET name=?, category=?, catalog_group=?, duration_label=?, pickup_type=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .bind(card.name, card.category, card.catalog_group, card.duration_label, card.pickup_type, row.offer_id).run();
    await replaceOfferDerivedRows(db, row.offer_id, resolved, route);
  }
}

/**
 * The category settings screen edits the route info blocks in bulk: rename a
 * direction, adjust its duration or road notice, add or retire a direction.
 * Every card of an affected route is re-derived so the catalog never shows a
 * stale label.
 */
export async function saveTransferRoutes(db, routes) {
  const list = Array.isArray(routes) ? routes : [];
  const errors = validateRoutes(list);
  const firstError = Object.values(errors)[0];
  if (firstError) throw new Error(firstError);

  const existing = (await db.prepare('SELECT id, slug FROM transfer_routes').all()).results;
  const keptIds = new Set();

  for (const [index, route] of list.entries()) {
    const origin = text(route.origin_name);
    const city = toSlug(route.city) || toSlug(origin.split(' ')[0]) || 'other';
    const status = route.published === false ? 'draft' : 'published';
    const sortOrder = optionalInteger(route.sort_order, null) ?? (index + 1) * 10;
    const current = existing.find((row) => row.id === optionalInteger(route.id, null));
    if (current) {
      keptIds.add(current.id);
      await db.prepare('UPDATE transfer_routes SET status=?, origin_name=?, zone_type=?, city=?, distance_km=?, duration_label=?, road_notice=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
        .bind(status, origin, text(route.zone_type) || null, city, optionalDecimal(route.distance_km, null), text(route.duration_label) || null, text(route.road_notice) || null, sortOrder, current.id).run();
      await refreshOffersForRoute(db, current.id);
    } else {
      const slug = await resolveUniqueSlug(db, {
        table: 'transfer_routes',
        requested: null,
        fallback: `${origin}-gudauri`,
        currentId: null,
        conflictMessage: (base) => `Маршрут «${base}» уже существует.`,
      });
      const created = await db.prepare('INSERT INTO transfer_routes (slug, status, origin_name, destination_name, zone_type, city, distance_km, duration_label, road_notice, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(slug, status, origin, 'Gudauri', text(route.zone_type) || null, city, optionalDecimal(route.distance_km, null), text(route.duration_label) || null, text(route.road_notice) || null, sortOrder).run();
      keptIds.add(created.meta.last_row_id);
    }
  }

  // A retired direction takes its cards down with it — the offers reference the
  // route without a cascade, so they go first.
  const stale = existing.filter((row) => !keptIds.has(row.id));
  for (const row of stale) {
    await db.prepare('DELETE FROM transfers WHERE route_id = ?').bind(row.id).run();
    await db.prepare('DELETE FROM transfer_routes WHERE id = ?').bind(row.id).run();
  }

  return listTransferRoutes(db);
}
