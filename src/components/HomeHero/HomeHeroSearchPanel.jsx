import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { getActivities } from '../../services/activitiesApi';
import { getInstructors } from '../../services/instructorsApi';
import { cn } from '../../utils/cn';
import {
  HERO_SECTIONS,
  buildCatalogUrl,
  countMatches,
  dynamicOptionLabel,
  dynamicOptions,
  getStaticSectionItems,
  toFilter
} from './heroSearchConfig';
import './HomeHeroSearchPanel.scss';

const OPTION_ICONS = {
  ski: '/assets/design-2/icon-ski.png',
  snowboard: '/assets/design-2/icon-snow.png'
};

const SECTION_LOADERS = {
  instructors: getInstructors,
  activities: getActivities
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="hero-search__glass">
      <path d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
    </svg>
  );
}

function CaretIcon({ open = false }) {
  return <img className={cn('hero-search__caret', open && 'is-open')} src="/assets/navbar/caret-down.png" alt="" aria-hidden="true" />;
}

const CAROUSEL_QUERY = '(max-width: 820px)';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches));

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/* Narrow screens turn the tab row into a picker: the selected pill stays put in
   the middle and the labels travel under it. Measuring is the only way to place
   them — the labels are translated words of very different widths. */
function useTabCarousel(activeSlug, enabled) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [layout, setLayout] = useState({ offset: 0, pillWidth: 0 });

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const active = trackRef.current?.querySelector('.hero-search__tab.is-active');
    if (!enabled || !viewport || !active) {
      setLayout({ offset: 0, pillWidth: 0 });
      return;
    }

    /* offsetLeft is measured against the track, which is the transformed
       element, so it is the label's position before the slide — that makes this
       safe to re-run at any time, including mid-transition. */
    const centre = viewport.clientWidth / 2;
    setLayout({
      offset: Math.round(centre - (active.offsetLeft + active.offsetWidth / 2)),
      pillWidth: Math.round(active.offsetWidth)
    });
  }, [enabled]);

  useLayoutEffect(() => {
    measure();
    // The first pass can land before the panel has its final width, which put
    // the labels off-centre; re-read once layout has settled.
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [measure, activeSlug]);

  useEffect(() => {
    if (!enabled) return undefined;
    // Fonts and translations settle after mount, and both change label widths.
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    // The panel animates in, so its width is still settling for a few frames
    // after mount; a late pass guarantees the final numbers.
    const settled = setTimeout(measure, 400);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      clearTimeout(settled);
      observer.disconnect();
    };
  }, [enabled, measure]);

  return { viewportRef, trackRef, ...layout };
}

