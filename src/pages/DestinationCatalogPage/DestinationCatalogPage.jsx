import { useEffect, useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { BenefitsSection, BookingSteps, Button, CatalogCategoryTabs, CatalogHero, CatalogRoutePanel, Container, DestinationCard, FaqAccordion, FilterControl, FilterToolbar, ListingCardGrid, MoreResultsCard, SiteFooter, SiteNavbar } from '../../design-system';
import { CATALOG_FILTERS, matchesActiveRefinements, matchesFilter } from '../../data/catalogFilters';
import { getDestination } from '../../data/destinations';
import { useLanguage } from '../../i18n/LanguageContext';
import { ACTIVITY_GROUP_LABELS, getActivities } from '../../services/activitiesApi';
import { getInstructors } from '../../services/instructorsApi';
import { getTransfers } from '../../services/transfersApi';
import './DestinationCatalogPage.scss';


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

/**
 * Transfer routes come from the database, so the city tabs are derived from the
 * data rather than a hard-coded slug list — a route added in the CMS shows up
 * without a code change. Cities the locale does not name yet fall back to their
 * own slug instead of printing a translation path.
 */
function transferFilters(items, t) {
  const label = (path, fallback) => {
    const value = t(path);
    return value === path ? fallback : value;
  };
  const cities = [...new Set(items.map((item) => item.city).filter(Boolean))];
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
      { id: 'all', label: t('catalog.transfers.categories.all.label'), description: t('catalog.transfers.categories.all.description') },
      ...cities.map((city) => ({
        id: city,
        field: 'city',
        value: city,
        label: label(`catalog.transfers.categories.${city}.label`, `${city.charAt(0).toUpperCase()}${city.slice(1)}`),
        description: label(`catalog.transfers.categories.${city}.description`, undefined)
      }))
    ],
    refinements: [
      ...options('vehicleClass', 'vehicle'),
      ...options('pickupType', 'pickup')
    ]
  };
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

function ConciergeBanner({ t }) {
  return (
    <section className="instructor-concierge" aria-label={t('catalog.instructors.concierge.ariaLabel')}>
      <div className="instructor-concierge__copy">
        <span>{t('catalog.instructors.concierge.kicker')}</span>
        <h2>{t('catalog.instructors.concierge.title')}</h2>
        <p>{t('catalog.instructors.concierge.text')}</p>
      </div>
      <Link to="/instructors/match">{t('catalog.instructors.concierge.action')} <span aria-hidden="true">↗</span></Link>
    </section>
  );
}

function PricingBanner({ t, bookingSteps }) {
  return (
    <section className="instructor-price-note" aria-label={t('catalog.instructors.pricing.ariaLabel')}>
      <div className="instructor-price-note__mark" aria-hidden="true">=</div>
      <div>
        <span>{t('catalog.instructors.pricing.kicker')}</span>
        <strong>{t('catalog.instructors.pricing.title')}</strong>
        <p>{t('catalog.instructors.pricing.text')}</p>
      </div>
      <PricingInfoPopover steps={bookingSteps} t={t} />
    </section>
  );
}

function PromiseBanner({ section, t }) {
  return (
    <section className="destination-promise" aria-label={t('catalog.common.promiseLabel')}>
      <div className="destination-promise__icon" aria-hidden="true">i</div>
      <div><strong>{t(`catalog.${section}.promise`)}</strong><p>{t(`catalog.${section}.promiseNote`)}</p></div>
      <span>{t(`catalog.${section}.startingPrice`)}</span>
    </section>
  );
}

const CATALOG_BANNERS = { concierge: ConciergeBanner, pricing: PricingBanner, promise: PromiseBanner };

// Banners under the catalog hero are opt-in: a section renders exactly the ones it
// lists here, in this order. Sections left out (or with an empty list) show the hero
// alone — that is the current state for every catalog except instructors.
const CATALOG_HERO_BANNERS = {
  instructors: ['concierge', 'pricing']
};

