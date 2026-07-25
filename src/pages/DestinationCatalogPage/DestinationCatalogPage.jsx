import { useEffect, useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BenefitsSection, BookingSteps, Button, CatalogCategoryTabs, CatalogHero, Container, DestinationCard, FaqAccordion, FilterControl, FilterToolbar, ListingCardGrid, SiteFooter, SiteNavbar } from '../../design-system';
import { getDestination } from '../../data/destinations';
import { ACTIVITY_GROUP_LABELS, getActivities } from '../../services/activitiesApi';
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
      ['male', 'Male', null, null, 'gender', 'Gender'],
      ['female', 'Female', null, null, 'gender', 'Gender'],
      ['kids', 'Works with children', null, null, 'specialty', 'Focus'],
      ['first-lessons', 'First lessons', null, null, 'specialty', 'Focus'],
      ['technique', 'Technique', null, null, 'specialty', 'Focus'],
      ['carving', 'Carving', null, null, 'specialty', 'Focus'],
      ['freeride', 'Freeride', null, null, 'specialty', 'Focus'],
      ['freestyle', 'Freestyle', null, null, 'specialty', 'Focus']
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
      ['all-levels', 'All levels', null, ['snowboard-set', 'kids-ski-set', 'premium-helmet-goggles'], 'level', 'Level'],
      ['advanced', 'Advanced', null, ['performance-ski-set', 'freeride-ski-set', 'avalanche-set'], 'level', 'Level'],
      ['kids', 'For children', null, ['kids-ski-set'], 'audience', 'Audience']
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
      ['airport', 'Airport pickup', null, ['tbilisi-airport-gudauri', 'kutaisi-gudauri', 'vladikavkaz-gudauri'], 'pickup', 'Pickup'],
      ['groups', 'For groups', null, ['tbilisi-minivan-gudauri', 'vladikavkaz-gudauri'], 'group', 'Group'],
      ['four-by-four', 'Winter 4×4', null, ['kazbegi-gudauri'], 'vehicle', 'Vehicle']
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
      ['at-your-stay', 'At your stay', null, ['evening-nanny', 'sports-massage', 'private-chef'], 'location', 'Location'],
      ['family', 'For families', null, ['mountain-photo-session', 'evening-nanny', 'private-chef'], 'audience', 'Audience'],
      ['custom', 'Custom plan', null, ['private-chef', 'event-decor'], 'format', 'Format']
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
      ['ski-in', 'Ski-in / ski-out', null, ['four-seasons-loft', 'atrium-ski-in'], 'access', 'Access'],
      ['family', 'Family stays', null, ['neo-family-apartment', 'panorama-chalet'], 'guests', 'Guests'],
      ['two-guests', 'For two guests', null, ['twins-view-room', 'loft-long-stay'], 'guests', 'Guests']
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
      ['late', 'Open late', null, ['drunk-cherry', 'black-dog-bar'], 'hours', 'Hours'],
      ['new-gudauri', 'New Gudauri', null, ['drunk-cherry', 'black-dog-bar', 'platforma-cafe'], 'location', 'Location'],
      ['bookable', 'Book ahead', null, ['drunk-cherry', 'gudauri-lodge-spa'], 'booking', 'Booking']
    ]
  }
};

function toFilter(items) {
  return items.map(([id, label, description, slugs, group, groupLabel]) => ({ id, label, description, slugs, group, groupLabel }));
}

function activityFilters(items) {
  const options = (field, group, groupLabel) => [...new Set(items.map((item) => item[field]).filter(Boolean))].map((value) => ({
    id: `${field}:${value}`,
    label: value,
    field,
    value,
    group,
    groupLabel
  }));
  return {
    categories: [
      { id: 'all', label: 'All adventures', description: 'Every way to explore Gudauri' },
      ...options('catalogGroup').map((item) => ({ ...item, label: ACTIVITY_GROUP_LABELS[item.value] || item.value }))
    ],
    refinements: [
      ...options('skillLevel', 'level', 'Level'),
      ...options('durationGroup', 'duration', 'Duration'),
      ...options('format', 'format', 'Format')
    ]
  };
}

