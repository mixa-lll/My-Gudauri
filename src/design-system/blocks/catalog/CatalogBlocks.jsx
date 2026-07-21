import { useId } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { ActivityCard, CatalogCategoryTabs, EditorialCard, InstructorCard, ListingCardGrid, RentalCard, StayCard, TransferCard, Badge, Button, EmptyState, ErrorState, LoadingState, SectionHeading, Surface } from '../../../components';
import './CatalogBlocks.scss';

export function CatalogHero({ kicker, title, description, align = 'center', titleId }) {
  if (!['start', 'center'].includes(align)) throw new Error(`CatalogHero: unknown alignment “${align}”.`);
  return <section className={`ds-catalog-hero ds-catalog-hero--${align}`}><div className="ds-catalog-hero__content"><SectionHeading headingLevel="h1" size="display" align={align} kicker={kicker} title={title} titleId={titleId} description={description} /></div></section>;
}

export function CategoryTabs(props) { return <CatalogCategoryTabs {...props} />; }

function CheckIcon() {
  return <svg viewBox="0 0 12 10" aria-hidden="true"><path d="m1 5 3 3 7-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function ChevronIcon() {
  return <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.25 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function FilterControl({ id, label, options = [], selectedValues = [], onToggle, onClear, disabled = false }) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const selectedCount = options.filter((option) => selectedValues.includes(option.id)).length;

  return <Popover.Root>
    <Popover.Trigger asChild>
      <button className={`ds-filter-control ${selectedCount ? 'is-active' : ''}`.trim()} type="button" disabled={disabled}>
        <span>{label}</span>{selectedCount ? <strong aria-label={`${selectedCount} selected`}>{selectedCount}</strong> : null}<span className="ds-filter-control__chevron"><ChevronIcon /></span>
      </button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className="ds-filter-popover" align="start" sideOffset={9} collisionPadding={12}>
        <div className="ds-filter-popover__header"><div><span>Filter by</span><strong>{label}</strong></div>{selectedCount ? <button type="button" onClick={() => onClear?.(options.map((option) => option.id))}>Clear</button> : null}</div>
        <div className="ds-filter-popover__options">
          {options.map((option) => {
            const checked = selectedValues.includes(option.id);
            const optionId = `${controlId}-${option.id}`;
            return <div className={`ds-filter-option ${checked ? 'is-checked' : ''}`.trim()} key={option.id}><label htmlFor={optionId}>{option.label}</label><Checkbox.Root id={optionId} checked={checked} onCheckedChange={() => onToggle?.(option.id)} aria-label={option.label}><Checkbox.Indicator><CheckIcon /></Checkbox.Indicator></Checkbox.Root></div>;
          })}
        </div>
        <Popover.Arrow className="ds-filter-popover__arrow" width={14} height={7} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
}

export function ResultCount({ count, label = 'results', eyebrow = 'Selected for you' }) {
  return <div className="ds-result-count" aria-live="polite"><span>{eyebrow}</span><p><strong>{count}</strong> {label}</p></div>;
}

export function FilterToolbar({ kicker = 'Selection options', title = 'Refine results', controls, resultCount, resultLabel = 'results', resultEyebrow = 'Selected for you', actions, ariaLabel = 'Catalog filters', titleId }) {
  return <section className="ds-filter-toolbar" aria-label={ariaLabel}><div className="ds-filter-toolbar__main"><SectionHeading size="sm" kicker={kicker} title={title} titleId={titleId} /><div className="ds-filter-toolbar__controls">{controls}{actions ? <div className="ds-filter-toolbar__actions">{actions}</div> : null}</div></div><ResultCount count={resultCount} label={resultLabel} eyebrow={resultEyebrow} /></section>;
}

const CARD_TYPES = { activity: ActivityCard, instructor: InstructorCard, rental: RentalCard, stay: StayCard, transfer: TransferCard, editorial: EditorialCard };

