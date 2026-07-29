/**
 * Autofill contract for the activity CMS.
 *
 * Mirrors src/shared/instructorDefaults.js on purpose: same shape, same
 * function names, same rules. A new collection copies this file, swaps the
 * field list, and the editor and API pick it up without further changes.
 */

import { toSlug } from './slug.js';

/** Values applied whenever the operator leaves a field empty. */
export const ACTIVITY_DEFAULTS = {
  status: 'draft',
  category: 'Mountain activity',
  currency: 'GEL',
  price_suffix: 'per guest',
  price_amount: 0,
  rating: 0,
  review_count: 0,
  catalog_group: 'other',
  sort_order: 100,
};

/** Optional fields `resolveActivity` derives when left blank. */
export const AUTOFILLED_FIELDS = ['slug', 'category', 'description', 'hero_image_alt', 'hero_image_url', 'price_suffix', 'catalog_group'];

export function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

/**
 * Fill every optional activity field from what the operator did provide.
 * Returns a complete record — never mutates the input.
 */
export function resolveActivity(input = {}) {
  const name = text(input.name);
  const cardImage = text(input.card_image_url);

  return {
    slug: toSlug(input.slug) || toSlug(name),
    status: ['draft', 'published', 'archived'].includes(input.status) ? input.status : ACTIVITY_DEFAULTS.status,
    name,
    category: text(input.category, ACTIVITY_DEFAULTS.category),
    description: text(input.description) || `${name || 'This activity'} in Gudauri. A full description is coming soon.`,
    // An empty image URL is a supported state: the catalog and the object page
    // render the shared MediaPlaceholder instead of a broken <img>.
    card_image_url: cardImage,
    hero_image_url: text(input.hero_image_url) || cardImage,
    hero_image_alt: text(input.hero_image_alt) || (name ? `${name} in Gudauri` : 'Activity in Gudauri'),
    currency: text(input.currency, ACTIVITY_DEFAULTS.currency).toUpperCase(),
    price_suffix: text(input.price_suffix, ACTIVITY_DEFAULTS.price_suffix),
    catalog_group: toSlug(input.catalog_group) || ACTIVITY_DEFAULTS.catalog_group,
    skill_level: text(input.skill_level) || null,
    duration_group: text(input.duration_group) || null,
    format: text(input.format) || null,
    tags: Array.isArray(input.tags) ? input.tags.map((item) => text(item)).filter(Boolean) : [],
    facts: Array.isArray(input.facts) ? input.facts : [],
    included: Array.isArray(input.included) ? input.included.map((item) => text(item)).filter(Boolean) : [],
    excluded: Array.isArray(input.excluded) ? input.excluded.map((item) => text(item)).filter(Boolean) : [],
    equipment: Array.isArray(input.equipment) ? input.equipment.map((item) => text(item)).filter(Boolean) : [],
    schedule: Array.isArray(input.schedule) ? input.schedule : [],
    media: Array.isArray(input.media) ? input.media : [],
    reviewsList: Array.isArray(input.reviewsList) ? input.reviewsList : [],
  };
}

export function listAutofilledFields(input = {}) {
  return AUTOFILLED_FIELDS.filter((field) => !text(input[field]));
}

export function validateActivity(input = {}, { publishing = false } = {}) {
  const errors = {};
  if (!text(input.name)) errors.name = 'Укажите название активности.';
  else if (!toSlug(input.slug) && !toSlug(input.name)) errors.slug = 'Из названия не получается адрес страницы — заполните поле «Адрес страницы» латиницей.';
  if (publishing && !(Number(input.price_amount) > 0)) errors.price_amount = 'Перед публикацией укажите цену больше нуля.';
  return errors;
}
