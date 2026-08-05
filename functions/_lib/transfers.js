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
  const vehicle = row.entity_vehicle_id ? {
    id: row.entity_vehicle_id,
    slug: row.vehicle_slug,
    name: row.vehicle_name,
    make: row.vehicle_make,
    model: row.vehicle_model,
    className: row.vehicle_class_name,
    bodyType: row.vehicle_body_type,
    seats: row.vehicle_seats,
    luggage: { large: row.vehicle_large_bags, carryOn: row.vehicle_carry_on_bags },
    skiCapacity: row.vehicle_ski_capacity,
  } : null;
  const routeEntity = row.entity_route_id ? {
    id: row.entity_route_id,
    slug: row.route_slug,
    origin: row.route_origin,
    destination: row.route_destination,
    zoneType: row.route_zone_type,
    distanceKm: row.route_distance_km,
    duration: row.route_duration_label,
    mapEmbedUrl: row.route_map_embed_url,
    mapUrl: row.route_map_url,
    geometry: parseJson(row.route_geometry_json),
    roadNotice: row.route_road_notice,
    bidirectional: Boolean(row.route_bidirectional),
    // Where the driver meets the guest is a property of the request, not a
    // separate offer — one route carries every pickup it supports.
    pickupPoints: parseJson(row.pickup_points_json).map((point) => ({
      ...point,
      requiresFlight: Boolean(point.requiresFlight),
      requiresAddress: Boolean(point.requiresAddress),
      isDefault: Boolean(point.isDefault),
    })),
  } : null;
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
    vehicleClass: vehicle?.className || row.vehicle_class,
    bodyType: vehicle?.bodyType ?? null,
    seats: vehicle?.seats || row.seats,
    duration: routeEntity?.duration || row.duration_label,
    pickupType: row.pickup_type,
    vehicle,
    routeEntity,
    offer: {
      id: row.id,
      slug: row.slug,
      vehicleId: vehicle?.id ?? null,
      routeId: routeEntity?.id ?? null,
      exactVehicle: Boolean(row.exact_vehicle),
      priceAmount: row.price_amount,
      currency: row.currency,
      priceSuffix: row.price_suffix,
    },
  };
}

const SUMMARY_SELECT = `
  SELECT t.*,
    v.id AS entity_vehicle_id, v.slug AS vehicle_slug, v.name AS vehicle_name,
    v.make AS vehicle_make, v.model AS vehicle_model, v.class_name AS vehicle_class_name,
    v.body_type AS vehicle_body_type,
    v.seats AS vehicle_seats, v.large_bags AS vehicle_large_bags,
    v.carry_on_bags AS vehicle_carry_on_bags, v.ski_capacity AS vehicle_ski_capacity,
    r.id AS entity_route_id, r.slug AS route_slug, r.origin_name AS route_origin,
    r.destination_name AS route_destination, r.zone_type AS route_zone_type,
    r.distance_km AS route_distance_km, r.duration_label AS route_duration_label,
    r.map_embed_url AS route_map_embed_url, r.map_url AS route_map_url,
    r.route_geometry_json AS route_geometry_json,
    r.road_notice AS route_road_notice, r.is_bidirectional AS route_bidirectional,
    COALESCE((
      SELECT json_group_array(item.label) FROM (
        SELECT label FROM transfer_tags WHERE transfer_id = t.id ORDER BY sort_order, id
      ) item
    ), '[]') AS tags_json,
    COALESCE((
      SELECT json_group_array(json_object(
        'id', item.id, 'kind', item.kind, 'label', item.label, 'hint', item.hint,
        'requiresFlight', item.requires_flight, 'requiresAddress', item.requires_address,
        'isDefault', item.is_default
      )) FROM (
        SELECT * FROM transfer_pickup_points WHERE route_id = t.route_id ORDER BY sort_order, id
      ) item
    ), '[]') AS pickup_points_json
  FROM transfers t
  LEFT JOIN transfer_vehicles v ON v.id = t.vehicle_id
  LEFT JOIN transfer_routes r ON r.id = t.route_id
`;

