import { CATALOG_FILTERS, matchesFilter } from '../../data/catalogFilters';
import { DESTINATIONS } from '../../data/destinations';
import { ACTIVITY_GROUP_LABELS } from '../../services/activitiesApi';

/*
 * Home hero search model.
 *
 * Every tab describes its category with up to three fields following one
 * shared grammar — WHAT → WHO/HOW → DETAIL — plus quick chips that bypass the
 * form entirely. Options reference the shared catalog filter contract so the
 * count shown on the button always equals the catalog results after hand-off.
 *
 * Field kinds:
 * - `category`   maps to the catalog category tabs (`?category=`)
 * - `refinement` maps to catalog refinements (`?filters=`), single pick
 * - `dynamic`    activity fields built from loaded items (`field:value` ids)
 */

export const HERO_SECTIONS = [
  {
    slug: 'instructors',
    icon: '/assets/navbar/icon-instructors.png',
    fields: [
      { id: 'discipline', labelKey: 'home.hero.fields.discipline', kind: 'category', options: ['ski', 'snowboard', 'both'] },
      { id: 'language', labelKey: 'catalog.groups.language', kind: 'refinement', options: ['english', 'russian', 'georgian'] },
      { id: 'who', labelKey: 'home.hero.fields.who', kind: 'refinement', options: ['kids', 'first-lessons', 'freeride', 'female'] }
    ],
    chips: [
      { id: 'kids', kind: 'refinement' },
      { id: 'first-lessons', kind: 'refinement' },
      { id: 'freeride', kind: 'refinement' },
      { id: 'female', kind: 'refinement' }
    ]
  },
  {
    slug: 'rental',
    icon: '/assets/navbar/icon-rent.png',
    fields: [
      { id: 'equipment', labelKey: 'home.hero.fields.equipment', kind: 'category', options: ['ski', 'snowboard', 'safety'] },
      { id: 'level', labelKey: 'catalog.groups.level', kind: 'refinement', options: ['all-levels', 'advanced'] },
      { id: 'audience', labelKey: 'catalog.groups.audience', kind: 'refinement', options: ['kids'] }
    ],
    chips: [
      { id: 'kids', kind: 'refinement' },
      { id: 'advanced', kind: 'refinement' },
      { id: 'safety', kind: 'category' }
    ]
  },
  {
    slug: 'transfers',
    icon: '/assets/navbar/icon-transfer.png',
    fields: [
      { id: 'route', labelKey: 'home.hero.fields.route', kind: 'category', options: ['tbilisi', 'kutaisi', 'batumi', 'kazbegi', 'vladikavkaz'] },
      { id: 'pickup', labelKey: 'catalog.groups.pickup', kind: 'refinement', options: ['airport'] },
      { id: 'group', labelKey: 'catalog.groups.group', kind: 'refinement', options: ['groups', 'four-by-four'] }
    ],
    chips: [
      { id: 'airport', kind: 'refinement' },
      { id: 'groups', kind: 'refinement' },
      { id: 'four-by-four', kind: 'refinement' }
    ]
  },
  {
    slug: 'stays',
    icon: '/assets/navbar/icon-places.png',
    fields: [
      { id: 'type', labelKey: 'home.hero.fields.type', kind: 'category', options: ['apartments', 'chalets', 'hotels'] },
      { id: 'access', labelKey: 'catalog.groups.access', kind: 'refinement', options: ['ski-in'] },
      { id: 'guests', labelKey: 'catalog.groups.guests', kind: 'refinement', options: ['family', 'two-guests'] }
    ],
    chips: [
      { id: 'ski-in', kind: 'refinement' },
      { id: 'family', kind: 'refinement' },
      { id: 'two-guests', kind: 'refinement' }
    ]
  },
  {
    slug: 'activities',
    icon: '/assets/navbar/icon-activity.png',
    fields: [
      { id: 'type', labelKey: 'home.hero.fields.type', kind: 'dynamic', field: 'catalogGroup', category: true },
      { id: 'level', labelKey: 'catalog.groups.level', kind: 'dynamic', field: 'skillLevel' },
      { id: 'duration', labelKey: 'catalog.groups.duration', kind: 'dynamic', field: 'durationGroup' }
    ],
    chips: [{ dynamicField: 'catalogGroup', limit: 4 }]
  },
  {
    slug: 'services',
    icon: '/assets/navbar/icon-services.png',
    fields: [
      { id: 'type', labelKey: 'home.hero.fields.type', kind: 'category', options: ['photo', 'care', 'hosting'] },
      { id: 'location', labelKey: 'catalog.groups.location', kind: 'refinement', options: ['at-your-stay'] },
      { id: 'audience', labelKey: 'catalog.groups.audience', kind: 'refinement', options: ['family'] }
    ],
    chips: [
      { id: 'photo', kind: 'category' },
      { id: 'care', kind: 'category' },
      { id: 'at-your-stay', kind: 'refinement' },
      { id: 'custom', kind: 'refinement' }
    ]
  },
  {
    slug: 'places',
    icon: '/assets/navbar/icon-places.png',
    fields: [
      { id: 'type', labelKey: 'home.hero.fields.type', kind: 'category', options: ['food', 'bars', 'wellness'] },
      { id: 'hours', labelKey: 'catalog.groups.hours', kind: 'refinement', options: ['late'] },
      { id: 'location', labelKey: 'catalog.groups.location', kind: 'refinement', options: ['new-gudauri'] }
    ],
    chips: [
      { id: 'food', kind: 'category' },
      { id: 'late', kind: 'refinement' },
      { id: 'new-gudauri', kind: 'refinement' },
      { id: 'bookable', kind: 'refinement' }
    ]
  }
];

export function getStaticSectionItems(slug) {
  return DESTINATIONS[slug]?.items ?? [];
}

function refinementDefinition(slug, id) {
  const [, group, slugs] = CATALOG_FILTERS[slug]?.refinements.find(([refId]) => refId === id) ?? [];
  return { id, group, slugs };
}

/* Resolves a hero option into the same filter object the catalog matches with. */
export function toFilter(slug, field, optionId) {
  if (!optionId) return null;
  if (field.kind === 'dynamic') {
    return { id: `${field.field}:${optionId}`, field: field.field, value: optionId };
  }
  if (field.kind === 'category') return { id: optionId, slugs: CATALOG_FILTERS[slug]?.categories.find(([catId]) => catId === optionId)?.[1] };
  return refinementDefinition(slug, optionId);
}

export function countMatches(slug, items, filters) {
  const applied = filters.filter(Boolean);
  return items.filter((item) => applied.every((filter) => matchesFilter(slug, filter, item))).length;
}

export function dynamicOptions(items, field) {
  return [...new Set(items.map((item) => item[field]).filter(Boolean))];
}

export function dynamicOptionLabel(field, value) {
  if (field === 'catalogGroup') return ACTIVITY_GROUP_LABELS[value] || value;
  return value;
}

/* Builds the catalog URL for the current selection or a quick chip. */
export function buildCatalogUrl(slug, selection) {
  const params = new URLSearchParams();
  const filters = [];
  for (const [field, optionId] of selection) {
    if (!optionId) continue;
    if (field.kind === 'category' || (field.kind === 'dynamic' && field.category)) {
      params.set('category', field.kind === 'dynamic' ? `${field.field}:${optionId}` : optionId);
    } else if (field.kind === 'dynamic') {
      filters.push(`${field.field}:${optionId}`);
    } else {
      filters.push(optionId);
    }
  }
  if (filters.length) params.set('filters', filters.join(','));
  const query = params.toString();
  return `/${slug}${query ? `?${query}` : ''}`;
}
