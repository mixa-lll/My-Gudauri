import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import './CatalogRoutePanel.scss';

const ROUTE_HINT_KEY = 'myGudauriRouteHintSeen';

/*
 * Route panel for single-anchor catalogs (transfers). Every route shares one
 * fixed endpoint, so instead of a free from/to search the panel pins the
 * anchor and lets the visitor pick the other endpoint from a short list.
 * Direction is presentational: swapping never changes the result set or the
 * price — it is carried into the request so the booking knows the way.
 * The panel is a presentational alternative to CatalogCategoryTabs: options
 * are the same category filters and selection drives the same active-category
 * state.
 */

function ChevronIcon() {
  return <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.25 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 12 10" aria-hidden="true"><path d="m1 5 3 3 7-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function SwapIcon() {
  return <svg viewBox="0 0 20 14" aria-hidden="true"><path d="M4.5 1 1.5 4l3 3M1.5 4h13M15.5 7l3 3-3 3M18.5 10h-13" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg>;
}

export function RouteOption({ option, active = false, onSelect }) {
  return (
    <button className={`catalog-route-option ${active ? 'is-active' : ''}`.trim()} type="button" aria-pressed={active} onClick={() => onSelect(option.id)}>
      <span><strong>{option.label}</strong>{option.description ? <small>{option.description}</small> : null}</span>
      {typeof option.count === 'number' ? <b aria-label={`${option.count} results`}>{option.count}</b> : null}
      {active ? <span className="catalog-route-option__check"><CheckIcon /></span> : null}
    </button>
  );
}

export function CatalogRoutePanel({
  options,
  activeId,
  onChange,
  anchor,
  direction = 'to-anchor',
  onDirectionChange,
  fromLabel = 'From',
  toLabel = 'To',
  swapLabel = 'Swap direction',
  kicker,
  hint,
  note,
  listLabel = 'Choose a destination',
  spotlight = false,
  spotlightHint,
  spotlightDismissLabel = 'Got it',
  defaultOpen = false,
  label = 'Choose your route',
  className = ''
}) {
  if (!['to-anchor', 'from-anchor'].includes(direction)) throw new Error(`CatalogRoutePanel: unknown direction “${direction}”.`);
  const [open, setOpen] = useState(defaultOpen);
  // Visitors were landing on the catalog without seeing where to start, so the
  // city field leads until it is used. The nudge is dismissed for good on the
  // first interaction — a hint that keeps reappearing becomes noise.
  const [hintDismissed, setHintDismissed] = useState(() => globalThis.localStorage?.getItem(ROUTE_HINT_KEY) === 'seen');
  const dismissHint = () => {
    setHintDismissed(true);
    globalThis.localStorage?.setItem(ROUTE_HINT_KEY, 'seen');
  };
  const showHint = spotlight && Boolean(spotlightHint) && !hintDismissed && !open;
  const active = options.find((option) => option.id === activeId) ?? options[0];
  const anchorFirst = direction === 'from-anchor';

  const selectOption = (optionId) => {
    onChange(optionId);
    setOpen(false);
    dismissHint();
  };

  const anchorEndpoint = (
    <div className="catalog-route-panel__endpoint catalog-route-panel__endpoint--anchor" key="anchor">
      <small>{anchorFirst ? fromLabel : toLabel}</small>
      <span className="catalog-route-panel__place"><strong>{anchor.title}</strong>{anchor.meta ? <small>{anchor.meta}</small> : null}</span>
    </div>
  );

  const cityEndpoint = (
    <div className={`catalog-route-panel__city${showHint ? ' has-hint' : ''}`} key="city">
    <Popover.Root open={open} onOpenChange={(next) => { setOpen(next); if (next) dismissHint(); }}>
      <Popover.Trigger asChild>
        <button className={`catalog-route-panel__endpoint catalog-route-panel__endpoint--city${showHint ? ' is-spotlit' : ''}`} type="button" aria-label={listLabel}>
          <small>{anchorFirst ? toLabel : fromLabel}</small>
          <span className="catalog-route-panel__value">
            <span className="catalog-route-panel__place"><strong>{active?.label}</strong>{active?.meta ? <small>{active.meta}</small> : null}</span>
            <span className="catalog-route-panel__chevron"><ChevronIcon /></span>
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="catalog-route-panel__list" align={anchorFirst ? 'end' : 'start'} sideOffset={12} collisionPadding={12} aria-label={listLabel}>
          {options.map((option, index) => (
            <div className="catalog-route-panel__list-item" key={option.id}>
              <RouteOption option={option} active={activeId === option.id} onSelect={selectOption} />
              {index === 0 && options.length > 1 ? <span className="catalog-route-panel__divider" aria-hidden="true" /> : null}
            </div>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    {showHint ? (
      <p className="catalog-route-panel__hint-bubble" role="note">
        <span>{spotlightHint}</span>
        <button type="button" onClick={dismissHint}>{spotlightDismissLabel}</button>
      </p>
    ) : null}
    </div>
  );

  const swapControl = onDirectionChange ? (
    <button
      className="catalog-route-panel__swap"
      type="button"
      aria-label={swapLabel}
      title={swapLabel}
      onClick={() => onDirectionChange(direction === 'to-anchor' ? 'from-anchor' : 'to-anchor')}
      key="swap"
    >
      <SwapIcon />
    </button>
  ) : (
    <span className="catalog-route-panel__arrow" aria-hidden="true" key="swap">↔</span>
  );

  const endpoints = anchorFirst ? [anchorEndpoint, swapControl, cityEndpoint] : [cityEndpoint, swapControl, anchorEndpoint];

  return (
    <section className={`catalog-route-panel ${className}`.trim()} aria-label={label}>
      {kicker || hint ? (
        <div className="catalog-route-panel__heading">
          {kicker ? <p className="catalog-route-panel__kicker">{kicker}</p> : null}
          {hint ? <p>{hint}</p> : null}
        </div>
      ) : null}

      <div className="catalog-route-panel__board">{endpoints}</div>

      {note ? <p className="catalog-route-panel__note">{note}</p> : null}
    </section>
  );
}