function heroBannersFor(section) {
  return CATALOG_HERO_BANNERS[section] ?? [];
}

function CatalogHeroBanners({ banners, section, t, bookingSteps }) {
  return banners.map((id) => {
    const Banner = CATALOG_BANNERS[id];
    if (!Banner) throw new Error(`CatalogHeroBanners: unregistered banner “${id}”.`);
    return <Banner key={id} section={section} t={t} bookingSteps={bookingSteps} />;
  });
}

export function DestinationCatalogPage({ section: sectionProp }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { t, tList } = useLanguage();
  const section = sectionProp ?? params.section;
  const searchKey = searchParams.toString();
  const config = getDestination(section);
  const sectionTitle = t(`categories.${section}.title`);
  const filterConfig = CATALOG_FILTERS[section];
  const apiBacked = ['instructors', 'activities', 'transfers'].includes(section);
  const [items, setItems] = useState(apiBacked ? [] : (config?.items ?? []));
  const [status, setStatus] = useState(apiBacked ? 'loading' : 'ready');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState([]);
  // Transfer routes work both ways at the same price, so direction is a
  // request detail, not a filter: swapping never changes the result set.
  const [routeDirection, setRouteDirection] = useState('to-gudauri');

  useEffect(() => {
    document.body.classList.add('destination-page-body');
    return () => document.body.classList.remove('destination-page-body');
  }, []);

  useEffect(() => {
    // Deep links from the home hero preselect a category tab and refinements.
    const nextParams = new URLSearchParams(searchKey);
    setActiveCategory(nextParams.get('category') ?? 'all');
    setActiveFilters(nextParams.get('filters')?.split(',').filter(Boolean) ?? []);
    setRouteDirection(nextParams.get('direction') === 'from-gudauri' ? 'from-gudauri' : 'to-gudauri');
    if (config) document.title = `${sectionTitle} — My Gudauri`;

    if (!apiBacked) {
      setItems(config?.items ?? []);
      setStatus('ready');
      return undefined;
    }

    let active = true;
    setItems([]);
    setStatus('loading');
    const loader = { activities: getActivities, transfers: getTransfers, instructors: getInstructors }[section];
    loader()
      .then((nextItems) => {
        if (!active) return;
        if (!Array.isArray(nextItems)) throw new Error(`Invalid ${section} response`);
        setItems(nextItems);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [apiBacked, config, searchKey, section, sectionTitle]);

  const dynamicFilters = useMemo(() => {
    if (section === 'activities') return activityFilters(items, t);
    if (section === 'transfers') return transferFilters(items, t);
    return null;
  }, [items, section, t]);
  const categories = useMemo(
    () => dynamicFilters?.categories ?? toCategoryFilters(section, filterConfig?.categories ?? [], t),
    [dynamicFilters, filterConfig, section, t]
  );
  const refinements = useMemo(
    () => dynamicFilters?.refinements ?? toRefinementFilters(section, filterConfig?.refinements ?? [], t),
    [dynamicFilters, filterConfig, section, t]
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
  const heroBanners = heroBannersFor(section);

  // Transfers replace the category tabs with the Gudauri ↔ city route panel;
  // both surfaces drive the same activeCategory from the shared filter contract.
  const isTransfers = section === 'transfers';
  const routeCount = (count) => `${count} ${t(count === 1 ? `catalog.${section}.countLabelOne` : `catalog.${section}.countLabel`)}`;
  const activeRoute = isTransfers ? categoryTabs.find((category) => category.id === activeCategory) : null;
  const otherRoutesCount = isTransfers ? items.length - categoryItems.length : 0;
  const showOtherRoutesCard = isTransfers && activeCategory !== 'all' && otherRoutesCount > 0;
  const fromGudauri = routeDirection === 'from-gudauri';
  // Card categories are stored as "Gudauri ↔ X"; render them pointed the way
  // the visitor chose so every badge answers "which direction is this?".
  const directionalItem = (item) => {
    if (!isTransfers) return item;
    const [anchorEnd, cityEnd] = (item.category ?? '').split(' ↔ ');
    if (!cityEnd) return item;
    const route = fromGudauri ? `${anchorEnd} → ${cityEnd}` : `${cityEnd} → ${anchorEnd}`;
    return { ...item, category: route, route, direction: routeDirection };
  };

  if (!config) return <Navigate to="/" replace />;

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveFilters([]);
  };

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
          <div className={`destination-hero${heroBanners.length ? '' : ' destination-hero--bare'}`}>
            <CatalogHero
              align="center"
              kicker={t(`catalog.${section}.kicker`)}
              title={sectionTitle}
              titleId="destination-title"
              description={t(`catalog.${section}.description`)}
            />
            <CatalogHeroBanners banners={heroBanners} section={section} t={t} bookingSteps={bookingSteps} />
          </div>

          <section className="destination-list" aria-labelledby="destination-list-title">
            {isTransfers ? (
              <CatalogRoutePanel
                options={categoryTabs.map((category) => ({ ...category, meta: routeCount(category.count) }))}
                activeId={activeCategory}
                onChange={selectCategory}
                anchor={{
                  title: t('catalog.transfers.routePanel.anchorTitle'),
                  meta: t('catalog.transfers.routePanel.anchorMeta')
                }}
                direction={fromGudauri ? 'from-anchor' : 'to-anchor'}
                onDirectionChange={(next) => setRouteDirection(next === 'from-anchor' ? 'from-gudauri' : 'to-gudauri')}
                fromLabel={t('catalog.transfers.routePanel.fromLabel')}
                toLabel={t('catalog.transfers.routePanel.toLabel')}
                swapLabel={t('catalog.transfers.routePanel.swapLabel')}
                kicker={t('catalog.transfers.routePanel.kicker')}
                hint={t('catalog.transfers.routePanel.hint')}
                note={t('catalog.transfers.routePanel.note')}
                listLabel={t('catalog.transfers.routePanel.listLabel')}
                label={t('catalog.common.categoriesLabel', { title: sectionTitle })}
              />
            ) : (
              <CatalogCategoryTabs
                categories={categoryTabs}
                activeId={activeCategory}
                columns={section === 'activities' ? 3 : undefined}
                onChange={selectCategory}
                label={section === 'instructors' ? t('catalog.instructors.disciplinesLabel') : t('catalog.common.categoriesLabel', { title: sectionTitle })}
              />
            )}
            <FilterToolbar
              title={section === 'instructors' ? t('catalog.instructors.filtersTitle') : t('catalog.common.filtersTitle')}
              titleId="destination-list-title"
              ariaLabel={t('catalog.common.filtersAriaLabel', { title: sectionTitle })}
              resultCount={status === 'loading' ? '…' : displayedItems.length}
              resultLabel={displayedItems.length === 1 ? t(`catalog.${section}.countLabelOne`) : t(`catalog.${section}.countLabel`)}
              resultEyebrow={activeRoute && activeCategory !== 'all' ? t(fromGudauri ? 'catalog.transfers.routePanel.directionFrom' : 'catalog.transfers.routePanel.directionTo', { city: activeRoute.label }) : undefined}
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
                {displayedItems.map((item) => <DestinationCard item={directionalItem(item)} section={section} key={item.slug} />)}
                {showOtherRoutesCard ? (
                  <MoreResultsCard
                    eyebrow={t('catalog.transfers.otherRoutes.kicker')}
                    title={t(otherRoutesCount === 1 ? 'catalog.transfers.otherRoutes.titleOne' : 'catalog.transfers.otherRoutes.title', { count: otherRoutesCount })}
                    description={categoryTabs.filter((category) => category.id !== 'all' && category.id !== activeCategory).map((category) => category.label).join(' · ')}
                    actionLabel={t('catalog.transfers.categories.all.label')}
                    onAction={() => selectCategory('all')}
                  />
                ) : null}
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
