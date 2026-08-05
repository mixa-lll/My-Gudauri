/**
 * Single source of truth for instructor autofill.
 *
 * The CMS editor calls `resolveInstructor` to show operators exactly what will
 * be stored when a field is left blank, and the API calls the same function
 * before writing to D1. Keeping one implementation is what makes the editor
 * placeholders honest: what the operator previews is what the site renders.
 */

import { COLLECTION_PRICING_POLICIES, resolvePricingRules, validatePricingRules } from './pricing.js';
import { toSlug } from './slug.js';

const DISCIPLINE_LABELS = { ski: 'Ski', snowboard: 'Snowboard' };

/** Which pricing ladders an instructor card configures. */
export const INSTRUCTOR_PRICING_POLICY = COLLECTION_PRICING_POLICIES.instructors;

/** Numeric and enum defaults applied whenever the operator leaves a field empty. */
export const INSTRUCTOR_DEFAULTS = {
  status: 'draft',
  role: 'Instructor',
  experience_years: 0,
  rating: 0,
  review_count: 0,
  hourly_rate_gel: 345,
  min_hours: 2,
  max_hours: 12,
  hours_step: 2,
  min_people: 1,
  max_people: 10,
  default_hours: 2,
  default_people: 1,
  price_round_to: 5,
  sort_order: 100,
};

/** Optional fields `resolveInstructor` derives when the operator leaves them blank. */
export const AUTOFILLED_FIELDS = ['slug', 'card_description', 'tagline', 'intro', 'hero_image_alt', 'hero_image_url', 'booking_avatar_url', 'availability_label', 'about'];

export function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

export function describeDisciplines(disciplines = []) {
  const labels = (Array.isArray(disciplines) ? disciplines : [])
    .map((item) => DISCIPLINE_LABELS[item] ?? (text(item) && `${item.charAt(0).toUpperCase()}${item.slice(1)}`))
    .filter(Boolean);
  if (!labels.length) return '';
  if (labels.length === 1) return labels[0];
  // Matches the existing catalog copy: “Ski & snowboard”, not “Ski & Snowboard”.
  const tail = labels.slice(1).map((label) => label.toLowerCase());
  return `${labels[0]} & ${tail.join(' & ')}`;
}

/**
 * The ladders this instructor prices on, with the platform defaults filled in
 * for every dimension the operator has not configured. The editor renders the
 * result as the editable value, so what an operator sees is what is charged.
 */
export function resolveInstructorPricing(input = {}) {
  return resolvePricingRules(INSTRUCTOR_PRICING_POLICY, {
    roundTo: input.price_round_to,
    tiers: input.price_tiers ?? {},
  });
}

export function describeExperience(years) {
  const value = Math.round(Number(years));
  if (!Number.isFinite(value) || value <= 0) return '';
  return `${value} ${value === 1 ? 'year' : 'years'} experience`;
}

/**
 * Fill every optional instructor field from what the operator did provide.
 * Returns a complete record — never mutates the input.
 */
export function resolveInstructor(input = {}) {
  const displayName = text(input.display_name);
  const disciplineLabel = describeDisciplines(input.disciplines);
  const experienceLabel = describeExperience(input.experience_years);
  const cardImage = text(input.card_image_url);

  const cardDescription = text(input.card_description)
    || [disciplineLabel, experienceLabel].filter(Boolean).join(' · ')
    || 'Private lessons in Gudauri';
  const tagline = text(input.tagline)
    || (disciplineLabel ? `${disciplineLabel} lessons in Gudauri` : 'Private lessons in Gudauri');
  const intro = text(input.intro)
    || `${displayName || 'This instructor'} teaches private lessons in Gudauri. A full introduction is coming soon.`;
  const about = (Array.isArray(input.about) ? input.about : []).map((item) => text(item)).filter(Boolean);

  return {
    slug: toSlug(input.slug) || toSlug(displayName),
    status: ['draft', 'published', 'archived'].includes(input.status) ? input.status : INSTRUCTOR_DEFAULTS.status,
    display_name: displayName,
    role: text(input.role, INSTRUCTOR_DEFAULTS.role),
    gender: ['male', 'female'].includes(input.gender) ? input.gender : null,
    card_description: cardDescription,
    tagline,
    intro,
    // An empty image URL is a supported state: the site renders the shared
    // MediaPlaceholder instead of a broken <img>.
    card_image_url: cardImage,
    hero_image_url: text(input.hero_image_url) || cardImage,
    hero_image_alt: text(input.hero_image_alt) || (displayName ? `${displayName} in Gudauri` : 'Instructor in Gudauri'),
    booking_avatar_url: text(input.booking_avatar_url) || cardImage,
    availability_label: text(input.availability_label) || 'Schedule on request',
    certificate_label: text(input.certificate_label) || null,
    about: about.length ? about : [intro],
    disciplines: Array.isArray(input.disciplines) ? input.disciplines.filter(Boolean) : [],
    languages: Array.isArray(input.languages) ? input.languages.filter(Boolean) : [],
    tags: Array.isArray(input.tags) ? input.tags.map((item) => text(item)).filter(Boolean) : [],
    // Normalized here rather than at the database boundary so the editor
    // preview, the saved rows and the quoted price cannot drift apart.
    price_tiers: Object.fromEntries(resolveInstructorPricing(input).dimensions.map((item) => [item.field, item.tiers])),
    certifications: Array.isArray(input.certifications) ? input.certifications : [],
    media: Array.isArray(input.media) ? input.media : [],
    reviewsList: Array.isArray(input.reviewsList) ? input.reviewsList : [],
  };
}

/**
 * Fields the operator left blank, so the editor can label them as autofilled
 * and the list can show how complete an object is.
 */
export function listAutofilledFields(input = {}) {
  return AUTOFILLED_FIELDS.filter((field) => field === 'about'
    ? !(Array.isArray(input.about) ? input.about : []).filter((item) => text(item)).length
    : !text(input[field]));
}

export function validateInstructor(input = {}, { publishing = false } = {}) {
  const errors = {};
  if (!text(input.display_name)) errors.display_name = 'Укажите имя инструктора.';
  else if (!toSlug(input.slug) && !toSlug(input.display_name)) errors.slug = 'Из имени не получается адрес страницы — заполните поле «Адрес страницы» латиницей.';
  if (publishing && !(Array.isArray(input.disciplines) ? input.disciplines : []).length) errors.disciplines = 'Перед публикацией выберите хотя бы одну дисциплину.';
  const pricing = validatePricingRules(INSTRUCTOR_PRICING_POLICY, { tiers: input.price_tiers ?? {} });
  for (const [field, message] of Object.entries(pricing)) errors[`price_tiers.${field}`] = message;
  return errors;
}