const INSTRUCTOR_FILTER_MATCHERS = {
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

function matchesFilter(section, filter, item) {
  if (!filter || filter.id === 'all') return true;
  if (section === 'activities' && filter.field) return item[filter.field] === filter.value;
  if (section !== 'instructors') return !filter.slugs || filter.slugs.includes(item.slug);

  if (filter.id === 'ski' || filter.id === 'snowboard') {
    return item.sports?.some((sport) => sport.slug === filter.id);
  }
  if (INSTRUCTOR_FILTER_MATCHERS[filter.id]) return INSTRUCTOR_FILTER_MATCHERS[filter.id](item);
  return true;
}

function matchesActiveRefinements(section, refinements, activeFilters, item) {
  const selected = refinements.filter((filter) => activeFilters.includes(filter.id));
  if (section !== 'instructors' && section !== 'activities') return selected.every((filter) => matchesFilter(section, filter, item));

  const grouped = selected.reduce((groups, filter) => {
    const group = filter.group || filter.id;
    groups[group] = [...(groups[group] || []), filter];
    return groups;
  }, {});

  return Object.values(grouped).every((filters) => filters.some((filter) => matchesFilter(section, filter, item)));
}

function PricingInfoPopover({ steps = [] }) {
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
            {steps.map(([title, description], index) => (
              <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{description}</p></div></li>
            ))}
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
  const apiBacked = section === 'instructors' || section === 'activities';
  const [items, setItems] = useState(apiBacked ? [] : (config?.items ?? []));
  const [status, setStatus] = useState(apiBacked ? 'loading' : 'ready');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    document.body.classList.add('destination-page-body');
    return () => document.body.classList.remove('destination-page-body');
  }, []);

  useEffect(() => {
    setActiveCategory('all');
    setActiveFilters([]);
    if (config) document.title = `${config.title} — My Gudauri`;

    if (!apiBacked) {
      setItems(config?.items ?? []);
      setStatus('ready');
      return undefined;
    }

    let active = true;
    setItems([]);
    setStatus('loading');
    const loader = section === 'activities' ? getActivities : getInstructors;
    loader()
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
  }, [apiBacked, config, section]);

  const dynamicActivityFilters = useMemo(() => section === 'activities' ? activityFilters(items) : null, [items, section]);
  const categories = useMemo(() => dynamicActivityFilters?.categories ?? toFilter(filterConfig?.categories ?? []), [dynamicActivityFilters, filterConfig]);
  const refinements = useMemo(() => dynamicActivityFilters?.refinements ?? toFilter(filterConfig?.refinements ?? []), [dynamicActivityFilters, filterConfig]);
  const availableRefinements = refinements;
  const refinementGroups = useMemo(() => availableRefinements.reduce((groups, filter) => {
    const groupId = filter.group || 'filters';
    const current = groups.find((group) => group.id === groupId);
    if (current) current.filters.push(filter);
    else groups.push({ id: groupId, label: filter.groupLabel || 'Filters', filters: [filter] });
    return groups;
  }, []), [availableRefinements]);
  const categoryItems = useMemo(() => {
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
        <Container width="wide">
          <div className={`destination-hero ${section === 'instructors' ? 'destination-hero--instructors' : ''}`.trim()}>
            <CatalogHero
              align="center"
              kicker={config.kicker}
              title={config.title}
              titleId="destination-title"
              description={config.description}
            />
            {section === 'instructors' ? (
              <>
                <section className="instructor-concierge" aria-label="Personal instructor selection">
                  <div className="instructor-concierge__copy">
                    <span>Personal matching</span>
                    <h2>Tell us your dates and what you need.</h2>
                    <p>We will check availability and suggest an instructor for your language, group and lesson goals.</p>
                  </div>
                  <Link to="/instructors/match">Ask us to choose <span aria-hidden="true">↗</span></Link>
                </section>
                <section className="instructor-price-note" aria-label="Instructor pricing information">
                  <div className="instructor-price-note__mark" aria-hidden="true">=</div>
                  <div>
                    <span>Simple pricing</span>
                    <strong>One rate for every instructor</strong>
                    <p>Choose by teaching style, language and experience — not by price.</p>
                  </div>
                  <PricingInfoPopover steps={config.bookingSteps} />
                </section>
              </>
            ) : (
              <section className="destination-promise" aria-label="Service promise">
                <div className="destination-promise__icon" aria-hidden="true">i</div>
                <div><strong>{config.promise}</strong><p>{config.promiseNote}</p></div>
                <span>{config.startingPrice}</span>
              </section>
            )}
          </div>

          <section className="destination-list" aria-labelledby="destination-list-title">
            <CatalogCategoryTabs
              categories={categoryTabs}
              activeId={activeCategory}
              columns={section === 'activities' ? 3 : undefined}
              onChange={(categoryId) => {
                setActiveCategory(categoryId);
                setActiveFilters([]);
              }}
              label={section === 'instructors' ? 'Instructor disciplines' : `${config.title} categories`}
            />
            <FilterToolbar
              title={section === 'instructors' ? 'Find the right fit' : 'Refine results'}
              titleId="destination-list-title"
              ariaLabel={`${config.title} filters`}
              resultCount={status === 'loading' ? '…' : displayedItems.length}
              resultLabel={section === 'instructors' && displayedItems.length === 1 ? 'instructor' : (section === 'activities' && displayedItems.length === 1 ? 'experience' : config.countLabel)}
              controls={refinementGroups.map((group) => (
                <FilterControl id={`${section}-${group.id}`} label={group.label} options={group.filters} selectedValues={activeFilters} onToggle={toggleFilter} onClear={clearFilters} key={group.id} />
              ))}
              actions={activeFilters.length ? <Button variant="link" onClick={() => setActiveFilters([])}>Clear all</Button> : null}
            />

            {status === 'loading' ? (
              <div className="destination-empty-state"><p>Loading {config.countLabel}…</p></div>
            ) : status === 'error' ? (
              <p role="alert">{section === 'activities' ? 'Activities' : 'Instructors'} are temporarily unavailable. Please try again later.</p>
            ) : displayedItems.length ? (
              <ListingCardGrid className="destination-grid" columns={3} ariaLabel={`${config.title} results`}>
                {displayedItems.map((item) => <DestinationCard item={item} section={section} key={item.slug} />)}
              </ListingCardGrid>
            ) : (
              <div className="destination-empty-state">
                <p>No offers match these filters yet.</p>
                <button type="button" onClick={() => { setActiveCategory('all'); setActiveFilters([]); }}>Show all offers</button>
              </div>
            )}
          </section>

          <div className="destination-benefits">
            <BenefitsSection
              kicker="Why My Gudauri"
              title={config.benefitsTitle}
              items={config.benefits.map(([title, description], index) => ({ icon: String(index + 1).padStart(2, '0'), title, description }))}
            />
          </div>

          {config.bookingSteps?.length ? (
            <div className="destination-booking">
              <BookingSteps
                kicker={config.bookingKicker}
                title={config.bookingTitle}
                items={config.bookingSteps.map(([title, description]) => ({ title, description }))}
              />
            </div>
          ) : null}

          <section className="destination-faq">
            <FaqAccordion items={config.faq} />
          </section>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
