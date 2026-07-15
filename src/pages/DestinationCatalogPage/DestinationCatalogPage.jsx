import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CatalogCategoryTabs } from '../../components/CatalogCategoryTabs/CatalogCategoryTabs';
import { DestinationCard } from '../../components/DestinationCard/DestinationCard';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { Container } from '../../components/UI/Container/Container';
import { getDestination } from '../../data/destinations';
import './DestinationCatalogPage.scss';

const CATALOG_FILTERS = {
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
  return items.map(([id, label, description, slugs]) => ({ id, label, description, slugs }));
}

export function DestinationCatalogPage() {
  const { section } = useParams();
  const config = getDestination(section);
  const filterConfig = CATALOG_FILTERS[section];
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
  }, [config]);

  const categories = useMemo(() => toFilter(filterConfig?.categories ?? []), [filterConfig]);
  const refinements = useMemo(() => toFilter(filterConfig?.refinements ?? []), [filterConfig]);
  const categoryItems = useMemo(() => {
    const category = categories.find((item) => item.id === activeCategory);
    if (!category?.slugs) return config?.items ?? [];
    return (config?.items ?? []).filter((item) => category.slugs.includes(item.slug));
  }, [activeCategory, categories, config]);
  const displayedItems = useMemo(() => categoryItems.filter((item) => activeFilters.every((filterId) => {
    const filter = refinements.find((entry) => entry.id === filterId);
    return !filter?.slugs || filter.slugs.includes(item.slug);
  })), [activeFilters, categoryItems, refinements]);
  const categoryTabs = useMemo(() => categories.map((category) => ({
    ...category,
    count: category.slugs ? (config?.items ?? []).filter((item) => category.slugs.includes(item.slug)).length : config?.items.length
  })), [categories, config]);

  if (!config) return <Navigate to="/" replace />;

  const toggleFilter = (filter) => {
    setActiveFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  };

  return (
    <div className={`destination-page destination-page--${config.accent}`}>
      <SiteNavbar className="destination-nav-host" />

      <main>
        <Container className="destination-shell">
          <section className="destination-hero" aria-labelledby="destination-title">
            <div className="destination-hero__copy">
              <p className="destination-eyebrow">{config.eyebrow}</p>
              <h1 id="destination-title">{config.title}</h1>
              <p className="destination-hero__description">{config.description}</p>
            </div>
            <section className="destination-promise" aria-label="Service promise">
              <div className="destination-promise__icon" aria-hidden="true">i</div>
              <div><strong>{config.promise}</strong><p>{config.promiseNote}</p></div>
              <span>{config.startingPrice}</span>
            </section>
          </section>

          <section className="destination-list" aria-labelledby="destination-list-title">
            <CatalogCategoryTabs
              categories={categoryTabs}
              activeId={activeCategory}
              onChange={(categoryId) => {
                setActiveCategory(categoryId);
                setActiveFilters([]);
              }}
              label={`${config.title} categories`}
            />
            <div className="destination-toolbar">
              <div>
                <p className="destination-eyebrow">Refine selection</p>
                <div className="destination-filters">
                  {refinements.map((filter) => (
                    <button className={activeFilters.includes(filter.id) ? 'is-active' : ''} type="button" aria-pressed={activeFilters.includes(filter.id)} onClick={() => toggleFilter(filter.id)} key={filter.id}>
                      {filter.label}<span aria-hidden="true">{activeFilters.includes(filter.id) ? '×' : '⌄'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="destination-toolbar__count">
                <h2 id="destination-list-title">Selected for you</h2>
                <p>{displayedItems.length} {config.countLabel}</p>
              </div>
            </div>

            {displayedItems.length ? (
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
            <div className="destination-section-heading">
              <p className="destination-eyebrow">Trust us</p>
              <h2 id="destination-benefits-title">{config.benefitsTitle}</h2>
            </div>
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
    </div>
  );
}