export async function listTransfers(db) {
  const result = await db.prepare(`${SUMMARY_SELECT} WHERE t.status = 'published' ORDER BY t.sort_order, t.name`).all();
  return result.results.map(mapSummary);
}

export async function getTransfer(db, slug) {
  const row = await db.prepare(`${SUMMARY_SELECT} WHERE t.status = 'published' AND t.slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return null;

  const [facts, included, legacyMedia, legacyReviews, vehicleOptions, vehicleMedia, vehicleReviews, conditions, extras] = await db.batch([
    db.prepare('SELECT label, value FROM transfer_facts WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT label FROM transfer_included WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT media_type, url, thumbnail_url, alt, is_featured FROM transfer_media WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT author_name, context_label, rating, review_date, body, avatar_url FROM transfer_reviews WHERE transfer_id = ? AND is_published = 1 ORDER BY sort_order, id').bind(row.id),
    db.prepare('SELECT label FROM transfer_vehicle_options WHERE vehicle_id = ? ORDER BY sort_order, id').bind(row.entity_vehicle_id),
    db.prepare('SELECT media_type, url, thumbnail_url, alt, is_featured FROM transfer_vehicle_media WHERE vehicle_id = ? ORDER BY sort_order, id').bind(row.entity_vehicle_id),
    db.prepare(`SELECT vr.author_name, vr.rating, vr.review_date, vr.body, vr.avatar_url,
      CASE WHEN rr.id IS NULL THEN NULL ELSE rr.origin_name || ' → ' || rr.destination_name END AS route_context
      FROM transfer_vehicle_reviews vr
      LEFT JOIN transfer_routes rr ON rr.id = vr.route_id
      WHERE vr.vehicle_id = ? AND vr.is_published = 1 ORDER BY vr.sort_order, vr.id`).bind(row.entity_vehicle_id),
    db.prepare('SELECT id, label, value, description FROM transfer_offer_conditions WHERE transfer_id = ? ORDER BY sort_order, id').bind(row.id),
    db.prepare("SELECT slug, label, description, price_amount, currency, price_unit, max_quantity FROM transfer_extras WHERE status = 'published' ORDER BY sort_order, id")
  ]);

  const mediaRows = vehicleMedia.results.length ? vehicleMedia.results : legacyMedia.results;
  const reviewRows = vehicleReviews.results.length ? vehicleReviews.results : legacyReviews.results;
  const summary = mapSummary(row);

  return {
    ...summary,
    heroImage: row.hero_image_url || row.card_image_url || null,
    heroImageAlt: row.hero_image_alt || row.category,
    // The catalog renders facts as [label, value] pairs.
    facts: facts.results.map((item) => [item.label, item.value]),
    included: included.results.map((item) => item.label),
    media: mediaRows.map((item) => ({
      type: item.media_type,
      src: item.url,
      thumbnail: item.thumbnail_url || item.url,
      alt: item.alt,
      featured: Boolean(item.is_featured)
    })),
    reviewsList: reviewRows.map((item) => ({
      author: item.author_name,
      context: item.route_context || item.context_label,
      rating: item.rating,
      date: item.review_date,
      body: item.body,
      avatar: item.avatar_url
    })),
    vehicle: summary.vehicle ? {
      ...summary.vehicle,
      isExact: summary.offer.exactVehicle,
      options: vehicleOptions.results.map((item) => item.label),
      media: mediaRows.map((item) => ({
        type: item.media_type,
        src: item.url,
        thumbnail: item.thumbnail_url || item.url,
        alt: item.alt,
        featured: Boolean(item.is_featured),
      })),
    } : null,
    conditions: conditions.results,
    // Add-ons offered with the ride. Free today, but priced in the schema so a
    // paid extra is a CMS row rather than a migration.
    extras: extras.results.map((item) => ({
      slug: item.slug,
      label: item.label,
      description: item.description,
      priceAmount: item.price_amount,
      currency: item.currency,
      priceUnit: item.price_unit,
      maxQuantity: item.max_quantity,
    })),
  };
}