export function HomeHeroSearchPanel({ className }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeSlug, setActiveSlug] = useState(HERO_SECTIONS[0].slug);
  const [selection, setSelection] = useState({});
  const [itemsBySection, setItemsBySection] = useState(() => ({
    instructors: getStaticSectionItems('instructors'),
    activities: getStaticSectionItems('activities')
  }));
  const [openField, setOpenField] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const loadedRef = useRef({});
  const isCarousel = useMediaQuery(CAROUSEL_QUERY);
  const carousel = useTabCarousel(activeSlug, isCarousel);

  const section = HERO_SECTIONS.find((entry) => entry.slug === activeSlug);
  const items = itemsBySection[activeSlug] ?? getStaticSectionItems(activeSlug);
  const sectionSelection = selection[activeSlug] ?? {};

  useEffect(() => {
    const loader = SECTION_LOADERS[activeSlug];
    if (!loader || loadedRef.current[activeSlug]) return undefined;
    loadedRef.current[activeSlug] = true;
    let active = true;
    loader()
      .then((loaded) => {
        if (active && Array.isArray(loaded)) setItemsBySection((current) => ({ ...current, [activeSlug]: loaded }));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [activeSlug]);

  const fields = useMemo(() => section.fields.map((field) => ({
    ...field,
    options: field.kind === 'dynamic' ? dynamicOptions(items, field.field) : field.options
  })), [items, section]);

  const optionLabel = (field, optionId) => {
    if (!optionId) return field.id === 'who' || field.id === 'audience' ? t('home.hero.anyone') : t('home.hero.any');
    if (field.kind === 'dynamic') return dynamicOptionLabel(field.field, optionId);
    if (field.kind === 'category') return t(`catalog.${activeSlug}.categories.${optionId}.label`);
    return t(`catalog.${activeSlug}.refinements.${optionId}`);
  };

  const appliedFilters = fields.map((field) => toFilter(activeSlug, field, sectionSelection[field.id]));
  const showCount = countMatches(activeSlug, items, appliedFilters);
  const hasSelection = fields.some((field) => sectionSelection[field.id]);
  const countLabel = (count) => t(`catalog.${activeSlug}.${count === 1 ? 'countLabelOne' : 'countLabel'}`);

  const optionCount = (field, optionId) => {
    const others = fields.filter((entry) => entry.id !== field.id).map((entry) => toFilter(activeSlug, entry, sectionSelection[entry.id]));
    return countMatches(activeSlug, items, [...others, toFilter(activeSlug, field, optionId)]);
  };

  const chips = useMemo(() => section.chips.flatMap((chip) => {
    if (chip.dynamicField) {
      const field = { kind: 'dynamic', field: chip.dynamicField, category: true };
      return dynamicOptions(items, chip.dynamicField).slice(0, chip.limit ?? 4).map((value) => ({
        key: `${chip.dynamicField}:${value}`,
        label: dynamicOptionLabel(chip.dynamicField, value),
        count: countMatches(activeSlug, items, [toFilter(activeSlug, field, value)]),
        to: buildCatalogUrl(activeSlug, [[field, value]])
      }));
    }
    const field = { kind: chip.kind };
    return [{
      key: chip.id,
      label: chip.kind === 'category' ? t(`catalog.${activeSlug}.categories.${chip.id}.label`) : t(`catalog.${activeSlug}.refinements.${chip.id}`),
      count: countMatches(activeSlug, items, [toFilter(activeSlug, { kind: chip.kind }, chip.id)]),
      to: buildCatalogUrl(activeSlug, [[field, chip.id]])
    }];
  }).filter((chip) => chip.count > 0), [activeSlug, items, section, t]);

  const selectOption = (field, optionId) => {
    setSelection((current) => ({
      ...current,
      [activeSlug]: { ...(current[activeSlug] ?? {}), [field.id]: optionId }
    }));
    setOpenField(null);
  };

  const clearSection = () => {
    setSelection((current) => ({ ...current, [activeSlug]: {} }));
  };

  const submit = () => {
    setSheetOpen(false);
    navigate(buildCatalogUrl(activeSlug, fields.map((field) => [field, sectionSelection[field.id]])));
  };

  const summaryText = fields.map((field) => optionLabel(field, sectionSelection[field.id])).join(' · ');
  const sectionTitle = t(`categories.${activeSlug}.title`);

  const renderOptionList = (field) => (
    <div className="hero-search__option-list" role="listbox" aria-label={t(field.labelKey)}>
      {[null, ...field.options].map((optionId) => {
        const selected = (sectionSelection[field.id] ?? null) === optionId;
        return (
          <button
            className={cn('hero-search__option', selected && 'is-selected')}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => selectOption(field, optionId)}
            key={optionId ?? 'any'}
          >
            <span className="hero-search__option-name">
              {optionId && OPTION_ICONS[optionId] && (field.id === 'discipline' || field.id === 'equipment')
                ? <img src={OPTION_ICONS[optionId]} alt="" aria-hidden="true" />
                : null}
              {optionLabel(field, optionId)}
            </span>
            <span className="hero-search__option-count">{optionCount(field, optionId)}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={cn('hero-search', className)} role="search" aria-label={t('home.hero.searchLabel')}>
      <div
        className={cn('hero-search__tabs', isCarousel && 'hero-search__tabs--carousel')}
        role="tablist"
        aria-label={t('home.hero.categoriesLabel')}
        ref={carousel.viewportRef}
      >
        {isCarousel ? (
          <span className="hero-search__tab-pill" style={{ width: carousel.pillWidth || undefined }} aria-hidden="true" />
        ) : null}
        <div
          className="hero-search__tabs-track"
          ref={carousel.trackRef}
          style={isCarousel ? { transform: `translate3d(${carousel.offset}px, 0, 0)` } : undefined}
        >
          {HERO_SECTIONS.map((entry) => {
            const active = entry.slug === activeSlug;
            return (
              <button
                className={cn('hero-search__tab', active && 'is-active')}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveSlug(entry.slug);
                  setOpenField(null);
                }}
                key={entry.slug}
              >
                {active ? <img src={entry.icon} alt="" aria-hidden="true" /> : null}
                {t(`categories.${entry.slug}.title`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hero-search__bar hero-search__bar--desktop">
        {fields.map((field, index) => (
          <div className="hero-search__cell" key={field.id}>
            {index > 0 ? <span className="hero-search__divider" aria-hidden="true" /> : null}
            <Popover.Root open={openField === field.id} onOpenChange={(open) => setOpenField(open ? field.id : null)}>
              <Popover.Trigger asChild>
                <button className={cn('hero-search__field', openField === field.id && 'is-open')} type="button">
                  <span className="hero-search__field-label">{t(field.labelKey)}</span>
                  <span className={cn('hero-search__field-value', !sectionSelection[field.id] && 'is-placeholder')}>
                    {optionLabel(field, sectionSelection[field.id])}
                    <CaretIcon open={openField === field.id} />
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="hero-search__popover"
                  align="start"
                  sideOffset={12}
                  collisionPadding={16}
                  onOpenAutoFocus={(event) => {
                    // The default focus scrolls the page to the portal node
                    // before the popper positions it. Focus the active option
                    // ourselves without scrolling.
                    event.preventDefault();
                    window.setTimeout(() => {
                      const option = document.querySelector('.hero-search__popover .hero-search__option.is-selected')
                        ?? document.querySelector('.hero-search__popover .hero-search__option');
                      option?.focus({ preventScroll: true });
                    }, 0);
                  }}
                >
                  <div className="hero-search__popover-head">
                    <span>{t(field.labelKey)} · {t('home.hero.pickOne')}</span>
                    <button type="button" onClick={() => selectOption(field, null)}>{t('home.hero.clear')}</button>
                  </div>
                  {renderOptionList(field)}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        ))}
        <button className="hero-search__submit" type="button" onClick={submit}>
          <SearchIcon />
          {t('home.hero.show', { count: showCount })}
        </button>
      </div>

      <div className="hero-search__bar hero-search__bar--mobile">
        <button className="hero-search__summary" type="button" onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
          <span className="hero-search__summary-copy">
            <span className="hero-search__field-label">{sectionTitle}</span>
            <span className="hero-search__summary-value">{summaryText}</span>
          </span>
          <CaretIcon />
        </button>
        <button className="hero-search__submit hero-search__submit--wide" type="button" onClick={submit}>
          <SearchIcon />
          {t('home.hero.show', { count: showCount })}
        </button>
      </div>

      <div className="hero-search__footer">
        <div className="hero-search__chips" aria-label={t('home.hero.chipsLabel')}>
          {chips.map((chip) => (
            <Link className="hero-search__chip" to={chip.to} key={chip.key}>
              {chip.label} · {chip.count}
            </Link>
          ))}
        </div>
        <Link className="hero-search__all" to={`/${activeSlug}`}>
          {t('home.hero.allLink', { count: items.length, items: countLabel(items.length) })} ↗
        </Link>
      </div>

      <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="hero-search-sheet__overlay" />
          <Dialog.Content className="hero-search-sheet" aria-describedby={undefined}>
            <span className="hero-search-sheet__handle" aria-hidden="true" />
            <div className="hero-search-sheet__head">
              <Dialog.Title className="hero-search-sheet__title">{sectionTitle}</Dialog.Title>
              <span className="hero-search-sheet__count">{items.length} {countLabel(items.length)}</span>
            </div>
            <div className="hero-search-sheet__groups">
              {fields.map((field) => (
                <div className="hero-search-sheet__group" key={field.id}>
                  <span className="hero-search__field-label">{t(field.labelKey)}</span>
                  <div className="hero-search-sheet__options" role="listbox" aria-label={t(field.labelKey)}>
                    {[null, ...field.options].map((optionId) => {
                      const selected = (sectionSelection[field.id] ?? null) === optionId;
                      return (
                        <button
                          className={cn('hero-search-sheet__option', selected && 'is-selected')}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => setSelection((current) => ({
                            ...current,
                            [activeSlug]: { ...(current[activeSlug] ?? {}), [field.id]: optionId }
                          }))}
                          key={optionId ?? 'any'}
                        >
                          {optionId && OPTION_ICONS[optionId] && (field.id === 'discipline' || field.id === 'equipment')
                            ? <img src={OPTION_ICONS[optionId]} alt="" aria-hidden="true" />
                            : null}
                          {optionLabel(field, optionId)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-search-sheet__actions">
              <button className="hero-search-sheet__clear" type="button" onClick={clearSection} disabled={!hasSelection}>
                {t('home.hero.clear')}
              </button>
              <button className="hero-search__submit hero-search__submit--wide" type="button" onClick={submit}>
                {t('home.hero.showItems', { count: showCount, items: countLabel(showCount) })}
              </button>
            </div>
            <p className="hero-search-sheet__note">{t('home.hero.note')}</p>
            <Dialog.Close className="hero-search-sheet__close" aria-label={t('home.hero.closeFilters')}>×</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
