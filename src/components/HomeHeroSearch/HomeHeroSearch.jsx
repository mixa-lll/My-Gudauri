import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FilterChip } from '../../design-system';
import { ARTICLES, DESTINATIONS } from '../../data/destinations';
import { useLanguage } from '../../i18n/LanguageContext';
import './HomeHeroSearch.scss';

function createSearchIndex(t) {
  const sectionLabel = (slug) => t(`categories.${slug}.title`);
  const sections = Object.values(DESTINATIONS).flatMap((section) => [
    {
      id: `section-${section.slug}`,
      title: sectionLabel(section.slug),
      detail: t(`catalog.${section.slug}.description`),
      type: t('search.sectionType'),
      to: `/${section.slug}`,
      keywords: [sectionLabel(section.slug), t(`catalog.${section.slug}.kicker`)]
    },
    ...section.items.map((item) => ({
      id: `${section.slug}-${item.slug}`,
      title: item.name,
      detail: `${sectionLabel(section.slug)} · ${item.category ?? item.description}`,
      type: sectionLabel(section.slug),
      to: `/${section.slug}/${item.slug}`,
      keywords: [
        item.name,
        item.category,
        item.description,
        ...(item.tags ?? []),
        ...(item.included ?? []),
        ...(item.sports ?? []).map((sport) => sport.name),
        ...(item.languages ?? []).map((language) => language.name)
      ].filter(Boolean)
    }))
  ]);

  return [
    ...sections,
    ...ARTICLES.map((article) => ({
      id: `article-${article.slug}`,
      title: article.title,
      detail: article.category,
      type: t('search.articleType'),
      to: `/articles/${article.slug}`,
      keywords: [article.title, article.category, article.excerpt]
    }))
  ];
}

function scoreResult(item, query) {
  const title = item.title.toLowerCase();
  const queryWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const text = [item.title, item.detail, ...item.keywords].join(' ').toLowerCase();

  if (!queryWords.every((word) => text.includes(word))) return -1;
  return queryWords.reduce((score, word) => score + (title.startsWith(word) ? 4 : title.includes(word) ? 2 : 1), 0);
}

export function HomeHeroSearch() {
  const navigate = useNavigate();
  const { language, t, tList } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const searchIndex = useMemo(() => createSearchIndex(t), [language, t]);

  const results = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return [];
    return searchIndex
      .map((item) => ({ item, score: scoreResult(item, normalized) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 6)
      .map(({ item }) => item);
  }, [query, searchIndex]);

  const updatePosition = () => {
    const rect = searchRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 10,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(180, window.innerHeight - rect.bottom - 22)
    });
  };

  useEffect(() => {
    if (!isOpen || !query.trim()) return undefined;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, query]);

  useEffect(() => {
    setActiveIndex(results.length ? 0 : -1);
  }, [query, results.length]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (searchRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const openResult = (result) => {
    if (!result) return;
    setIsOpen(false);
    navigate(result.to);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.focus();
      return;
    }
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      return;
    }
    if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter' && results.length) {
      event.preventDefault();
      openResult(results[activeIndex] ?? results[0]);
    }
  };

  const shouldShowPanel = isOpen && query.trim() && position;

  return (
    <div className="home-hero-search" ref={searchRef}>
      <label className="home-hero-search__label" htmlFor="home-global-search">{t('search.label')}</label>
      <div className="home-hero-search__field">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
        <input
          id="home-global-search"
          ref={inputRef}
          value={query}
          type="search"
          autoComplete="off"
          placeholder={t('search.placeholder')}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={Boolean(shouldShowPanel)}
          aria-controls="home-global-search-results"
          aria-activedescendant={activeIndex >= 0 ? `home-search-result-${activeIndex}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label={t('search.clear')}>×</button>}
        <kbd>⌘ K</kbd>
      </div>
      <div className="home-hero-search__quick" aria-label={t('search.popular')}>
        {tList('search.quick').map((suggestion) => (
          <FilterChip
            size="sm"
            type="button"
            onClick={() => { setQuery(suggestion); setIsOpen(true); inputRef.current?.focus(); }}
            key={suggestion}
          >
            {suggestion}
          </FilterChip>
        ))}
      </div>

      {shouldShowPanel && createPortal(
        <section className="home-search-results" ref={panelRef} id="home-global-search-results" role="listbox" aria-label={t('search.resultsLabel')} style={position}>
          {results.length ? (
            <>
              <p>{t('search.matching')}</p>
              {results.map((result, index) => (
                <Link
                  className={index === activeIndex ? 'is-active' : ''}
                  id={`home-search-result-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  to={result.to}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setIsOpen(false)}
                  key={result.id}
                >
                  <span><strong>{result.title}</strong><small>{result.detail}</small></span>
                  <em>{result.type}</em>
                </Link>
              ))}
            </>
          ) : (
            <div className="home-search-results__empty"><strong>{t('search.emptyTitle')}</strong><span>{t('search.emptyHint')}</span></div>
          )}
        </section>,
        document.body
      )}
    </div>
  );
}
