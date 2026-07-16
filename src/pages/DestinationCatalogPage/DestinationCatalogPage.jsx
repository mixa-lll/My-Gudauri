import { useEffect, useMemo, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { Navigate, useParams } from 'react-router-dom';
import { CatalogCategoryTabs } from '../../components/CatalogCategoryTabs/CatalogCategoryTabs';
import { DestinationCard } from '../../components/DestinationCard/DestinationCard';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { LazyInstructorRequestDialog } from '../../components/InstructorRequestDialog/LazyInstructorRequestDialog';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { Container } from '../../components/UI/Container/Container';
import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
import { getDestination } from '../../data/destinations';
import { getInstructors } from '../../services/instructorsApi';
import './DestinationCatalogPage.scss';

const CATALOG_FILTERS = {
  instructors: {
    categories: [
      ['all', 'All instructors', 'Verified local professionals'],
      ['ski', 'Ski', 'Piste and technique lessons'],
      ['snowboard', 'Snowboard', 'Technique and all-mountain lessons']
    ],
    refinements: [
      ['russian', 'Russian', null, null, 'language', 'Language'],
      ['english', 'English', null, null, 'language', 'Language'],
      ['georgian', 'Georgian', null, null, 'language', 'Language'],
      ['kids', 'Works with children', null, null, 'audience', 'Lessons'],
      ['first-lessons', 'First lessons', null, null, 'specialty', 'Focus'],
      ['technique', 'Technique', null, null, 'specialty', 'Focus'],
      ['carving', 'Carving', null, null, 'specialty', 'Focus'],
      ['freeride', 'Freeride', null, null, 'specialty', 'Focus'],
      ['freestyle', 'Freestyle', null, null, 'specialty', 'Focus']
    ]
  },
  activities: {
    categories: [
      ['all', 'All adventures', 'Every way to explore Gudauri'],
      ['freeride', 'Freeride', 'Guided off-piste days', ['heli-ski', 'freeride-day']],
      ['snow-air', 'Snow & air', 'Snowmobiles and paragliding', ['snowmobile-plateau', 'paragliding-gudauri']],
      ['excursions', 'Excursions', 'Culture, views and food', ['kazbegi-gergeti', 'gastro-route']]
    ],
    refinements: [
      ['beginner', 'Beginner friendly', ['kazbegi-gergeti', 'snowmobile-plateau', 'paragliding-gudauri', 'gastro-route']],
      ['short', 'Half day', ['snowmobile-plateau', 'paragliding-gudauri', 'gastro-route']],
      ['transfer', 'With transfer', ['kazbegi-gergeti', 'gastro-route']]
    ]
  },
  rental: {
    categories: [
      ['all', 'All equipment', 'Everything for a day on snow'],
      ['ski', 'Ski sets', 'Piste, powder and kids', ['performance-ski-set', 'freeride-ski-set', 'kids-ski-set']],
      ['snowboard', 'Snowboard', 'All-mountain setup', ['snowboard-set']],
      ['safety', 'Safety & extras', 'Protection and avalanche gear', ['avalanche-set', 'premium-helmet-goggles']]
    ],
    refinements: [
      ['all-levels', 'All levels', ['snowboard-set', 'kids-ski-set', 'premium-helmet-goggles']],
      ['advanced', 'Advanced', ['performance-ski-set', 'freeride-ski-set', 'avalanche-set']],
      ['kids', 'For children', ['kids-ski-set']]
    ]
  },
  transfers: {
    categories: [
      ['all', 'All routes', 'Airport and regional transfers'],
      ['tbilisi', 'Tbilisi ↔ Gudauri', 'Airport and city pickup', ['tbilisi-airport-gudauri', 'tbilisi-minivan-gudauri']],
      ['kutaisi', 'Kutaisi ↔ Gudauri', 'Private airport transfer', ['kutaisi-gudauri']],
      ['regional', 'Regional routes', 'Batumi, Kazbegi and Vladikavkaz', ['batumi-gudauri', 'kazbegi-gudauri', 'vladikavkaz-gudauri']]
    ],
    refinements: [
      ['airport', 'Airport pickup', ['tbilisi-airport-gudauri', 'kutaisi-gudauri', 'vladikavkaz-gudauri']],
      ['groups', 'For groups', ['tbilisi-minivan-gudauri', 'vladikavkaz-gudauri']],
      ['four-by-four', 'Winter 4×4', ['kazbegi-gudauri']]
    ]
  },
  services: {
    categories: [
      ['all', 'All services', 'Local help for your stay'],
      ['photo', 'Photo & video', 'Memories from the mountain', ['mountain-photo-session', 'ski-video-reel']],
      ['care', 'Childcare & wellness', 'Time for the whole group', ['evening-nanny', 'sports-massage']],
      ['hosting', 'Dining & events', 'Private moments, well planned', ['private-chef', 'event-decor']]
    ],
    refinements: [
      ['at-your-stay', 'At your stay', ['evening-nanny', 'sports-massage', 'private-chef']],
      ['family', 'For families', ['mountain-photo-session', 'evening-nanny', 'private-chef']],
      ['custom', 'Custom plan', ['private-chef', 'event-decor']]
    ]
  },
  stays: {
    categories: [
      ['all', 'All stays', 'Apartments, hotels and chalets'],
      ['apartments', 'Apartments', 'Independent stays in Gudauri', ['four-seasons-loft', 'neo-family-apartment', 'atrium-ski-in', 'loft-long-stay']],
      ['chalets', 'Chalets', 'Space for groups and families', ['panorama-chalet']],
      ['hotels', 'Hotels', 'A room with useful services', ['twins-view-room']]
    ],
    refinements: [
      ['ski-in', 'Ski-in / ski-out', ['four-seasons-loft', 'atrium-ski-in']],
      ['family', 'Family stays', ['neo-family-apartment', 'panorama-chalet']],
      ['two-guests', 'For two guests', ['twins-view-room', 'loft-long-stay']]
    ]
  },
  places: {
    categories: [
      ['all', 'All places', 'Eat, recharge and explore'],
      ['food', 'Restaurants & cafés', 'Meals and good coffee', ['drunk-cherry', 'platforma-cafe']],
      ['bars', 'Bars', 'Après-ski and late evenings', ['black-dog-bar']],
      ['wellness', 'Spa & useful', 'Recovery and essentials', ['gudauri-lodge-spa', 'smart-market', 'friendship-monument']]
    ],
    refinements: [
      ['late', 'Open late', ['drunk-cherry', 'black-dog-bar']],
      ['new-gudauri', 'New Gudauri', ['drunk-cherry', 'black-dog-bar', 'platforma-cafe']],
      ['bookable', 'Book ahead', ['drunk-cherry', 'gudauri-lodge-spa']]
    ]
  }
};

function toFilter(items) {
  return items.map(([id, label, description, slugs, group, groupLabel]) => ({ id, label, description, slugs, group, groupLabel }));
}

const INSTRUCTOR_FILTER_MATCHERS = {
  russian: (item) => item.languages?.some((language) => language.code === 'Ru'),
  english: (item) => item.languages?.some((language) => language.code === 'En'),
  georgian: (item) => item.languages?.some((language) => language.code === 'Ge'),
  kids: (item) => item.tags?.some((tag) => /kids|children|family/i.test(tag)),
  'first-lessons': (item) => item.tags?.some((tag) => /first lesson/i.test(tag)),
  technique: (item) => item.tags?.some((tag) => /technique/i.test(tag)),
  carving: (item) => item.tags?.some((tag) => /carving/i.test(tag)),
  freeride: (item) => item.tags?.some((tag) => /freeride|off-piste/i.test(tag)),
  freestyle: (item) => item.tags?.some((tag) => /freestyle/i.test(tag))
};

function matchesFilter(section, filter, item) {
  if (!filter || filter.id === 'all') return true;
  if (section !== 'instructors') return !filter.slugs || filter.slugs.includes(item.slug);

  if (filter.id === 'ski' || filter.id === 'snowboard') {
    return item.sports?.some((sport) => sport.slug === filter.id);
  }
  if (INSTRUCTOR_FILTER_MATCHERS[filter.id]) return INSTRUCTOR_FILTER_MATCHERS[filter.id](item);
  return true;
}

function matchesActiveRefinements(section, refinements, activeFilters, item) {
  const selected = refinements.filter((filter) => activeFilters.includes(filter.id));
  if (section !== 'instructors') return selected.every((filter) => matchesFilter(section, filter, item));

  const grouped = selected.reduce((groups, filter) => {
    const group = filter.group || filter.id;
    groups[group] = [...(groups[group] || []), filter];
    return groups;
  }, {});

  return Object.values(grouped).every((filters) => filters.some((filter) => matchesFilter(section, filter, item)));
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 10" aria-hidden="true">
      <path d="m1 5 3 3 7-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 8" aria-hidden="true">
      <path d="m1 1.25 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function InstructorFilterDropdown({ group, activeFilters, onToggle, onClear }) {
  const selectedCount = group.filters.filter((filter) => activeFilters.includes(filter.id)).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={`instructor-filter-trigger ${selectedCount ? 'is-active' : ''}`.trim()} type="button">
          <span>{group.label}</span>
          {selectedCount ? <strong aria-label={`${selectedCount} selected`}>{selectedCount}</strong> : null}
          <span className="instructor-filter-trigger__chevron"><ChevronIcon /></span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="instructor-filter-popover" align="start" sideOffset={9} collisionPadding={12}>
          <div className="instructor-filter-popover__header">
            <div><span>Filter by</span><strong>{group.label}</strong></div>
            {selectedCount ? <button type="button" onClick={() => onClear(group.filters.map((filter) => filter.id))}>Clear</button> : null}
          </div>
          <div className="instructor-filter-popover__options">
            {group.filters.map((filter) => {
              const checked = activeFilters.includes(filter.id);
              const controlId = `instructor-filter-${group.id}-${filter.id}`;
              return (
                <div className={`instructor-filter-option ${checked ? 'is-checked' : ''}`.trim()} key={filter.id}>
                  <label htmlFor={controlId}>{filter.label}</label>
                  <Checkbox.Root id={controlId} checked={checked} onCheckedChange={() => onToggle(filter.id)} aria-label={filter.label}>
                    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
              );
            })}
          </div>
          <Popover.Arrow className="instructor-filter-popover__arrow" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PricingInfoPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="instructor-price-note__help" type="button" aria-label="How instructor pricing works">?</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="instructor-price-popover" align="end" sideOffset={10} collisionPadding={12}>
          <div className="instructor-price-popover__heading">
            <div><span>Booking guide</span><h3>How it works</h3></div>
            <Popover.Close aria-label="Close pricing guide">×</Popover.Close>
          </div>
          <p>Instructor profiles do not compete on price. Your final total depends on lesson duration and group size.</p>
          <ol>
            <li><span>1</span><div><strong>Send your request</strong><p>Share your dates, group and lesson goals.</p></div></li>
            <li><span>2</span><div><strong>We check availability</strong><p>A manager finds the best available match.</p></div></li>
            <li><span>3</span><div><strong>Confirm before booking</strong><p>You receive the instructor, schedule and final price.</p></div></li>
          </ol>
          <Popover.Arrow className="instructor-price-popover__arrow" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function DestinationCatalogPage({ section: sectionProp }) {
  const params = useParams();
  const section = sectionProp ?? params.section;
  const config = getDestination(section);
  const filterConfig = CATALOG_FILTERS[section];
  const [items, setItems] = useState(section === 'instructors' ? [] : (config?.items ?? []));
  const [status, setStatus] = useState(section === 'instructors' ? 'loading' : 'ready');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('destination-page-body');
    return () => document.body.classList.remove('destination-page-body');
  }, []);

  useEffect(() => {
    setActiveCategory('all');
    setActiveFilters([]);
    if (config) document.title = `${config.title} — My Gudauri`;

    if (section !== 'instructors') {
      setItems(config?.items ?? []);
      setStatus('ready');
      return undefined;
    }

    let active = true;
    setItems([]);
    setStatus('loading');
    getInstructors()
      .then((nextItems) => {
        if (!active) return;
        if (!Array.isArray(nextItems)) throw new Error('Invalid instructor response');
        setItems(nextItems);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [config, section]);

  const categories = useMemo(() => toFilter(filterConfig?.categories ?? []), [filterConfig]);
  const refinements = useMemo(() => toFilter(filterConfig?.refinements ?? []), [filterConfig]);
  const availableRefinements = useMemo(() => section === 'instructors' ? [
    ...categories.filter((category) => category.id !== 'all').map((category) => ({
      ...category,
      group: 'discipline',
      groupLabel: 'Discipline'
    })),
    ...refinements
  ] : refinements, [categories, refinements, section]);
  const refinementGroups = useMemo(() => availableRefinements.reduce((groups, filter) => {
    const groupId = filter.group || 'filters';
    const current = groups.find((group) => group.id === groupId);
    if (current) current.filters.push(filter);
    else groups.push({ id: groupId, label: filter.groupLabel || 'Filters', filters: [filter] });
    return groups;
  }, []), [availableRefinements]);
  const categoryItems = useMemo(() => {
    if (section === 'instructors') return items;
    const category = categories.find((item) => item.id === activeCategory);
    return items.filter((item) => matchesFilter(section, category, item));
  }, [activeCategory, categories, items, section]);
  const displayedItems = useMemo(
    () => categoryItems.filter((item) => matchesActiveRefinements(section, availableRefinements, activeFilters, item)),
    [activeFilters, availableRefinements, categoryItems, section]
  );
  const categoryTabs = useMemo(() => categories.map((category) => ({
    ...category,
    count: items.filter((item) => matchesFilter(section, category, item)).length
  })), [categories, items, section]);

  if (!config) return <Navigate to="/" replace />;

  const toggleFilter = (filter) => {
    setActiveFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  };

  const clearFilters = (filterIds) => {
    setActiveFilters((current) => current.filter((filterId) => !filterIds.includes(filterId)));
  };

  return (
    <div className={`destination-page destination-page--${config.accent}`}>
      <SiteNavbar className="destination-nav-host" />

      <main>
        <Container className="destination-shell">
          <section className={`destination-hero ${section === 'instructors' ? 'destination-hero--instructors' : ''}`.trim()} aria-labelledby="destination-title">
            <div className="destination-hero__copy">
              <SectionHeading
                as="h1"
                size="lg"
                align="center"
                kicker={config.kicker}
                title={config.title}
                titleId="destination-title"
                description={config.description}
              />
            </div>
            {section === 'instructors' ? (
              <>
                <section className="instructor-concierge" aria-label="Personal instructor selection">
                  <div className="instructor-concierge__copy">
                    <span>Personal matching</span>
                    <h2>Tell us your dates and what you need.</h2>
                    <p>We will check availability and suggest an instructor for your language, group and lesson goals.</p>
                  </div>
                  <button type="button" onClick={() => setIsRequestOpen(true)}>Ask us to choose <span aria-hidden="true">↗</span></button>
                </section>
                <section className="instructor-price-note" aria-label="Instructor pricing information">
                  <div className="instructor-price-note__mark" aria-hidden="true">=</div>
                  <div>
                    <span>Simple pricing</span>
                    <strong>One rate for every instructor</strong>
                    <p>Choose by teaching style, language and experience — not by price.</p>
                  </div>
                  <PricingInfoPopover />
                </section>
              </>
            ) : (
              <section className="destination-promise" aria-label="Service promise">
                <div className="destination-promise__icon" aria-hidden="true">i</div>
                <div><strong>{config.promise}</strong><p>{config.promiseNote}</p></div>
                <span>{config.startingPrice}</span>
              </section>
            )}
          </section>

          <section className="destination-list" aria-labelledby="destination-list-title">
            {section !== 'instructors' ? (
              <CatalogCategoryTabs
                categories={categoryTabs}
                activeId={activeCategory}
                onChange={(categoryId) => {
                  setActiveCategory(categoryId);
                  setActiveFilters([]);
                }}
                label={`${config.title} categories`}
              />
            ) : null}
            <div className="destination-toolbar">
              <div>
                <SectionHeading size="sm" kicker="Selection options" title={section === 'instructors' ? 'Find the right fit' : 'Refine results'} />
                {section === 'instructors' ? (
                  <div className="instructor-filter-bar" aria-label="Instructor filters">
                    {refinementGroups.map((group) => (
                      <InstructorFilterDropdown
                        group={group}
                        activeFilters={activeFilters}
                        onToggle={toggleFilter}
                        onClear={clearFilters}
                        key={group.id}
                      />
                    ))}
                    {activeFilters.length ? <button className="instructor-filter-clear" type="button" onClick={() => setActiveFilters([])}>Clear all</button> : null}
                  </div>
                ) : (
                  <div className="destination-filters">
                    {refinements.map((filter) => (
                      <button className={activeFilters.includes(filter.id) ? 'is-active' : ''} type="button" aria-pressed={activeFilters.includes(filter.id)} onClick={() => toggleFilter(filter.id)} key={filter.id}>
                        {filter.label}<span aria-hidden="true">{activeFilters.includes(filter.id) ? '×' : '⌄'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="destination-toolbar__count">
                <h2 id="destination-list-title">Selected for you</h2>
                <p>{status === 'loading' ? `Loading ${config.countLabel}…` : `${displayedItems.length} ${section === 'instructors' && displayedItems.length === 1 ? 'instructor' : config.countLabel}`}</p>
              </div>
            </div>

            {status === 'loading' ? (
              <div className="destination-empty-state"><p>Loading {config.countLabel}…</p></div>
            ) : status === 'error' ? (
              <p role="alert">Instructors are temporarily unavailable. Please try again later.</p>
            ) : displayedItems.length ? (
              <div className="destination-grid">
                {displayedItems.map((item) => <DestinationCard item={item} section={section} key={item.slug} />)}
              </div>
            ) : (
              <div className="destination-empty-state">
                <p>No offers match these filters yet.</p>
                <button type="button" onClick={() => { setActiveCategory('all'); setActiveFilters([]); }}>Show all offers</button>
              </div>
            )}
          </section>

          <section className="destination-benefits" aria-labelledby="destination-benefits-title">
            <SectionHeading
              as="h2"
              size="md"
              kicker="Why My Gudauri"
              title={config.benefitsTitle}
              titleId="destination-benefits-title"
            />
            <div className="destination-benefits__grid">
              {config.benefits.map(([title, description], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="destination-faq">
            <FaqAccordion items={config.faq} />
          </section>
        </Container>
      </main>

      <SiteFooter />
      {section === 'instructors' ? <LazyInstructorRequestDialog open={isRequestOpen} onOpenChange={setIsRequestOpen} /> : null}
    </div>
  );
}
