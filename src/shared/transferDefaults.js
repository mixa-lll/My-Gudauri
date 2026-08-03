/**
 * Autofill contract for the transfer CMS.
 *
 * Same shape and function names as instructorDefaults and activityDefaults, so
 * the editor, the API and the tests treat every collection the same way.
 */

import { toSlug } from './slug.js';

/** Values applied whenever the operator leaves a field empty. */
export const TRANSFER_DEFAULTS = {
  status: 'draft',
  category: 'Gudauri transfer',
  currency: 'GEL',
  price_suffix: 'per vehicle',
  price_amount: 0,
  rating: 0,
  review_count: 0,
  catalog_group: 'other',
  sort_order: 100,
};

/** Optional fields `resolveTransfer` derives when left blank. */
export const AUTOFILLED_FIELDS = ['slug', 'category', 'description', 'hero_image_alt', 'hero_image_url', 'price_suffix', 'catalog_group'];

export function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

/**
 * Fill every optional transfer field from what the operator did provide.
 * Returns a complete record — never mutates the input.
 */
export function resolveTransfer(input = {}) {
  const name = text(input.name);
  const cardImage = text(input.card_image_url);
  const city = text(input.catalog_group);
  // Every route runs Gudauri ↔ somewhere, so the city alone produces a label.
  const route = text(input.category) || (city ? `Gudauri ↔ ${city.charAt(0).toUpperCase()}${city.slice(1)}` : TRANSFER_DEFAULTS.category);

  return {
    slug: toSlug(input.slug) || toSlug(name),
    status: ['draft', 'published', 'archived'].includes(input.status) ? input.status : TRANSFER_DEFAULTS.status,
    name,
    category: route,
    description: text(input.description) || `${route}. A full description is coming soon.`,
    // An empty image URL is a supported state: the catalog and the object page
    // render the shared MediaPlaceholder instead of a broken <img>.
    card_image_url: cardImage,
    hero_image_url: text(input.hero_image_url) || cardImage,
    hero_image_alt: text(input.hero_image_alt) || route,
    currency: text(input.currency, TRANSFER_DEFAULTS.currency).toUpperCase(),
    price_suffix: text(input.price_suffix, TRANSFER_DEFAULTS.price_suffix),
    catalog_group: toSlug(input.catalog_group) || TRANSFER_DEFAULTS.catalog_group,
    vehicle_class: text(input.vehicle_class) || null,
    duration_label: text(input.duration_label) || null,
    pickup_type: text(input.pickup_type) || null,
    tags: Array.isArray(input.tags) ? input.tags.map((item) => text(item)).filter(Boolean) : [],
    facts: Array.isArray(input.facts) ? input.facts : [],
    included: Array.isArray(input.included) ? input.included.map((item) => text(item)).filter(Boolean) : [],
    media: Array.isArray(input.media) ? input.media : [],
    reviewsList: Array.isArray(input.reviewsList) ? input.reviewsList : [],
  };
}

export function listAutofilledFields(input = {}) {
  return AUTOFILLED_FIELDS.filter((field) => !text(input[field]));
}

export function validateTransfer(input = {}, { publishing = false } = {}) {
  const errors = {};
  if (!text(input.name)) errors.name = 'Укажите название — например «Седан · до 3 мест».';
  else if (!toSlug(input.slug) && !toSlug(input.name)) errors.slug = 'Из названия не получается адрес страницы — заполните поле «Адрес страницы» латиницей.';
  if (publishing && !(Number(input.price_amount) > 0)) errors.price_amount = 'Перед публикацией укажите цену больше нуля.';
  if (publishing && !text(input.catalog_group)) errors.catalog_group = 'Перед публикацией выберите город — по нему маршрут попадает в панель направлений.';
  return errors;
}
