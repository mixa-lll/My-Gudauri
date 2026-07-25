import { cloneElement, isValidElement, useCallback, useMemo, useState } from 'react';
import { ObjectStickyNav, RegisteredAdditionalSections } from '../blocks/detail/DetailBlocks';
import { InstructorBookingSteps } from '../blocks/detail/instructor/InstructorDetailBlocks';
import './Patterns.scss';

export function CatalogDiscovery({ categoryTabs, filterToolbar, listingGrid, pagination }) {
  return <section className="ds-pattern ds-pattern--catalog-discovery" aria-label="Catalog discovery">{categoryTabs}{filterToolbar}{listingGrid}{pagination}</section>;
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

const SECTION_NAV_LABELS = { routeProgram: 'Program', activitySchedule: 'Schedule', routeMap: 'Route', includedServices: 'Included', equipmentList: 'Equipment', safetyRequirements: 'Safety' };
const SECTION_ANCHORS = { routeProgram: 'route', activitySchedule: 'schedule', routeMap: 'route-map', includedServices: 'included', equipmentList: 'equipment', safetyRequirements: 'safety' };

function ObjectPatternFrame({ category, mainTags, objectDescription, categorySection, additionalSections = [], reviews, bookingSteps, relatedListings, faqSection, bookingWidget, navigationItems }) {
  const [bookingSummary, setBookingSummary] = useState(null);
  const externalSummaryChange = isValidElement(bookingWidget) ? bookingWidget.props.onSummaryChange : undefined;
  const handleSummaryChange = useCallback((summary) => {
    setBookingSummary((current) => current?.actionLabel === summary.actionLabel && current?.ready === summary.ready && current?.totalLabel === summary.totalLabel ? current : summary);
    externalSummaryChange?.(summary);
  }, [externalSummaryChange]);
  const bookingSlot = useMemo(() => isValidElement(bookingWidget)
    ? cloneElement(bookingWidget, { id: bookingWidget.props.id ?? 'booking-request', onSummaryChange: handleSummaryChange })
    : bookingWidget, [bookingWidget, handleSummaryChange]);
  const sectionNavigationItems = additionalSections.map((section) => ({
    href: `#${section.id ?? SECTION_ANCHORS[section.type] ?? section.type}`,
    label: section.navigationLabel ?? SECTION_NAV_LABELS[section.type]
  })).filter((item) => item.label);
  const defaultNavigationItems = [
    objectDescription ? { href: '#about', label: 'About' } : null,
    category === 'instructor' && categorySection ? { href: '#certifications', label: 'Certifications' } : null,
    ...sectionNavigationItems,
    reviews ? { href: '#reviews', label: 'Reviews' } : null,
    bookingSteps ? { href: '#booking-process', label: 'Booking' } : bookingWidget ? { href: '#booking-request', label: 'Booking' } : null,
    faqSection ? { href: '#questions', label: 'Questions' } : null,
  ].filter(Boolean);

  return <section className={`ds-pattern ds-object-pattern ds-object-pattern--${category}`} aria-label={`${category} details`}>
    <ObjectStickyNav items={navigationItems ?? defaultNavigationItems} bookingSummary={bookingSummary} />
    <div className="ds-object-pattern__layout">
      <div className="ds-object-pattern__flow">{mainTags}{objectDescription}{categorySection}<RegisteredAdditionalSections sections={additionalSections} />{reviews}</div>
      {bookingSlot ? <div className="ds-object-pattern__booking">{bookingSlot}</div> : null}
    </div>
    {bookingSteps || faqSection ? <div className="ds-object-pattern__full-width">{bookingSteps}{faqSection}</div> : null}
    {relatedListings ? <div className="ds-object-pattern__related">{relatedListings}</div> : null}
  </section>;
}

export function InstructorObjectPattern({ certifications, ...props }) {
  return <ObjectPatternFrame {...props} category="instructor" categorySection={certifications} bookingSteps={<InstructorBookingSteps />} />;
}
export const ActivityObjectPattern = (props) => <ObjectPatternFrame category="activity" {...props} />;
export const RentalObjectPattern = (props) => <ObjectPatternFrame category="rental" {...props} />;
export const TransferObjectPattern = (props) => <ObjectPatternFrame category="transfer" {...props} />;
export const StayObjectPattern = (props) => <ObjectPatternFrame category="stay" {...props} />;

export const PATTERN_CONTRACTS = {
  catalogDiscovery: { task: 'Browse a category, refine it, understand result volume and move through result pages.', sequence: ['CategoryTabs', 'FilterToolbar (includes ResultCount)', 'ListingGrid', 'EmptyState|Pagination'], states: ['loading', 'empty', 'error', 'ready'], interaction: 'Category changes reset pagination; filters update result count; focus remains on the initiating control.', mobile: 'Tabs wrap into a compact grid; grouped filters remain keyboard operable; cards form one column.', accessibility: 'Filter labels, result aria-live, keyboard-operable tabs and pagination.', variations: ['instant filters', 'apply filters'] },
  searchAndFiltering: { task: 'Search by intent and progressively narrow results.', sequence: ['Search', 'FilterControls', 'ActiveFilters', 'ResultCount', 'Results'], states: ['idle', 'loading', 'empty', 'error', 'ready'], interaction: 'Submit preserves query; removing a chip updates results and URL state.', mobile: 'Search remains visible; filter dialog announces active count.', accessibility: 'Search landmark, labelled controls, focus restoration after dialog close.', variations: ['inline', 'dialog filters'] },
  bookingFlow: { task: 'Complete a category-registered multi-step request with a persistent, reviewable summary.', sequence: ['BookingFormSection (active and reviewable completed steps)', 'BookingRequestSummary', 'Actions', 'Status'], states: ['editing', 'validating', 'submitting', 'error', 'success'], interaction: 'Validation blocks forward movement and keeps the current step open with an announced error; completed steps remain directly editable.', mobile: 'The request summary follows the active step and actions become full width.', accessibility: 'Ordered step labels, required field labels, alert feedback and status announcements.', variations: ['transaction', 'inquiry', 'operator-match'] },
  searchFlow: { task: 'Move from a broad query to a useful destination.', sequence: ['SearchHero', 'Suggestions', 'Feedback', 'Results'], states: ['idle', 'loading', 'empty', 'error', 'ready'], interaction: 'Suggestions populate the same query model as typed search.', mobile: 'Single input/action stack and compact suggestions.', accessibility: 'Search landmark, meaningful status announcements, no focus theft.', variations: ['global', 'catalog'] },
  emptyAndErrorResults: { task: 'Recover from a result set that cannot currently be shown.', sequence: ['StateMessage', 'RecoveryAction', 'Optional alternatives'], states: ['loading', 'empty', 'error', 'ready'], interaction: 'Retry preserves the current query and filters.', mobile: 'Actions become full width.', accessibility: 'Errors use alert; loading and empty states use status.', variations: ['compact', 'page'] },
  editorialReading: { task: 'Read, navigate and continue from a long-form article.', sequence: ['ArticleHeader', 'ArticleMedia', 'TableOfContents', 'ArticleBody', 'Sources', 'RelatedArticles'], states: ['loading', 'error', 'ready'], interaction: 'TOC anchors use stable heading IDs and visible focus.', mobile: 'TOC becomes inline; text measure and heading hierarchy remain stable.', accessibility: 'Sequential headings, descriptive media, labelled external links.', variations: ['guide', 'news', 'story'] },
  objectDetail: { task: 'Understand a concrete offer, compare its facts and start a category-aware request.', sequence: ['ObjectStickyNav', 'Two-column content + BookingConfigurator', 'Full-width CategoryBookingSteps?', 'Full-width FaqAccordion?', 'ObjectRelatedListings?'], states: ['ready', 'unavailable'], interaction: 'The compact configurator stays below the shared sticky navigation, collects only price-shaping answers and hands a versioned draft to the full request flow.', mobile: 'Three summary facts remain in one compact segmented strip; content becomes one column; the configurator uses a disclosure.', accessibility: 'Native anchors, aria-current scroll state, visible focus, sequential headings, labelled form controls and reduced-motion-aware scrolling.', variations: ['instructor', 'activity', 'rental', 'transfer', 'stay'] },
  instructorObject: { task: 'Assess one instructor and understand the fixed lesson-booking process.', sequence: ['ObjectStickyNav', 'ObjectMainTags', 'ObjectDescription', 'InstructorCertifications?', 'ObjectReviews?', 'BookingConfigurator', 'Full-width InstructorBookingSteps', 'Full-width FaqAccordion?', 'ObjectRelatedListings?'], states: ['ready', 'unavailable'], interaction: 'Certification files open in a new tab; booking steps are category-owned and identical for every instructor; the configurator hands duration and participant count to the full flow.', mobile: 'Certification cards and booking steps become one column; the configurator becomes a disclosure.', accessibility: 'Certificate previews have descriptive alternatives and explicit links; headings remain sequential and anchor targets clear the sticky navigation.' }
};
