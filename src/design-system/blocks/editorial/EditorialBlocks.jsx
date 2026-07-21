import { BackLink, Badge, EditorialCard, MediaPlaceholder, Notice, SectionHeading } from '../../../components';
import './EditorialBlocks.scss';

export function ArticleHeader({ backLink, category, title, dek, author, publishedAt, readingTime }) {
  return <header className="ds-article-header">{backLink ? <BackLink {...backLink} /> : null}<div>{category ? <Badge tone="neutral">{category}</Badge> : null}<SectionHeading headingLevel="h1" size="display" align="center" title={title} description={dek} /></div><dl>{author ? <div><dt>Author</dt><dd>{author}</dd></div> : null}{publishedAt ? <div><dt>Published</dt><dd>{publishedAt}</dd></div> : null}{readingTime ? <div><dt>Reading time</dt><dd>{readingTime}</dd></div> : null}</dl></header>;
}

export function ArticleMedia({ src, alt = '', caption, credit, aspect = 'wide' }) {
  return <figure className={`ds-article-media ds-article-media--${aspect}`}><div>{src ? <img src={src} alt={alt} /> : <MediaPlaceholder label={alt || 'Article media'} />}</div>{caption || credit ? <figcaption>{caption}{credit ? <small>{credit}</small> : null}</figcaption> : null}</figure>;
}

export function TableOfContents({ items = [], title = 'On this page' }) {
  return <nav className="ds-article-toc" aria-label={title}><h2>{title}</h2><ol>{items.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></nav>;
}

export function ArticleBody({ children }) {
  return <article className="ds-article-body">{children}</article>;
}

export function ArticleNotice({ title, children, tone = 'info' }) {
  return <Notice title={title} tone={tone}>{children}</Notice>;
}

export function Sources({ items = [], title = 'Sources' }) {
  return <section className="ds-article-sources"><h2>{title}</h2><ol>{items.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer">{item.label}<span className="visually-hidden"> (opens in a new tab)</span></a></li>)}</ol></section>;
}

export function RelatedArticles({ items = [], title = 'Keep reading' }) {
  return <section className="ds-related-articles"><SectionHeading title={title} size="sm" /><div>{items.map((item) => <EditorialCard item={item} key={item.slug} />)}</div></section>;
}
