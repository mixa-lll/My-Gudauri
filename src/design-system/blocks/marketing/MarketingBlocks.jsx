import { Button, Input, SectionHeading } from '../../../components';
import './MarketingBlocks.scss';

export function ContentPageHero({ kicker, title, description, media, status, actions, titleId, className = '' }) {
  return (
    <section className={`ds-content-page-hero ${media ? 'ds-content-page-hero--with-media' : 'ds-content-page-hero--without-media'} ${className}`.trim()}>
      <div className="ds-content-page-hero__frame">
        <SectionHeading
          className="ds-content-page-hero__heading"
          headingLevel="h1"
          size="display"
          kicker={kicker}
          title={title}
          titleId={titleId}
          description={description}
          actions={actions}
        />
        {status ? <div className="ds-content-page-hero__status">{status}</div> : null}
      </div>
      {media ? <div className="ds-content-page-hero__media">{media}</div> : null}
    </section>
  );
}

export function SearchHero({ kicker, title, description, query, onQueryChange, onSubmit, placeholder = 'Search Gudauri', suggestions = [], state = 'idle' }) {
  return <section className="ds-search-hero"><SectionHeading headingLevel="h1" kicker={kicker} title={title} description={description} align="center" /><form role="search" onSubmit={(event) => { event.preventDefault(); onSubmit?.(query); }}><label className="visually-hidden" htmlFor="ds-search-hero-input">Search</label><Input id="ds-search-hero-input" value={query} onChange={(event) => onQueryChange?.(event.target.value)} placeholder={placeholder} loading={state === 'loading'} /><Button type="submit">Search</Button></form>{suggestions.length ? <div className="ds-search-hero__suggestions" aria-label="Suggested searches">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => onQueryChange?.(suggestion)}>{suggestion}</button>)}</div> : null}{state === 'empty' ? <p role="status">No suggestions found. Try a broader search.</p> : null}</section>;
}
