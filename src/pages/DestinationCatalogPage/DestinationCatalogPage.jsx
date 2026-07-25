import { useEffect, useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BenefitsSection, BookingSteps, Button, CatalogCategoryTabs, CatalogHero, Container, DestinationCard, FaqAccordion, FilterControl, FilterToolbar, ListingCardGrid, SiteFooter, SiteNavbar } from '../../design-system';
import { getDestination } from '../../data/destinations';
import { useLanguage } from '../../i18n/LanguageContext';
import { ACTIVITY_GROUP_LABELS, getActivities } from '../../services/activitiesApi';
import { getInstructors } from '../../services/instructorsApi';
import './DestinationCatalogPage.scss';

const CATALOG_FILTERS = {
  instructors: {
    categories: [['all'], ['ski'], ['snowboard']],
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
    categories: [
      ['all'],
      ['tbilisi', ['tbilisi-airport-gudauri', 'tbilisi-minivan-gudauri']],
      ['kutaisi', ['kutaisi-gudauri']],
      ['regional', ['batumi-gudauri', 'kazbegi-gudauri', 'vladikavkaz-gudauri']]
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

function toCategoryFilters(section, items, t) {
  return items.map(([id, slugs]) => ({
    id,
    slugs,
    label: t(`catalog.${section}.categories.${id}.label`),
    description: t(`catalog.${section}.categories.${id}.description`)
  }));
}

function toRefinementFilters(section, items, t) {
  return items.map(([id, group, slugs]) => ({
    id,
    slugs,
    group,
    label: t(`catalog.${section}.refinements.${id}`),
    groupLabel: t(`catalog.groups.${group}`)
  }));
}

function activityFilters(items, t) {
  const options = (field, group) => [...new Set(items.map((item) => item[field]).filter(Boolean))].map((value) => ({
    id: `${field}:${value}`,
    label: value,
    field,
    value,
    group,
    groupLabel: group ? t(`catalog.groups.${group}`) : undefined
  }));
  return {
    categories: [
      { id: 'all', label: t('catalog.activities.categories.all.label'), description: t('catalog.activities.categories.all.description') },
      ...options('catalogGroup').map((item) => ({ ...item, label: ACTIVITY_GROUP_LABELS[item.value] || item.value }))
    ],
    refinements: [
      ...options('skillLevel', 'level'),
      ...options('durationGroup', 'duration'),
      ...options('format', 'format')
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

function PricingInfoPopover({ steps = [], t }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="instructor-price-note__help" type="button" aria-label={t('catalog.instructors.pricing.helpLabel')}>?</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="instructor-price-popover" align="end" sideOffset={10} collisionPadding={12}>
          <div className="instructor-price-popover__heading">
            <div><span>{t('catalog.instructors.bookingKicker')}</span><h3>{t('catalog.instructors.bookingTitle')}</h3></div>
            <Popover.Close aria-label={t('catalog.instructors.pricing.closeLabel')}>×</Popover.Close>
          </div>
          <p>{t('catalog.instructors.pricing.note')}</p>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title}><span>{index + 1}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>
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
  const { t, tList } = useLanguage();
  const section = sectionProp ?? params.section;
  const config = getDestination(section);
  const sectionTitle = t(`categories.${section}.title`);
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
    if (config) document.title = `${sectionTitle} — My Gudauri`;

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
  }, [apiBacked, config, section, sectionTitle]);

  const dynamicActivityFilters = useMemo(() => section === 'activities' ? activityFilters(items, t) : null, [items, section, t]);
  const categories = useMemo(
    () => dynamicActivityFilters?.categories ?? toCategoryFilters(section, filterConfig?.categories ?? [], t),
    [dynamicActivityFilters, filterConfig, section, t]
  );
  const refinements = useMemo(
    () => dynamicActivityFilters?.refinements ?? toRefinementFilters(section, filterConfig?.refinements ?? [], t),
    [dynamicActivityFilters, filterConfig, section, t]
  );
  const availableRefinements = refinements;
  const refinementGroups = useMemo(() => availableRefinements.reduce((groups, filter) => {
    const groupId = filter.group || 'filters';
    const current = groups.find((group) => group.id === groupId);
    if (current) current.filters.push(filter);
    else groups.push({ id: groupId, label: filter.groupLabel || t('catalog.groups.filters'), filters: [filter] });
    return groups;
  }, []), [availableRefinements, t]);
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

  const bookingSteps = tList(`catalog.${section}.bookingSteps`, { optional: true });

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
              kicker={t(`catalog.${section}.kicker`)}
              title={sectionTitle}
              titleId="destination-title"
              description={t(`catalog.${section}.description`)}
            />
            {section === 'instructors' ? (
              <>
                <section className="instructor-concierge" aria-label={t('catalog.instructors.concierge.ariaLabel')}>
                  <div className="instructor-concierge__copy">
                    <span>{t('catalog.instructors.concierge.kicker')}</span>
                    <h2>{t('catalog.instructors.concierge.title')}</h2>
                    <p>{t('catalog.instructors.concierge.text')}</p>
                  </div>
                  <Link to="/instructors/match">{t('catalog.instructors.concierge.action')} <span aria-hidden="true">↗</span></Link>
                </section>
                <section className="instructor-price-note" aria-label={t('catalog.instructors.pricing.ariaLabel')}>
                  <div className="instructor-price-note__mark" aria-hidden="true">=</div>
                  <div>
                    <span>{t('catalog.instructors.pricing.kicker')}</span>
                    <strong>{t('catalog.instructors.pricing.title')}</strong>
                    <p>{t('catalog.instructors.pricing.text')}</p>
                  </div>
                  <PricingInfoPopover steps={bookingSteps} t={t} />
                </section>
              </>
            ) : (
              <section className="destination-promise" aria-label={t('catalog.common.promiseLabel')}>
                <div className="destination-promise__icon" aria-hidden="true">i</div>
                <div><strong>{t(`catalog.${section}.promise`)}</strong><p>{t(`catalog.${section}.promiseNote`)}</p></div>
                <span>{t(`catalog.${section}.startingPrice`)}</span>
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
              label={section === 'instructors' ? t('catalog.instructors.disciplinesLabel') : t('catalog.common.categoriesLabel', { title: sectionTitle })}
            />
            <FilterToolbar
              title={section === 'instructors' ? t('catalog.instructors.filtersTitle') : t('catalog.common.filtersTitle')}
              titleId="destination-list-title"
              ariaLabel={t('catalog.common.filtersAriaLabel', { title: sectionTitle })}
              resultCount={status === 'loading' ? '…' : displayedItems.length}
              resultLabel={displayedItems.length === 1 ? t(`catalog.${section}.countLabelOne`) : t(`catalog.${section}.countLabel`)}
              controls={refinementGroups.map((group) => (
                <FilterControl id={`${section}-${group.id}`} label={group.label} options={group.filters} selectedValues={activeFilters} onToggle={toggleFilter} onClear={clearFilters} key={group.id} />
              ))}
              actions={activeFilters.length ? <Button variant="link" onClick={() => setActiveFilters([])}>{t('catalog.common.clearAll')}</Button> : null}
            />

            {status === 'loading' ? (
              <div className="destination-empty-state"><p>{t('catalog.common.loading', { items: t(`catalog.${section}.countLabel`) })}</p></div>
            ) : status === 'error' ? (
              <p role="alert">{t('catalog.common.error', { items: sectionTitle })}</p>
            ) : displayedItems.length ? (
              <ListingCardGrid className="destination-grid" columns={3} ariaLabel={t('catalog.common.resultsAriaLabel', { title: sectionTitle })}>
                {displayedItems.map((item) => <DestinationCard item={item} section={section} key={item.slug} />)}
              </ListingCardGrid>
            ) : (
              <div className="destination-empty-state">
                <p>{t('catalog.common.empty')}</p>
                <button type="button" onClick={() => { setActiveCategory('all'); setActiveFilters([]); }}>{t('catalog.common.showAll')}</button>
              </div>
            )}
          </section>

          <div className="destination-benefits">
            <BenefitsSection
              kicker={t('catalog.common.benefitsKicker')}
              title={t(`catalog.${section}.benefitsTitle`)}
              items={tList(`catalog.${section}.benefits`).map((benefit, index) => ({ icon: String(index + 1).padStart(2, '0'), ...benefit }))}
            />
          </div>

          {bookingSteps.length ? (
            <div className="destination-booking">
              <BookingSteps
                kicker={t(`catalog.${section}.bookingKicker`)}
                title={t(`catalog.${section}.bookingTitle`)}
                items={bookingSteps}
              />
            </div>
          ) : null}

          <section className="destination-faq">
            <FaqAccordion items={tList(`catalog.${section}.faq`)} />
          </section>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
