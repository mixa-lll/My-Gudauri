import { ActivityCard, Badge, Button, EditorialCard, InstructorCard, ListingCardGrid, Notice, Price, Rating, RentalCard, SectionHeading, StayCard, Surface, TransferCard } from '../../../components';
import './DetailBlocks.scss';

export function ObjectHero({ variant = 'split', breadcrumbs, title, description, media, badges = [], titleId }) {
  if (!['split', 'centered', 'media-first'].includes(variant)) throw new Error(`ObjectHero: unknown variant “${variant}”.`);
  return <section className={`ds-object-hero ds-object-hero--${variant} ${media ? 'ds-object-hero--with-media' : 'ds-object-hero--without-media'}`}>
    {breadcrumbs ? <div className="ds-object-hero__back">{breadcrumbs}</div> : null}
    <div className="ds-object-hero__content"><div className="ds-object-hero__badges">{badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div><SectionHeading headingLevel="h1" size="display" align={variant === 'centered' ? 'center' : 'start'} title={title} titleId={titleId} description={description} /></div>
    {media ? <div className="ds-object-hero__media">{media}</div> : null}
  </section>;
}

export function PrimaryFacts({ items = [] }) {
  return <dl className="ds-primary-facts">{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
}

export function DescriptionSection({ title = 'Description', children }) {
  return <section className="ds-detail-section ds-description-section"><SectionHeading title={title} size="sm" /><div className="ds-prose">{children}</div></section>;
}

export function AdditionalDetails({ title = 'Details', items = [] }) {
  return <section className="ds-detail-section"><SectionHeading title={title} size="sm" /><dl className="ds-additional-details">{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>;
}

export function ReviewsSection({ title = 'Guest reviews', rating, reviews = [] }) {
  return <section className="ds-detail-section"><div className="ds-detail-section__head"><SectionHeading title={title} size="sm" />{rating ? <Rating rating={rating.value} reviews={rating.label} /> : null}</div><div className="ds-reviews">{reviews.map((review) => <Surface as="article" key={review.id ?? review.author}><blockquote>“{review.text}”</blockquote><footer><strong>{review.author}</strong>{review.meta ? <span>{review.meta}</span> : null}</footer></Surface>)}</div></section>;
}

export function DetailBookingSteps({ title = 'How booking works', items = [] }) {
  return <section className="ds-detail-section"><SectionHeading title={title} size="sm" /><ol className="ds-detail-steps">{items.map((item, index) => <li key={item.title}><Badge tone="inverse">{index + 1}</Badge><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol></section>;
}

const RELATED_CARDS = { activity: ActivityCard, instructor: InstructorCard, rental: RentalCard, stay: StayCard, transfer: TransferCard, editorial: EditorialCard };
export function RelatedListings({ title = 'You may also like', items = [], cardType = 'activity' }) {
  const Card = RELATED_CARDS[cardType];
  if (!Card) throw new Error(`RelatedListings: unregistered card type “${cardType}”.`);
  return <section className="ds-detail-section"><SectionHeading title={title} size="sm" /><ListingCardGrid className="ds-related-listings" columns="auto">{items.map((item) => <Card key={item.slug} item={item} />)}</ListingCardGrid></section>;
}

export function StickyBookingWidget({ price, suffix, availability, actionLabel = 'Request booking', onAction, secondaryAction }) {
  return <Surface as="aside" className="ds-sticky-booking" padding="md"><div>{price ? <Price price={price} suffix={suffix} /> : null}{availability ? <p>{availability}</p> : null}</div><Button fullWidth onClick={onAction}>{actionLabel}</Button>{secondaryAction}</Surface>;
}

function SpecificSection({ type, title, items = [], notice }) {
  return <section className={`ds-detail-section ds-specific-section ds-specific-section--${type}`}><SectionHeading title={title} size="sm" />{notice ? <Notice tone={type === 'safety' ? 'warning' : 'info'}>{notice}</Notice> : null}<ul>{items.map((item) => <li key={item.title ?? item}>{typeof item === 'string' ? item : <><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</>}</li>)}</ul></section>;
}

export const CertificationsSection = (props) => <SpecificSection type="certifications" title="Certifications" {...props} />;
export const RouteProgram = (props) => <SpecificSection type="route" title="Route program" {...props} />;
export const IncludedServices = (props) => <SpecificSection type="included" title="Included services" {...props} />;
export const EquipmentList = (props) => <SpecificSection type="equipment" title="Equipment" {...props} />;
export const SafetyRequirements = (props) => <SpecificSection type="safety" title="Safety requirements" {...props} />;

export const ADDITIONAL_SECTION_REGISTRY = {
  certifications: CertificationsSection,
  routeProgram: RouteProgram,
  includedServices: IncludedServices,
  equipmentList: EquipmentList,
  safetyRequirements: SafetyRequirements
};

export function RegisteredAdditionalSections({ sections = [] }) {
  return <>{sections.map((section, index) => { const Component = ADDITIONAL_SECTION_REGISTRY[section.type]; if (!Component) throw new Error(`Object detail: unregistered additional section “${section.type}”.`); return <Component key={section.id ?? `${section.type}-${index}`} {...section} />; })}</>;
}
