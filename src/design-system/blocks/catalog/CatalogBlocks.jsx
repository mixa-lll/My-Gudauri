import { ActivityCard, CatalogCategoryTabs, EditorialCard, FaqAccordion, InstructorCard, RentalCard, TransferCard, Badge, Button, EmptyState, ErrorState, LoadingState, SectionHeading, Surface } from '../../../components';
import './CatalogBlocks.scss';

export function CatalogHero({ kicker, title, description, media, actions, breadcrumbs, align = 'center', titleId }) {
  if (!['start', 'center'].includes(align)) throw new Error(`CatalogHero: unknown alignment “${align}”.`);
  return <section className={`ds-catalog-hero ds-catalog-hero--${align} ${media ? 'ds-catalog-hero--with-media' : 'ds-catalog-hero--without-media'}`}>{breadcrumbs}<div className="ds-catalog-hero__content"><SectionHeading headingLevel="h1" size="display" align={align} kicker={kicker} title={title} titleId={titleId} description={description} actions={actions} /></div>{media ? <div className="ds-catalog-hero__media">{media}</div> : null}</section>;
}

export function CategoryTabs(props) { return <CatalogCategoryTabs {...props} />; }
export function FAQSection(props) { return <FaqAccordion {...props} />; }

export function FilterControl({ label, value, options, onChange, disabled = false }) {
  return <label className="ds-filter-control"><span>{label}</span><select value={value} onChange={(event) => onChange?.(event.target.value)} disabled={disabled}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export function ResultCount({ count, label = 'results' }) {
  return <p className="ds-result-count" aria-live="polite"><strong>{count}</strong> {label}</p>;
}

export function FilterToolbar({ controls, resultCount, actions }) {
  return <section className="ds-filter-toolbar" aria-label="Catalog filters"><div className="ds-filter-toolbar__controls">{controls}</div><ResultCount count={resultCount} />{actions ? <div className="ds-filter-toolbar__actions">{actions}</div> : null}</section>;
}

const CARD_TYPES = { activity: ActivityCard, instructor: InstructorCard, rental: RentalCard, transfer: TransferCard, editorial: EditorialCard };

export function ListingGrid({ items = [], cardType = 'activity', state = 'ready', emptyAction, onRetry, ariaLabel = 'Catalog results' }) {
  if (state === 'loading') return <LoadingState title="Loading results" description="The catalog will update as soon as the data is ready." />;
  if (state === 'error') return <ErrorState title="Results are unavailable" description="Check your connection and try again." action={<Button variant="secondary" onClick={onRetry}>Try again</Button>} />;
  if (!items.length) return <EmptyState title="No matching results" description="Try removing one or more filters." action={emptyAction} />;
  const Card = CARD_TYPES[cardType];
  if (!Card) throw new Error(`ListingGrid: unregistered card type “${cardType}”.`);
  return <section className="ds-listing-grid" aria-label={ariaLabel}>{items.map((item) => <Card item={item} instructor={cardType === 'instructor' ? item : undefined} key={item.slug} />)}</section>;
}

export function BenefitCard({ icon, title, description }) {
  return <Surface className="ds-benefit-card"><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{description}</p></Surface>;
}

export function BenefitsSection({ kicker = 'Why book here', title, description, items = [] }) {
  return <section className="ds-section"><SectionHeading kicker={kicker} title={title} description={description} size="md" /><div className="ds-benefits-grid">{items.map((item) => <BenefitCard key={item.title} {...item} />)}</div></section>;
}

export function BookingStep({ number, title, description }) {
  return <article className="ds-booking-step"><Badge tone="inverse">{number}</Badge><h3>{title}</h3><p>{description}</p></article>;
}

export function BookingSteps({ title = 'How booking works', items = [] }) {
  return <section className="ds-section"><SectionHeading title={title} size="md" /><ol className="ds-booking-steps">{items.map((item, index) => <li key={item.title}><BookingStep number={index + 1} {...item} /></li>)}</ol></section>;
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