export function ListingGrid({ items = [], cardType = 'activity', columns = 'auto', state = 'ready', emptyAction, onRetry, ariaLabel = 'Catalog results' }) {
  if (state === 'loading') return <LoadingState title="Loading results" description="The catalog will update as soon as the data is ready." />;
  if (state === 'error') return <ErrorState title="Results are unavailable" description="Check your connection and try again." action={<Button variant="secondary" onClick={onRetry}>Try again</Button>} />;
  if (!items.length) return <EmptyState title="No matching results" description="Try removing one or more filters." action={emptyAction} />;
  const Card = CARD_TYPES[cardType];
  if (!Card) throw new Error(`ListingGrid: unregistered card type “${cardType}”.`);
  return <ListingCardGrid className="ds-listing-grid" columns={columns} ariaLabel={ariaLabel}>{items.map((item) => <Card item={item} key={item.slug} />)}</ListingCardGrid>;
}

export function BenefitCard({ icon, title, description }) {
  return <Surface className="ds-benefit-card"><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{description}</p></Surface>;
}

export function BenefitsSection({ kicker = 'Why book here', title, description, items = [] }) {
  return <section className="ds-section"><SectionHeading kicker={kicker} title={title} description={description} size="md" /><div className="ds-benefits-grid">{items.map((item) => <BenefitCard key={item.title} {...item} />)}</div></section>;
}

export function BookingStep({ number, title, description, context = 'catalog' }) {
  return <article className={`ds-booking-step ds-booking-step--${context}`}><Badge tone="inverse">{number}</Badge><h3>{title}</h3><p>{description}</p></article>;
}

export function BookingSteps({ id, kicker = 'Simple and clear', title = 'How booking works', description, items = [], context = 'catalog' }) {
  if (!['catalog', 'object'].includes(context)) throw new Error(`BookingSteps: unsupported context “${context}”.`);
  return <section id={id ?? (context === 'object' ? 'booking-process' : undefined)} className={`ds-section ds-booking-steps-section ds-booking-steps-section--${context}`}><SectionHeading kicker={kicker} title={title} description={description} size={context === 'object' ? 'sm' : 'md'} /><ol className={`ds-booking-steps ds-booking-steps--${context}`}>{items.map((item, index) => <li key={item.title}><BookingStep number={index + 1} context={context} {...item} /></li>)}</ol></section>;
}

function PromoFrame({ kind, eyebrow, title, description, media, action }) {
  return <Surface className={`ds-promo ds-promo--${kind}`} padding="lg"><div>{eyebrow ? <Badge tone={kind === 'safety' ? 'warning' : 'accent'}>{eyebrow}</Badge> : null}<h2>{title}</h2>{description ? <p>{description}</p> : null}{action ? <div className="ds-promo__action">{action}</div> : null}</div>{media ? <div className="ds-promo__media">{media}</div> : null}</Surface>;
}

export const SplitPromo = (props) => <PromoFrame kind="split" {...props} />;
export const RateBanner = (props) => <PromoFrame kind="rate" eyebrow={props.eyebrow ?? 'Current rate'} {...props} />;
export const SafetyNotice = (props) => <PromoFrame kind="safety" eyebrow={props.eyebrow ?? 'Safety'} {...props} />;
export const SelectionCTA = (props) => <PromoFrame kind="selection" {...props} />;
export const ConditionsBanner = (props) => <PromoFrame kind="conditions" {...props} />;

export const PROMO_TYPES = { split: SplitPromo, rate: RateBanner, safety: SafetyNotice, selection: SelectionCTA, conditions: ConditionsBanner };

export function PromoArea({ promo }) {
  if (!promo) return null;
  const Promo = PROMO_TYPES[promo.type];
  if (!Promo) throw new Error(`PromoArea: unregistered promo type “${promo.type}”.`);
  return <aside className="ds-promo-area" aria-label="Featured information"><Promo {...promo} /></aside>;
}
