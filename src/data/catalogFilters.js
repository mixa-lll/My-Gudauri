/*
 * Shared catalog filter contract.
 *
 * The catalog page and the home hero search both need the same category and
 * refinement definitions with the same matching semantics, so the counts a
 * user sees on the home page always equal the results the catalog shows after
 * the hand-off. Keep every matcher here — never fork this logic per page.
 */

export const CATALOG_FILTERS = {
  instructors: {
    categories: [['all'], ['ski'], ['snowboard'], ['both']],
    refinements: [
      ['russian', 'language'],
      ['english', 'language'],
      ['georgian', 'language'],
      ['male', 'gender'],
      ['female', 'gender'],
      ['kids', 'specialty'],
      ['first-lessons', 'specialty'],
      ['technique', 'specialty'],
      ['carving', 'specialty'],
      ['freeride', 'specialty'],
      ['freestyle', 'specialty']
    ]
  },
  rental: {
    categories: [
      ['all'],
      ['ski', ['performance-ski-set', 'freeride-ski-set', 'kids-ski-set']],
      ['snowboard', ['snowboard-set']],
      ['safety', ['avalanche-set', 'premium-helmet-goggles']]
    ],
    refinements: [
      ['all-levels', 'level', ['snowboard-set', 'kids-ski-set', 'premium-helmet-goggles']],
      ['advanced', 'level', ['performance-ski-set', 'freeride-ski-set', 'avalanche-set']],
      ['kids', 'audience', ['kids-ski-set']]
    ]
  },
  transfers: {
    // Transfer categories are cities: every route is Gudauri ↔ city, so the
    // route panel (and the home hero) picks a city and the direction never
    // changes the price or the result set.
    categories: [
      ['all'],
      ['tbilisi', ['tbilisi-airport-gudauri', 'tbilisi-minivan-gudauri']],
      ['kutaisi', ['kutaisi-gudauri']],
      ['batumi', ['batumi-gudauri']],
      ['kazbegi', ['kazbegi-gudauri']],
      ['vladikavkaz', ['vladikavkaz-gudauri']]
    ],
    refinements: [
      ['airport', 'pickup', ['tbilisi-airport-gudauri', 'kutaisi-gudauri', 'vladikavkaz-gudauri']],
      ['groups', 'group', ['tbilisi-minivan-gudauri', 'vladikavkaz-gudauri']],
      ['four-by-four', 'vehicle', ['kazbegi-gudauri']]
    ]
  },
  services: {
    categories: [
      ['all'],
      ['photo', ['mountain-photo-session', 'ski-video-reel']],
      ['care', ['evening-nanny', 'sports-massage']],
      ['hosting', ['private-chef', 'event-decor']]
    ],
    refinements: [
      ['at-your-stay', 'location', ['evening-nanny', 'sports-massage', 'private-chef']],
      ['family', 'audience', ['mountain-photo-session', 'evening-nanny', 'private-chef']],
      ['custom', 'format', ['private-chef', 'event-decor']]
    ]
  },
  stays: {
    categories: [
      ['all'],
      ['apartments', ['four-seasons-loft', 'neo-family-apartment', 'atrium-ski-in', 'loft-long-stay']],
      ['chalets', ['panorama-chalet']],
      ['hotels', ['twins-view-room']]
    ],
    refinements: [
      ['ski-in', 'access', ['four-seasons-loft', 'atrium-ski-in']],
      ['family', 'guests', ['neo-family-apartment', 'panorama-chalet']],
      ['two-guests', 'guests', ['twins-view-room', 'loft-long-stay']]
    ]
  },
  places: {
    categories: [
      ['all'],
      ['food', ['drunk-cherry', 'platforma-cafe']],
      ['bars', ['black-dog-bar']],
      ['wellness', ['gudauri-lodge-spa', 'smart-market', 'friendship-monument']]
    ],
    refinements: [
      ['late', 'hours', ['drunk-cherry', 'black-dog-bar']],
      ['new-gudauri', 'location', ['drunk-cherry', 'black-dog-bar', 'platforma-cafe']],
      ['bookable', 'booking', ['drunk-cherry', 'gudauri-lodge-spa']]
    ]
  }
};

export const INSTRUCTOR_FILTER_MATCHERS = {
  russian: (item) => item.languages?.some((language) => language.code === 'Ru'),
  english: (item) => item.languages?.some((language) => language.code === 'En'),
  georgian: (item) => item.languages?.some((language) => language.code === 'Ge'),
  male: (item) => item.gender === 'male',
  female: (item) => item.gender === 'female',
  kids: (item) => item.tags?.some((tag) => /kids|children|family/i.test(tag)),
  'first-lessons': (item) => item.tags?.some((tag) => /first lesson/i.test(tag)),
  technique: (item) => item.tags?.some((tag) => /technique/i.test(tag)),
  carving: (item) => item.tags?.some((tag) => /carving/i.test(tag)),
  freeride: (item) => item.tags?.some((tag) => /freeride|off-piste/i.test(tag)),
  freestyle: (item) => item.tags?.some((tag) => /freestyle/i.test(tag))
};

export function matchesFilter(section, filter, item) {
  if (!filter || filter.id === 'all') return true;
  if (filter.field) return item[filter.field] === filter.value;
  if (section !== 'instructors') return !filter.slugs || filter.slugs.includes(item.slug);

  if (filter.id === 'ski' || filter.id === 'snowboard') {
    return item.sports?.some((sport) => sport.slug === filter.id);
  }
  if (filter.id === 'both') {
    return ['ski', 'snowboard'].every((slug) => item.sports?.some((sport) => sport.slug === slug));
  }
  if (INSTRUCTOR_FILTER_MATCHERS[filter.id]) return INSTRUCTOR_FILTER_MATCHERS[filter.id](item);
  return true;
}

export function matchesActiveRefinements(section, refinements, activeFilters, item) {
  const selected = refinements.filter((filter) => activeFilters.includes(filter.id));
  if (section !== 'instructors' && section !== 'activities') return selected.every((filter) => matchesFilter(section, filter, item));

  const grouped = selected.reduce((groups, filter) => {
    const group = filter.group || filter.id;
    groups[group] = [...(groups[group] || []), filter];
    return groups;
  }, {});

  return Object.values(grouped).every((filters) => filters.some((filter) => matchesFilter(section, filter, item)));
}
