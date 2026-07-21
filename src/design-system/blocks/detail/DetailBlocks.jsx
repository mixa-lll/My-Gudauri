import { useId, useMemo, useState } from 'react';
import {
  ActivityCard,
  Badge,
  Button,
  DateField,
  EditorialCard,
  FormField,
  Input,
  InstructorCard,
  ListingCardGrid,
  Notice,
  Price,
  QuantityStepper,
  Rating,
  RentalCard,
  SectionHeading,
  Select,
  StayCard,
  Surface,
  Textarea,
  TransferCard,
} from '../../../components';
import './DetailBlocks.scss';

function ObjectSection({ kicker, title, description, actions, children, className = '', titleId }) {
  return <section className={`ds-detail-section ${className}`} aria-labelledby={titleId}>
    <SectionHeading kicker={kicker} title={title} description={description} actions={actions} size="sm" titleId={titleId} />
    {children}
  </section>;
}

export function ObjectHero({ variant = 'split', breadcrumbs, title, description, media, badges = [], titleId }) {
  if (!['split', 'centered', 'media-first'].includes(variant)) throw new Error(`ObjectHero: unknown variant “${variant}”.`);
  return <section className={`ds-object-hero ds-object-hero--${variant} ${media ? 'ds-object-hero--with-media' : 'ds-object-hero--without-media'}`}>
    {breadcrumbs ? <div className="ds-object-hero__back">{breadcrumbs}</div> : null}
    <div className="ds-object-hero__content"><div className="ds-object-hero__badges">{badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div><SectionHeading headingLevel="h1" size="display" align={variant === 'centered' ? 'center' : 'start'} title={title} titleId={titleId} description={description} /></div>
    {media ? <div className="ds-object-hero__media">{media}</div> : null}
  </section>;
}

export function MainTag({ label, value }) {
  return <div className="ds-main-tag"><dt>{label}</dt><dd>{value}</dd></div>;
}

export function PrimaryFacts({ items = [] }) {
  return <dl className="ds-primary-facts">{items.slice(0, 4).map((item) => <MainTag key={item.label} {...item} />)}</dl>;
}

export function DescriptionSection({ kicker = 'Good to know', title = 'About this offer', description, children }) {
  const titleId = useId();
  return <ObjectSection className="ds-description-section" kicker={kicker} title={title} description={description} titleId={titleId}><div className="ds-prose">{children}</div></ObjectSection>;
}

export function AdditionalDetails({ kicker = 'At a glance', title = 'Details', description, items = [] }) {
  const titleId = useId();
  return <ObjectSection kicker={kicker} title={title} description={description} titleId={titleId}><dl className="ds-additional-details">{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></ObjectSection>;
}

export function SecondaryTags({ kicker = 'More details', title = 'Features', description, items = [] }) {
  const titleId = useId();
  return <ObjectSection kicker={kicker} title={title} description={description} titleId={titleId}><div className="ds-secondary-tags" aria-label={title}>{items.map((item) => <Badge key={item}>{item}</Badge>)}</div></ObjectSection>;
}

export function ReviewCard({ author, text, meta, rating = 5, verified = false, avatar }) {
  return <Surface as="article" className="ds-review-card" padding="md">
    <header className="ds-review-card__author">{avatar ? <img src={avatar} alt="" /> : <span aria-hidden="true">{author?.charAt(0)}</span>}<div><strong>{author}</strong>{meta ? <small>{meta}</small> : null}</div></header>
    <div className="ds-review-card__proof"><Rating rating={rating} />{verified ? <Badge tone="success">Verified booking</Badge> : null}</div>
    <blockquote>{text}</blockquote>
  </Surface>;
}

export function ReviewsSection({ kicker = 'Guest experience', title = 'Reviews', description, rating, reviews = [], initialVisible = 4 }) {
  const titleId = useId();
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? reviews : reviews.slice(0, initialVisible);
  const toggle = reviews.length > initialVisible ? <Button variant="secondary" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>{expanded ? 'Show fewer reviews' : `All reviews (${reviews.length})`}</Button> : null;
  return <ObjectSection kicker={kicker} title={title} description={description} actions={rating ? <Rating rating={rating.value} reviews={rating.label} /> : null} titleId={titleId}>
    <div className="ds-reviews">{visibleReviews.map((review) => <ReviewCard key={review.id ?? `${review.author}-${review.text}`} {...review} />)}</div>
    {toggle ? <div className="ds-detail-section__footer">{toggle}</div> : null}
  </ObjectSection>;
}

export function DetailBookingSteps({ kicker = 'Simple and clear', title = 'How booking works', description, items = [] }) {
  const titleId = useId();
  return <ObjectSection kicker={kicker} title={title} description={description} titleId={titleId}><ol className="ds-detail-steps">{items.map((item, index) => <li key={item.title}><Badge tone="inverse">{index + 1}</Badge><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol></ObjectSection>;
}

const RELATED_CARDS = { activity: ActivityCard, instructor: InstructorCard, rental: RentalCard, stay: StayCard, transfer: TransferCard, editorial: EditorialCard };
export function RelatedListings({ kicker = 'You may also like', title = 'More from this category', description, items = [], cardType = 'activity' }) {
  const titleId = useId();
  const Card = RELATED_CARDS[cardType];
  if (!Card) throw new Error(`RelatedListings: unregistered card type “${cardType}”.`);
  return <ObjectSection kicker={kicker} title={title} description={description} titleId={titleId}><ListingCardGrid className="ds-related-listings" columns="auto">{items.map((item) => <Card key={item.slug} item={item} />)}</ListingCardGrid></ObjectSection>;
}

const BOOKING_PRESETS = {
  instructor: { label: 'Private lesson from', units: [{ id: 'duration', label: 'Hours', min: 1, max: 8, initial: 2 }, { id: 'participants', label: 'People', min: 1, max: 8, initial: 1 }], select: { id: 'level', label: 'Level', options: ['First time', 'Beginner', 'Intermediate', 'Advanced'] }, multiplier: (values) => values.duration },
  activity: { label: 'Activity from', units: [{ id: 'participants', label: 'People', min: 1, max: 12, initial: 1 }], select: { id: 'duration', label: 'Duration', options: ['Half day', 'Full day'] }, multiplier: (values) => values.participants },
  rental: { label: 'Rental from', units: [{ id: 'days', label: 'Days', min: 1, max: 14, initial: 1 }], select: { id: 'equipment', label: 'Equipment', options: ['Ski set', 'Snowboard set', 'Clothing'] }, multiplier: (values) => values.days },
  transfer: { label: 'Transfer from', units: [{ id: 'passengers', label: 'Passengers', min: 1, max: 16, initial: 2 }], textField: { id: 'pickup', label: 'Pickup point', placeholder: 'Tbilisi airport' }, multiplier: () => 1 },
  stay: { label: 'Stay from', units: [{ id: 'nights', label: 'Nights', min: 1, max: 30, initial: 2 }, { id: 'guests', label: 'Guests', min: 1, max: 12, initial: 2 }], multiplier: (values) => values.nights },
};

function initialBookingValues(preset, defaults = {}) {
  return { ...Object.fromEntries(preset.units.map((unit) => [unit.id, unit.initial])), date: '', name: '', phone: '', comment: '', [preset.select?.id]: preset.select?.options[0], [preset.textField?.id]: '', ...defaults };
}

export function BookingWidget({ category = 'instructor', price, currency = 'GEL', availability, actionLabel = 'Continue', defaultValues, onValuesChange, onSubmit }) {
  const preset = BOOKING_PRESETS[category];
  if (!preset) throw new Error(`BookingWidget: unsupported category “${category}”.`);
  const [values, setValues] = useState(() => initialBookingValues(preset, defaultValues));
  const [expanded, setExpanded] = useState(false);
  const numericPrice = Number.parseFloat(String(price).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
  const total = useMemo(() => numericPrice * preset.multiplier(values), [numericPrice, preset, values]);
  const update = (id, value) => setValues((current) => { const next = { ...current, [id]: value }; onValuesChange?.(next); return next; });
  const submit = (event) => { event.preventDefault(); onSubmit?.({ category, values, total }); };

  return <Surface as="aside" className={`ds-booking-widget ${expanded ? 'is-expanded' : ''}`} padding="md" aria-label="Booking request">
    <button type="button" className="ds-booking-widget__mobile-summary" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}><span>{preset.label}</span><strong>{numericPrice ? `${numericPrice} ${currency}` : 'On request'}</strong><span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <form className="ds-booking-widget__form" onSubmit={submit}>
      <div className="ds-booking-widget__head"><div><small>{preset.label}</small>{numericPrice ? <Price price={`${numericPrice} ${currency}`} /> : <strong>On request</strong>}</div>{availability ? <Badge tone="success">{availability}</Badge> : null}</div>
      <div className="ds-booking-widget__fields">
        <FormField label="Preferred date"><DateField value={values.date} onChange={(event) => update('date', event.target.value)} /></FormField>
        {preset.units.map((unit) => <div className="ds-booking-widget__stepper" key={unit.id}><span>{unit.label}</span><QuantityStepper label={unit.label} value={values[unit.id]} min={unit.min} max={unit.max} onChange={(value) => update(unit.id, value)} /></div>)}
        {preset.select ? <FormField label={preset.select.label}><Select value={values[preset.select.id]} onChange={(event) => update(preset.select.id, event.target.value)}>{preset.select.options.map((option) => <option key={option}>{option}</option>)}</Select></FormField> : null}
        {preset.textField ? <FormField label={preset.textField.label}><Input value={values[preset.textField.id]} placeholder={preset.textField.placeholder} onChange={(event) => update(preset.textField.id, event.target.value)} /></FormField> : null}
        <FormField label="Name" required><Input autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} /></FormField>
        <FormField label="Phone or messenger" required><Input autoComplete="tel" value={values.phone} onChange={(event) => update('phone', event.target.value)} /></FormField>
        <FormField label="Comment"><Textarea value={values.comment} onChange={(event) => update('comment', event.target.value)} /></FormField>
      </div>
      <div className="ds-booking-widget__total"><span>Estimated total</span><strong>{numericPrice ? `${total} ${currency}` : 'On request'}</strong></div>
      <Button type="submit" fullWidth>{actionLabel}</Button>
      <p className="ds-booking-widget__note">No payment now. We confirm availability and final details first.</p>
    </form>
  </Surface>;
}

export function StickyBookingWidget(props) {
  return <BookingWidget {...props} />;
}

function SpecificSection({ type, kicker = 'What to expect', title, description, items = [], notice }) {
  const titleId = useId();
  return <ObjectSection className={`ds-specific-section ds-specific-section--${type}`} kicker={kicker} title={title} description={description} titleId={titleId}>{notice ? <Notice tone={type === 'safety' ? 'warning' : 'info'}>{notice}</Notice> : null}<ul>{items.map((item) => <li key={item.title ?? item}>{typeof item === 'string' ? item : <><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</>}</li>)}</ul></ObjectSection>;
}

export const CertificationsSection = (props) => <SpecificSection type="certifications" title="Certifications" {...props} />;
export const RouteProgram = (props) => <SpecificSection type="route" title="Route program" {...props} />;
export const IncludedServices = (props) => <SpecificSection type="included" title="Included services" {...props} />;
export const EquipmentList = (props) => <SpecificSection type="equipment" title="Equipment" {...props} />;
export const SafetyRequirements = (props) => <SpecificSection type="safety" title="Safety requirements" {...props} />;

export const ADDITIONAL_SECTION_REGISTRY = { certifications: CertificationsSection, routeProgram: RouteProgram, includedServices: IncludedServices, equipmentList: EquipmentList, safetyRequirements: SafetyRequirements };

export function RegisteredAdditionalSections({ sections = [] }) {
  return <>{sections.map((section, index) => { const Component = ADDITIONAL_SECTION_REGISTRY[section.type]; if (!Component) throw new Error(`Object detail: unregistered additional section “${section.type}”.`); return <Component key={section.id ?? `${section.type}-${index}`} {...section} />; })}</>;
}
