import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArticleBody, ArticleHeader, ArticleMedia, ArticleNotice, EditorialArticleTemplate, SiteFooter, SiteNavbar, Sources, TableOfContents } from '../../design-system';
import { ARTICLES } from '../../data/destinations';
import './ArticleDetailPage.scss';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const article = ARTICLES.find((item) => item.slug === slug);

  useEffect(() => {
    if (article) document.title = `${article.title} — My Gudauri`;
  }, [article]);

  if (!article) return <main className="destination-detail-state"><h1>Article not found</h1><Link to="/articles">Back to articles</Link></main>;

  const tocItems = article.sections.map((section, index) => ({ id: `article-section-${index}`, label: section.title }));

  return (
    <EditorialArticleTemplate
      navbar={<SiteNavbar className="destination-nav-host" />}
      header={<ArticleHeader backLink={{ to: '/articles', children: 'Back to articles' }} category={article.category} title={article.title} dek={article.excerpt} publishedAt={article.updated} readingTime={article.readTime} />}
      media={<ArticleMedia src={article.image} alt={article.title} />}
      tableOfContents={<TableOfContents items={tocItems} title="In this guide" />}
      notices={<ArticleNotice title="Good to know">{article.note}</ArticleNotice>}
      body={(
        <ArticleBody>
          <p className="article-lead">{article.lead}</p>
          {article.sections.map((section, index) => (
            <section id={`article-section-${index}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </ArticleBody>
      )}
      sources={<Sources items={article.sources.map((source) => ({ href: source.url, label: source.label }))} title="Sources & updates" />}
      footer={<SiteFooter />}
    />
  );
}
