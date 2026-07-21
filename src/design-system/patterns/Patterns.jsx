import './Patterns.scss';

export function CatalogDiscovery({ categoryTabs, filterToolbar, resultCount, listingGrid, pagination }) {
  return <section className="ds-pattern ds-pattern--catalog-discovery" aria-label="Catalog discovery">{categoryTabs}{filterToolbar}{resultCount}{listingGrid}{pagination}</section>;
}

export function SearchAndFiltering({ search, filters, activeFilters, resultCount, results }) {
  return <section className="ds-pattern ds-pattern--search-filtering" aria-label="Search and filtering">{search}<div className="ds-pattern__filter-row">{filters}{activeFilters}</div>{resultCount}{results}</section>;
}

export function BookingFlow({ progress, step, summary, actions, status }) {
  return <section className="ds-pattern ds-pattern--booking" aria-label="Booking flow">{progress}<div className="ds-pattern__booking-layout"><div>{step}{actions}</div><aside>{summary}{status}</aside></div></section>;
}

export function SearchFlow({ searchHero, suggestions, results, feedback }) {
  return <section className="ds-pattern ds-pattern--search-flow" aria-label="Search flow">{searchHero}{suggestions}{feedback}{results}</section>;
}

export function EmptyAndErrorResults({ state = 'ready', ready, loading, empty, error }) {
  const allowed = { ready, loading, empty, error };
  if (!(state in allowed)) throw new Error(`EmptyAndErrorResults: unsupported state “${state}”.`);
  return <section className="ds-pattern" aria-live="polite">{allowed[state]}</section>;
}

export function EditorialReading({ header, media, tableOfContents, body, sources, related }) {
  return <section className="ds-pattern ds-pattern--editorial-reading" aria-label="Editorial reading">{header}{media}<div className="ds-pattern__reading-layout">{tableOfContents}<div>{body}{sources}</div></div>{related}</section>;
}

export const PATTERN_CONTRACTS = {
  catalogDiscovery: { task: 'Browse a category, refine it, understand result volume and move through result pages.', sequence: ['CategoryTabs', 'FilterToolbar', 'ResultCount', 'ListingGrid', 'EmptyState|Pagination'], states: ['loading', 'empty', 'error', 'ready'], interaction: 'Category changes reset pagination; filters update result count; focus remains on the initiating control.', mobile: 'Tabs scroll or wrap, filters move into a dialog, cards form one column.', accessibility: 'Filter labels, result aria-live, keyboard-operable tabs and pagination.', variations: ['instant filters', 'apply filters'] },
  searchAndFiltering: { task: 'Search by intent and progressively narrow results.', sequence: ['Search', 'FilterControls', 'ActiveFilters', 'ResultCount', 'Results'], states: ['idle', 'loading', 'empty', 'error', 'ready'], interaction: 'Submit preserves query; removing a chip updates results and URL state.', mobile: 'Search remains visible; filter dialog announces active count.', accessibility: 'Search landmark, labelled controls, focus restoration after dialog close.', variations: ['inline', 'dialog filters'] },
  bookingFlow: { task: 'Complete a multi-step booking with a persistent, reviewable summary.', sequence: ['Progress', 'CurrentStep', 'Summary', 'Actions', 'Status'], states: ['editing', 'validating', 'submitting', 'error', 'success'], interaction: 'Validation blocks forward movement and sends focus to the first error.', mobile: 'Summary becomes a disclosure; primary action stays reachable.', accessibility: 'Ordered step labels, error summary links, status announcements.', variations: ['request', 'instant booking'] },
  searchFlow: { task: 'Move from a broad query to a useful destination.', sequence: ['SearchHero', 'Suggestions', 'Feedback', 'Results'], states: ['idle', 'loading', 'empty', 'error', 'ready'], interaction: 'Suggestions populate the same query model as typed search.', mobile: 'Single input/action stack and compact suggestions.', accessibility: 'Search landmark, meaningful status announcements, no focus theft.', variations: ['global', 'catalog'] },
  emptyAndErrorResults: { task: 'Recover from a result set that cannot currently be shown.', sequence: ['StateMessage', 'RecoveryAction', 'Optional alternatives'], states: ['loading', 'empty', 'error', 'ready'], interaction: 'Retry preserves the current query and filters.', mobile: 'Actions become full width.', accessibility: 'Errors use alert; loading and empty states use status.', variations: ['compact', 'page'] },
  editorialReading: { task: 'Read, navigate and continue from a long-form article.', sequence: ['ArticleHeader', 'ArticleMedia', 'TableOfContents', 'ArticleBody', 'Sources', 'RelatedArticles'], states: ['loading', 'error', 'ready'], interaction: 'TOC anchors use stable heading IDs and visible focus.', mobile: 'TOC becomes inline; text measure and heading hierarchy remain stable.', accessibility: 'Sequential headings, descriptive media, labelled external links.', variations: ['guide', 'news', 'story'] }
};
