import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { MediaPlaceholder } from '../../components/MediaPlaceholder/MediaPlaceholder';
import { Container } from '../../components/UI/Container/Container';
import { ARTICLES } from '../../data/destinations';
import './ArticleDetailPage.scss';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const article = ARTICLES.find((item) => item.slug === slug);

  useEffect(() => {
    if (article) document.title = `${article.title} — My Gudauri`;
  }, [article]);

  if (!article) return <main className="destination-detail-state"><h1>Article not found</h1><Link to="/articles">Back to articles</Link></main>;

  return (
    <div className="article-page">
      <SiteNavbar className="destination-nav-host" />
      <main>
        <Container className="article-shell">
          <Link className="destination-detail__back" to="/articles">← Back to articles</Link>
          <header className="article-hero">
            <span>{article.category} · {article.readTime} · {article.updated}</span>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
          </header>
          <MediaPlaceholder className="article-cover" label={article.title} />
          <div className="article-layout">
            <aside>
              <span>In this guide</span>
              {article.sections.map((section, index) => <a href={`#article-section-${index}`} key={section.title}>{section.title}</a>)}
              <a href="#article-sources">Sources & updates</a>
            </aside>
            <article>
              <p className="article-lead">{article.lead}</p>
              {article.sections.map((section, index) => (
                <section id={`article-section-${index}`} key={section.title}>
                  <span>0{index + 1}</span>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
              <div className="article-note"><strong>Good to know</strong><p>{article.note}</p></div>
              <section className="article-sources" id="article-sources">
                <span>Reference</span>
                <h2>Sources & updates</h2>
                <p>This guide is original editorial content based on the public sources below. Operational details can change; always verify live conditions before travel.</p>
                <ul>
                  {article.sources.map((source) => (
                    <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>
                  ))}
                </ul>
              </section>
            </article>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
