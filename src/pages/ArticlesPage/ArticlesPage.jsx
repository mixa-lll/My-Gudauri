import { useEffect, useMemo, useState } from 'react';
import { CatalogCategoryTabs, CatalogHero, Container, EditorialCard, ListingCardGrid, SiteFooter, SiteNavbar } from '../../design-system';
import { ARTICLES } from '../../data/destinations';
import './ArticlesPage.scss';

const ARTICLE_CATEGORIES = [
  { id: 'all', label: 'All guides', description: 'Plan every part of your trip', matches: () => true },
  { id: 'planning', label: 'Planning', description: 'First trip and family advice', matches: (article) => ['first-time-gudauri', 'family-mountain-week'].includes(article.slug) },
  { id: 'mountain', label: 'On the mountain', description: 'Slopes, snow and safety', matches: (article) => ['ski-areas-explained', 'freeride-safety'].includes(article.slug) },
  { id: 'local', label: 'Getting around & local', description: 'Roads, food and places', matches: (article) => ['snow-road-guide', 'where-to-eat'].includes(article.slug) }
];

export function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.title = 'Articles — My Gudauri';
  }, []);

  const categoryTabs = useMemo(() => ARTICLE_CATEGORIES.map((category) => ({
    ...category,
    count: ARTICLES.filter(category.matches).length
  })), []);
  const filteredArticles = useMemo(() => {
    const category = ARTICLE_CATEGORIES.find((item) => item.id === activeCategory) ?? ARTICLE_CATEGORIES[0];
    return ARTICLES.filter(category.matches);
  }, [activeCategory]);
  const [featured, ...articles] = filteredArticles;

  return (
    <div className="articles-page">
      <SiteNavbar className="destination-nav-host" />
      <main>
        <Container width="wide">
          <CatalogHero
            align="start"
            kicker="Local knowledge"
            title="Articles"
            description="Practical guides for a smoother mountain trip — written with local experts and updated for the season."
          />

          <CatalogCategoryTabs
            className="articles-category-tabs"
            categories={categoryTabs}
            activeId={activeCategory}
            onChange={setActiveCategory}
            label="Article topics"
          />

          <EditorialCard
            className="featured-article"
            item={featured}
            layout="featured"
            headingLevel={2}
            loading="eager"
          />

          <section className="articles-list" aria-labelledby="latest-articles-title">
            <div className="articles-list__heading"><h2 id="latest-articles-title">Latest guides</h2><span>{filteredArticles.length} articles</span></div>
            <ListingCardGrid className="articles-grid" columns={3}>
              {articles.map((article) => (
                <EditorialCard item={article} key={article.slug} />
              ))}
            </ListingCardGrid>
          </section>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
