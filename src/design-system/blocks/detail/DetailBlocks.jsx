import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ActivityCard,
  Badge,
  Button,
  DateField,
  Dialog,
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
  StarRating,
  StayCard,
  Surface,
  Textarea,
  TransferCard,
} from '../../../components';
import './DetailBlocks.scss';

function ObjectSection({ id, kicker, title, description, actions, children, className = '', titleId }) {
  return <section id={id} className={`ds-detail-section ${className}`} aria-labelledby={titleId}>
    <SectionHeading kicker={kicker} title={title} description={description} actions={actions} size="sm" titleId={titleId} />
    {children}
  </section>;
}

export function ObjectHero({ variant = 'split', breadcrumbs, title, description, media, badges = [], rating, titleId }) {
  if (!['split', 'centered', 'media-first'].includes(variant)) throw new Error(`ObjectHero: unknown variant “${variant}”.`);
  return <section className={`ds-object-hero ds-object-hero--${variant} ${media ? 'ds-object-hero--with-media' : 'ds-object-hero--without-media'}`}>
    {breadcrumbs ? <div className="ds-object-hero__back">{breadcrumbs}</div> : null}
    <div className="ds-object-hero__content">
      <div className="ds-object-hero__badges">{badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>
      <SectionHeading headingLevel="h1" size="display" align={variant === 'centered' ? 'center' : 'start'} title={title} titleId={titleId} description={description} />
      {rating ? <div className="ds-object-hero__rating"><Rating rating={rating.value} />{rating.href ? <a href={rating.href}>{rating.reviewsLabel}</a> : <span>{rating.reviewsLabel}</span>}</div> : null}
    </div>
    {media ? <div className="ds-object-hero__media">{media}</div> : null}
  </section>;
}

export function MainTag({ label, value }) {
  const values = Array.isArray(value) ? value : [value];
  return <div className="ds-main-tag"><dt>{label}</dt><dd>{values.filter(Boolean).map((item) => <Badge size="sm" key={item}>{item}</Badge>)}</dd></div>;
}

export function ObjectMainTags({ items = [], ariaLabel = 'Key details' }) {
  return <dl className="ds-object-main-tags" aria-label={ariaLabel}>{items.slice(0, 4).map((item) => <MainTag key={item.label} {...item} />)}</dl>;
}

export function ObjectDescription({ id = 'about', kicker = 'Good to know', title = 'About this offer', description, children, tags = [], tagsLabel = 'Key features' }) {
  const titleId = useId();
  return <ObjectSection id={id} className="ds-description-section" kicker={kicker} title={title} description={description} titleId={titleId}>
    <div className="ds-prose">{children}</div>
    {tags.length ? <div className="ds-description-section__tags" aria-label={tagsLabel}>{tags.map((item) => <Badge className="ds-description-section__tag" key={item}>{item}</Badge>)}</div> : null}
  </ObjectSection>;
}

function ReviewAvatar({ avatar, author }) {
  const [failed, setFailed] = useState(false);
  const initials = String(author ?? '?').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
  return avatar && !failed
    ? <img src={avatar} alt="" onError={() => setFailed(true)} />
    : <span aria-hidden="true">{initials || '?'}</span>;
}

function shortenedReview(text, limit) {
  if (text.length <= limit) return text;
  const fragment = text.slice(0, limit);
  const lastSpace = fragment.lastIndexOf(' ');
  return `${fragment.slice(0, lastSpace > limit * .65 ? lastSpace : limit).trim()}…`;
}

export function ReviewCard({ author, text = '', meta, dateLabel, contextLabel, rating = 5, avatar, truncate = true, previewLength = 220, variant = 'preview' }) {
  const textId = useId();
  const [expanded, setExpanded] = useState(false);
  const canTruncate = truncate && text.length > previewLength;
  const isCollapsed = canTruncate && !expanded;
  return <article className={`ds-review-card ds-review-card--${variant}`}>
    <header className="ds-review-card__author"><ReviewAvatar avatar={avatar} author={author} /><strong>{author}</strong></header>
    <div className="ds-review-card__proof"><StarRating value={rating} ariaLabel={`${rating} out of 5 stars`} />{dateLabel ? <span>· {dateLabel}</span> : null}{contextLabel ? <span>· {contextLabel}</span> : null}{!dateLabel && !contextLabel && meta ? <span>· {meta}</span> : null}</div>
    <blockquote id={textId}>{isCollapsed ? shortenedReview(text, previewLength) : text}</blockquote>
    {canTruncate ? <Button className="ds-review-card__more" variant="link" aria-expanded={expanded} aria-controls={textId} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Show less' : 'Show more'}</Button> : null}
  </article>;
}

function reviewCountLabel(count) {
  return `${count} ${count === 1 ? 'review' : 'reviews'}`;
}

export function ObjectReviews({ id = 'reviews', kicker = 'Guest experience', title = 'Reviews', description, rating, reviews = [], initialVisible = 4 }) {
  const titleId = useId();
  const visibleReviews = reviews.slice(0, initialVisible);
  const countLabel = reviewCountLabel(reviews.length);
  const allReviews = reviews.length ? <Dialog
    size="lg"
    className="ds-reviews-dialog"
    bodyClassName="ds-reviews-dialog__body"
    trigger={<Button variant="secondary" size="lg">Show all {countLabel}</Button>}
    title={countLabel}
    description={rating?.value ? `${rating.value} average rating` : undefined}
  >
    <div className="ds-reviews-dialog__list">{reviews.map((review) => <ReviewCard key={review.id ?? `${review.author}-${review.text}`} {...review} truncate={false} variant="dialog" />)}</div>
  </Dialog> : null;
  return <ObjectSection id={id} kicker={kicker} title={title} description={description} actions={rating ? <Rating rating={rating.value} reviews={rating.label} /> : null} titleId={titleId}>
    {visibleReviews.length ? <div className="ds-reviews">{visibleReviews.map((review) => <ReviewCard key={review.id ?? `${review.author}-${review.text}`} {...review} />)}</div> : <p className="ds-reviews__empty">No reviews yet.</p>}
    {allReviews ? <div className="ds-detail-section__footer">{allReviews}</div> : null}
  </ObjectSection>;
}

const RELATED_CARDS = { activity: ActivityCard, instructor: InstructorCard, rental: RentalCard, stay: StayCard, transfer: TransferCard, editorial: EditorialCard };
export function ObjectRelatedListings({ kicker = 'You may also like', title = 'More from this category', description, items = [], cardType = 'activity' }) {
  const titleId = useId();
  const Card = RELATED_CARDS[cardType];
  if (!Card) throw new Error(`ObjectRelatedListings: unregistered card type “${cardType}”.`);
  return <ObjectSection className="ds-object-related-listings" kicker={kicker} title={title} description={description} titleId={titleId}><ListingCardGrid className="ds-related-listings" columns={3}>{items.map((item) => <Card key={item.slug} item={item} />)}</ListingCardGrid></ObjectSection>;
}

// Compatibility aliases. New compositions use the object-anatomy names above.
export const PrimaryFacts = ObjectMainTags;
export const DescriptionSection = ObjectDescription;
export const ReviewsSection = ObjectReviews;
export const RelatedListings = ObjectRelatedListings;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function ObjectStickyNav({ items = [], bookingTargetId = 'booking-request', bookingSummary }) {
  const validItems = items.filter((item) => item?.href && item?.label);
  const triggerRef = useRef(null);
  const [activeHref, setActiveHref] = useState(validItems[0]?.href);
  const [isPinned, setIsPinned] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(true);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setIsPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!validItems.length || typeof IntersectionObserver === 'undefined') return undefined;
    const sections = validItems.map((item) => document.querySelector(item.href)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveHref(`#${visible[0].target.id}`);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .2, .6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [validItems.map((item) => item.href).join('|')]);

  useEffect(() => {
    const target = document.getElementById(bookingTargetId);
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setBookingVisible(entry.isIntersecting), { threshold: .05 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [bookingTargetId]);

  const continueBooking = () => {
    const target = document.getElementById(bookingTargetId);
    const form = target?.querySelector('form');
    if (!target) return;
    if (!form || !form.checkValidity()) {
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (form) window.setTimeout(() => form.querySelector(':invalid')?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 220);
      return;
    }
    form.requestSubmit();
  };

  if (!validItems.length) return null;
  const compactBookingVisible = isPinned && !bookingVisible;
  return <>
    <span ref={triggerRef} className="ds-object-sticky-nav__trigger" aria-hidden="true" />
    <div className={`ds-object-sticky-nav ${isPinned ? 'is-pinned' : ''}`} aria-hidden={!isPinned}>
      <div className="ds-object-sticky-nav__inner">
        <nav className="ds-object-sticky-nav__links" aria-label="On this page">
          {validItems.map((item) => <a href={item.href} key={item.href} tabIndex={isPinned ? undefined : -1} aria-current={activeHref === item.href ? 'location' : undefined}>{item.label}</a>)}
        </nav>
        <div className={`ds-object-sticky-nav__booking ${compactBookingVisible ? 'is-visible' : ''}`} aria-hidden={!compactBookingVisible}>
          {bookingSummary?.totalLabel ? <div><span>Estimated total</span><strong>{bookingSummary.totalLabel}</strong></div> : null}
          <Button type="button" size="sm" onClick={continueBooking} tabIndex={compactBookingVisible ? undefined : -1}>{bookingSummary?.actionLabel ?? 'Continue'}</Button>
        </div>
      </div>
    </div>
  </>;
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

export function BookingWidget({ id = 'booking-request', category = 'instructor', price, currency = 'GEL', availability, actionLabel = 'Continue', defaultValues, onValuesChange, onSummaryChange, onSubmit }) {
  const preset = BOOKING_PRESETS[category];
  if (!preset) throw new Error(`BookingWidget: unsupported category “${category}”.`);
  const [values, setValues] = useState(() => initialBookingValues(preset, defaultValues));
  const [expanded, setExpanded] = useState(false);
  const numericPrice = Number.parseFloat(String(price).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
  const total = useMemo(() => numericPrice * preset.multiplier(values), [numericPrice, preset, values]);
  const ready = Boolean(values.date && values.name.trim() && values.phone.trim() && (!preset.textField || values[preset.textField.id]?.trim()));
  const update = (id, value) => setValues((current) => { const next = { ...current, [id]: value }; onValuesChange?.(next); return next; });
  const submit = (event) => { event.preventDefault(); onSubmit?.({ category, values, total }); };

  useEffect(() => {
    onSummaryChange?.({ actionLabel, ready, totalLabel: numericPrice ? `${total} ${currency}` : null });
  }, [actionLabel, currency, numericPrice, onSummaryChange, ready, total]);

  return <Surface as="aside" id={id} className={`ds-booking-widget ${expanded ? 'is-expanded' : ''}`} padding="md" aria-label="Booking request">
    <button type="button" className="ds-booking-widget__mobile-summary" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}><span>{preset.label}</span><strong>{numericPrice ? `${numericPrice} ${currency}` : 'On request'}</strong><span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <form className="ds-booking-widget__form" onSubmit={submit}>
      <div className="ds-booking-widget__head"><div><small>{preset.label}</small>{numericPrice ? <Price price={`${numericPrice} ${currency}`} /> : <strong>On request</strong>}</div>{availability ? <Badge tone="success">{availability}</Badge> : null}</div>
      <div className="ds-booking-widget__fields">
        <FormField label="Preferred date" required><DateField required value={values.date} onChange={(event) => update('date', event.target.value)} /></FormField>
        {preset.units.map((unit) => <div className="ds-booking-widget__stepper" key={unit.id}><span>{unit.label}</span><QuantityStepper label={unit.label} value={values[unit.id]} min={unit.min} max={unit.max} onChange={(value) => update(unit.id, value)} /></div>)}
        {preset.select ? <FormField label={preset.select.label}><Select value={values[preset.select.id]} onChange={(event) => update(preset.select.id, event.target.value)}>{preset.select.options.map((option) => <option key={option}>{option}</option>)}</Select></FormField> : null}
        {preset.textField ? <FormField label={preset.textField.label} required><Input required value={values[preset.textField.id]} placeholder={preset.textField.placeholder} onChange={(event) => update(preset.textField.id, event.target.value)} /></FormField> : null}
        <FormField label="Name" required><Input required autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} /></FormField>
        <FormField label="Phone or messenger" required><Input required autoComplete="tel" value={values.phone} onChange={(event) => update('phone', event.target.value)} /></FormField>
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

export const RouteProgram = (props) => <SpecificSection type="route" title="Route program" {...props} />;
export const IncludedServices = (props) => <SpecificSection type="included" title="Included services" {...props} />;
export const EquipmentList = (props) => <SpecificSection type="equipment" title="Equipment" {...props} />;
export const SafetyRequirements = (props) => <SpecificSection type="safety" title="Safety requirements" {...props} />;

export const ADDITIONAL_SECTION_REGISTRY = { routeProgram: RouteProgram, includedServices: IncludedServices, equipmentList: EquipmentList, safetyRequirements: SafetyRequirements };

export function RegisteredAdditionalSections({ sections = [] }) {
  return <>{sections.map((section, index) => { const Component = ADDITIONAL_SECTION_REGISTRY[section.type]; if (!Component) throw new Error(`Object detail: unregistered additional section “${section.type}”.`); return <Component key={section.id ?? `${section.type}-${index}`} {...section} />; })}</>;
}
