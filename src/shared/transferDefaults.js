/**
 * Autofill contract for the transfer CMS.
 *
 * The unit an operator edits is a vehicle: its specs, photos and included
 * services are entered once. Routes are attached with a price each, and every
 * vehicle × route pair becomes one public card. This module owns the shared
 * derivations — what an offer card is called, which subcategory it lands in —
 * so the editor preview and the API produce identical results.
 */

import { toSlug } from './slug.js';

/** Closed set the catalog can illustrate and filter on. */
export const VEHICLE_BODY_TYPES = [
  { value: 'sedan', label: 'Седан', cardWord: 'sedan' },
  { value: 'hatchback', label: 'Хэтчбек', cardWord: 'hatchback' },
  { value: 'suv', label: 'Внедорожник 4×4', cardWord: '4×4' },
  { value: 'minivan', label: 'Минивэн', cardWord: 'minivan' },
  { value: 'minibus', label: 'Микроавтобус', cardWord: 'minibus' },
];

const bodyType = (value) => VEHICLE_BODY_TYPES.find((item) => item.value === value) ?? null;

/** Values applied whenever the operator leaves a field empty. */
export const VEHICLE_DEFAULTS = {
  status: 'draft',
  seats: 4,
  currency: 'GEL',
  price_suffix: 'per vehicle',
  sort_order: 100,
};

/** Optional fields `resolveVehicle` derives when left blank. */
export const AUTOFILLED_FIELDS = ['slug', 'class_name', 'description', 'hero_image_url', 'hero_image_alt', 'large_bags', 'ski_capacity'];

export function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

const blankNumber = (value) => value === '' || value === null || value === undefined || !Number.isFinite(Number(value));
const optionalInteger = (value, fallback) => blankNumber(value) ? fallback : Math.round(Number(value));

/**
 * Fill every optional vehicle field from what the operator did provide.
 * Returns a complete record — never mutates the input.
 */
export function resolveVehicle(input = {}) {
  const name = text(input.name);
  const body = bodyType(input.body_type);
  const seats = Math.max(1, optionalInteger(input.seats, VEHICLE_DEFAULTS.seats));
  const cardImage = text(input.card_image_url);
  const cardWord = body?.cardWord ?? 'vehicle';

  return {
    slug: toSlug(input.slug) || toSlug(name),
    status: ['draft', 'published', 'archived'].includes(input.status) ? input.status : VEHICLE_DEFAULTS.status,
    name,
    body_type: body?.value ?? null,
    class_name: text(input.class_name) || 'Comfort',
    seats,
    large_bags: Math.max(0, optionalInteger(input.large_bags, seats)),
    carry_on_bags: Math.max(0, optionalInteger(input.carry_on_bags, seats)),
    ski_capacity: Math.max(0, optionalInteger(input.ski_capacity, seats)),
    description: text(input.description)
      || `${name || 'This vehicle'} — a winter-ready ${cardWord} for up to ${seats} passengers with full ski luggage.`,
    // An empty image URL is a supported state: the catalog and the object page
    // render the shared MediaPlaceholder instead of a broken <img>.
    card_image_url: cardImage,
    hero_image_url: text(input.hero_image_url) || cardImage,
    hero_image_alt: text(input.hero_image_alt) || (name ? `${name} on a mountain road` : 'Transfer vehicle'),
    vehicle_options: Array.isArray(input.vehicle_options) ? input.vehicle_options.map((item) => text(item)).filter(Boolean) : [],
    included: Array.isArray(input.included) ? input.included.map((item) => text(item)).filter(Boolean) : [],
    offers: normalizeOffers(input.offers),
    media: Array.isArray(input.media) ? input.media : [],
    reviewsList: Array.isArray(input.reviewsList) ? input.reviewsList : [],
  };
}

/** Offer rows the operator attached: route + price, one public card each. */
export function normalizeOffers(offers) {
  if (!Array.isArray(offers)) return [];
  return offers
    .map((offer) => ({
      id: optionalInteger(offer?.id, null),
      route_id: optionalInteger(offer?.route_id, null),
      price_amount: blankNumber(offer?.price_amount) ? 0 : Math.max(0, Number(offer.price_amount)),
      currency: text(offer?.currency, VEHICLE_DEFAULTS.currency).toUpperCase(),
      published: offer?.published !== false,
      slug: text(offer?.slug) || null,
    }))
    .filter((offer) => offer.route_id);
}

/** "Гудаури ↔ Тбилиси" — the label a route contributes to its cards. */
export function routeLabel(route) {
  if (!route) return 'Gudauri transfer';
  const origin = text(route.origin_name, 'Transfer point');
  const destination = text(route.destination_name, 'Gudauri');
  return `${destination} ↔ ${origin}`;
}

/** The card title every offer of this vehicle shares. */
export function offerName(vehicle) {
  const resolved = resolveVehicle(vehicle);
  return `${resolved.name || 'Vehicle'} · up to ${resolved.seats} seats`;
}

/**
 * What one attached route materialises as. Used verbatim by the editor row
 * preview and by the API when it writes the `transfers` row.
 */
export function deriveOfferCard(vehicle, route, offer = {}) {
  const resolved = resolveVehicle(vehicle);
  const label = routeLabel(route);
  return {
    name: offerName(vehicle),
    category: label,
    catalog_group: toSlug(route?.city) || (route ? toSlug(text(route.origin_name).split(' ')[0]) : 'other'),
    description: `${resolved.description} ${text(route?.duration_label) ? `Journey time ${text(route.duration_label)}.` : ''}`.trim(),
    duration_label: text(route?.duration_label) || null,
    pickup_type: text(route?.zone_type).toLowerCase().includes('airport') ? 'airport' : 'city',
    price_amount: offer.price_amount ?? 0,
    currency: text(offer.currency, VEHICLE_DEFAULTS.currency).toUpperCase(),
    price_suffix: VEHICLE_DEFAULTS.price_suffix,
    slugBase: `${toSlug(route?.city) || toSlug(text(route?.origin_name)) || 'route'}-${resolved.slug || 'vehicle'}`,
  };
}

export function listAutofilledFields(input = {}) {
  return AUTOFILLED_FIELDS.filter((field) => field === 'large_bags' || field === 'ski_capacity'
    ? blankNumber(input[field])
    : !text(input[field]));
}

export function validateVehicle(input = {}, { publishing = false } = {}) {
  const errors = {};
  if (!text(input.name)) errors.name = 'Укажите машину — например «Toyota Camry».';
  else if (!toSlug(input.slug) && !toSlug(input.name)) errors.slug = 'Из названия не получается адрес страницы — заполните поле «Адрес страницы» латиницей.';
  if (text(input.slug) && toSlug(input.slug) === 'routes') errors.slug = 'Адрес «routes» служебный — выберите другой.';
  const offers = normalizeOffers(input.offers);
  if (publishing && !offers.length) errors.offers = 'Перед публикацией добавьте хотя бы один маршрут с ценой.';
  else if (publishing && !offers.some((offer) => offer.published && offer.price_amount > 0)) errors.offers = 'Перед публикацией укажите цену больше нуля хотя бы на одном маршруте.';
  if (publishing && !bodyType(input.body_type)) errors.body_type = 'Перед публикацией выберите тип кузова — по нему работает фильтр каталога.';
  return errors;
}

/** Route info blocks edited in category settings. */
export function validateRoutes(routes = []) {
  const errors = {};
  routes.forEach((route, index) => {
    if (!text(route?.origin_name)) errors[`route-${index}`] = 'У направления должен быть пункт — например «Tbilisi Airport».';
  });
  return errors;
}
