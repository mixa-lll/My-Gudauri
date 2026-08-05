import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  ActivityCard,
  Badge,
  Button,
  Dialog,
  EditorialCard,
  InstructorCard,
  ListingCardGrid,
  Notice,
  ObjectMediaGallery,
  Rating,
  RentalCard,
  SectionHeading,
  StarRating,
  StayCard,
  TransferCard,
} from '../../../components';
import { TransferConditions, TransferRouteDetails, TransferVehicleDetails } from './transfer/TransferDetailBlocks';
import './DetailBlocks.scss';

function ObjectSection({ id, kicker, title, description, actions, children, className = '', headingClassName, titleId }) {
  return <section id={id} className={`ds-detail-section ${className}`} aria-labelledby={titleId}>
    <SectionHeading className={headingClassName} kicker={kicker} title={title} description={description} actions={actions} size="sm" titleId={titleId} />
    {children}
  </section>;
}

export function ObjectHeroGallery({
  images = [],
  objectName,
  objectLabel = 'Object media',
  openLabel = 'Open gallery',
  photosLabel = 'photos',
  placeholderKind,
}) {
  const galleryImages = images.filter((image) => image?.src && image?.type !== 'video');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const galleryTriggerRef = useRef(null);

  useEffect(() => {
    if (galleryIndex >= galleryImages.length) setGalleryIndex(0);
  }, [galleryImages.length, galleryIndex]);

  const openGallery = (index, trigger) => {
    galleryTriggerRef.current = trigger;
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };
  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    requestAnimationFrame(() => galleryTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  if (!galleryImages.length) return <MediaPlaceholder kind={placeholderKind} label={objectName} />;

  const mainImage = galleryImages[0];
  const previewImages = galleryImages.slice(1, 5);
  return <div className="ds-object-hero-gallery">
    <button
      className="ds-object-hero-gallery__main"
      type="button"
      aria-label={`${openLabel}: ${objectName}`}
      onClick={(event) => openGallery(0, event.currentTarget)}
    >
      <img src={mainImage.src} alt={mainImage.alt || objectName} loading="eager" />
      <span className="ds-object-hero-gallery__open" aria-hidden="true">
        <span><strong>{openLabel}</strong><small>{galleryImages.length} {photosLabel}</small></span>
        <span>↗</span>
      </span>
    </button>
    {previewImages.length ? <div className="ds-object-hero-gallery__thumbs" aria-label={objectLabel}>
      {previewImages.map((image, index) => <button
        type="button"
        aria-label={`${openLabel}: ${index + 2}`}
        onClick={(event) => openGallery(index + 1, event.currentTarget)}
        key={`${image.src}-${index}`}
      >
        <img src={image.thumbnail || image.src} alt="" aria-hidden="true" loading="lazy" />
      </button>)}
    </div> : null}
    <ObjectMediaGallery
      images={galleryImages}
      index={galleryIndex}
      objectName={objectName}
      objectLabel={objectLabel}
      isOpen={isGalleryOpen}
      onClose={closeGallery}
      onIndexChange={setGalleryIndex}
    />
  </div>;
}

export function ObjectHero({ variant = 'split', mediaVariant = 'default', breadcrumbs, title, description, media, badges = [], rating, details, titleId }) {
  if (!['split', 'centered', 'media-first'].includes(variant)) throw new Error(`ObjectHero: unknown variant “${variant}”.`);
  if (!['default', 'gallery'].includes(mediaVariant)) throw new Error(`ObjectHero: unknown media variant “${mediaVariant}”.`);
  return <section className={`ds-object-hero ds-object-hero--${variant} ${media ? 'ds-object-hero--with-media' : 'ds-object-hero--without-media'}`}>
    {breadcrumbs ? <div className="ds-object-hero__back">{breadcrumbs}</div> : null}
    <div className="ds-object-hero__content">
      <div className="ds-object-hero__badges">{badges.map((badge) => {
        const item = typeof badge === 'string' ? { label: badge } : badge;
        return <Badge key={item.label} tone={item.tone} size={item.size}>{item.label}</Badge>;
      })}</div>
      <SectionHeading headingLevel="h1" size="display" align={variant === 'centered' ? 'center' : 'start'} title={title} titleId={titleId} description={description} />
      {rating ? <div className="ds-object-hero__rating"><Rating rating={rating.value} size="md" tone="accent" variant="plaque" />{rating.href ? <a href={rating.href}>{rating.reviewsLabel}</a> : <span>{rating.reviewsLabel}</span>}</div> : null}
      {details ? <div className="ds-object-hero__details">{details}</div> : null}
    </div>
    {media ? <div className={`ds-object-hero__media ds-object-hero__media--${mediaVariant}`}>{media}</div> : null}
  </section>;
}

function difficultyLevel(value) {
  const parsed = Number.parseInt(String(Array.isArray(value) ? value[0] : value), 10);
  return Number.isFinite(parsed) ? Math.min(5, Math.max(1, parsed)) : 1;
}

export function MainTag({ label, value, display = 'value' }) {
  if (!['value', 'difficulty'].includes(display)) throw new Error(`MainTag: unknown display “${display}”.`);
  const values = Array.isArray(value) ? value : [value];
  if (display === 'difficulty') {
    const level = difficultyLevel(value);
    return <div className="ds-main-tag ds-main-tag--difficulty"><dt>{label}</dt><dd><span className={`ds-difficulty-scale ds-difficulty-scale--${level}`} role="img" aria-label={`Difficulty ${level} out of 5`}>{[1, 2, 3, 4, 5].map((point) => <span className={point <= level ? 'is-active' : ''} aria-hidden="true" key={point} />)}</span></dd></div>;
  }
  return <div className="ds-main-tag"><dt>{label}</dt><dd>{values.filter(Boolean).join(' · ')}</dd></div>;
}

export function ObjectMainTags({ items = [], ariaLabel = 'Key details' }) {
  return <dl className="ds-object-main-tags" aria-label={ariaLabel}>{items.slice(0, 3).map((item) => <MainTag key={item.label} {...item} />)}</dl>;
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
    <div className="ds-review-card__proof"><StarRating value={rating} tone="accent" ariaLabel={`${rating} out of 5 stars`} />{dateLabel ? <span>· {dateLabel}</span> : null}{contextLabel ? <span>· {contextLabel}</span> : null}{!dateLabel && !contextLabel && meta ? <span>· {meta}</span> : null}</div>
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
  return <ObjectSection id={id} kicker={kicker} title={title} description={description} headingClassName="ds-object-reviews__heading" actions={rating ? <Rating rating={rating.value} reviews={rating.label} size="lg" tone="accent" /> : null} titleId={titleId}>
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

function SpecificSection({ id, type, kicker = 'What to expect', title, description, items = [], notice }) {
  const titleId = useId();
  return <ObjectSection id={id ?? type} className={`ds-specific-section ds-specific-section--${type}`} kicker={kicker} title={title} description={description} titleId={titleId}>{notice ? <Notice tone={type === 'safety' ? 'warning' : 'info'}>{notice}</Notice> : null}<ul>{items.map((item) => <li key={item.title ?? item}>{typeof item === 'string' ? item : <><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</>}</li>)}</ul></ObjectSection>;
}

export const RouteProgram = (props) => <SpecificSection type="route" title="Route program" {...props} />;
export const SafetyRequirements = (props) => <SpecificSection type="safety" title="Safety requirements" {...props} />;

function DetailListItem({ item }) {
  if (typeof item === 'string') return <span>{item}</span>;
  return <><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</>;
}

function InclusionItem({ item, tone }) {
  const title = typeof item === 'string' ? item : item.title;
  const description = typeof item === 'string' ? undefined : item.description;
  return <>
    <Badge className={`ds-inclusions-section__badge ds-inclusions-section__badge--${tone}`} size="md" tone={tone === 'included' ? 'success' : 'danger'}>
      <span className="ds-inclusions-section__badge-marker" aria-hidden="true">{tone === 'included' ? '✓' : '×'}</span>
      <span>{title}</span>
    </Badge>
    {description ? <p>{description}</p> : null}
  </>;
}

function InclusionColumn({ tone, title, items, emptyLabel }) {
  const hasItems = items.length > 0;
  return <section className={`ds-inclusions-section__column ds-inclusions-section__column--${tone}`} aria-label={title}>
    <header><h3>{title}</h3></header>
    {hasItems ? <ul>{items.map((item, index) => <li key={typeof item === 'string' ? item : item.title ?? index}><InclusionItem item={item} tone={tone} /></li>)}</ul> : <p className="ds-inclusions-section__empty">{emptyLabel}</p>}
  </section>;
}

export function IncludedServices({ id = 'included', kicker = 'Booking details', title = 'What is included', description, items, includedItems, excludedItems = [], includedLabel = 'Included', excludedLabel = 'Not included', emptyExcludedLabel = 'No exclusions have been specified.' }) {
  const titleId = useId();
  const included = includedItems ?? items ?? [];
  return <ObjectSection id={id} className="ds-inclusions-section" kicker={kicker} title={title} description={description} titleId={titleId}>
    <div className="ds-inclusions-section__grid">
      <InclusionColumn tone="included" title={includedLabel} items={included} emptyLabel="Details will be confirmed with your booking." />
      <InclusionColumn tone="excluded" title={excludedLabel} items={excludedItems} emptyLabel={emptyExcludedLabel} />
    </div>
  </ObjectSection>;
}

export function EquipmentList({ id = 'equipment', kicker = 'Pack for the day', title = 'What to bring', description, items = [], note }) {
  const titleId = useId();
  return <ObjectSection id={id} className="ds-equipment-list" kicker={kicker} title={title} description={description} titleId={titleId}>
    <ul>{items.map((item, index) => <li key={typeof item === 'string' ? item : item.title ?? index}><span className="ds-equipment-list__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><DetailListItem item={item} /></div></li>)}</ul>
    {note ? <p className="ds-equipment-list__note">{note}</p> : null}
  </ObjectSection>;
}

export function ActivitySchedule({ id = 'schedule', kicker = 'Plan your day', title = 'Schedule', description, items = [] }) {
  const titleId = useId();
  return <ObjectSection id={id} className="ds-activity-schedule" kicker={kicker} title={title} description={description} titleId={titleId}>
    <ol>
      {items.map((item, index) => <li key={`${item.time ?? index}-${item.title}`}><time dateTime={/^\d{2}:\d{2}$/.test(item.time ?? '') ? item.time : undefined}>{item.time ?? '—'}</time><span className="ds-activity-schedule__marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div className="ds-activity-schedule__item"><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</div></li>)}
    </ol>
  </ObjectSection>;
}

export function RouteMap({ id = 'route-map', kicker = 'Navigation', title = 'Route map', description, start, finish, startLabel = 'Start', finishLabel = 'Finish', confirmationLabel = 'On confirmation', points = [], mapHref, mapLabel = 'Open map', newTabLabel = 'opens in a new tab' }) {
  const titleId = useId();
  const hasOverview = start || finish || points.length;
  return <ObjectSection id={id} className="ds-route-map" kicker={kicker} title={title} description={description} titleId={titleId}>
    <div className="ds-route-map__panel">
      {hasOverview ? <dl><div><dt>{startLabel}</dt><dd>{start || confirmationLabel}</dd></div><div><dt>{finishLabel}</dt><dd>{finish || confirmationLabel}</dd></div></dl> : null}
      {points.length ? <ol>{points.map((point, index) => <li key={point.title ?? index}><span>{index + 1}</span><div><strong>{point.title}</strong>{point.description ? <p>{point.description}</p> : null}</div></li>)}</ol> : null}
      {mapHref ? <a className="ds-route-map__link" href={mapHref} target="_blank" rel="noreferrer">{mapLabel}<span className="visually-hidden"> ({newTabLabel})</span><span aria-hidden="true">↗</span></a> : null}
    </div>
  </ObjectSection>;
}

export const ADDITIONAL_SECTION_REGISTRY = {
  routeProgram: RouteProgram,
  activitySchedule: ActivitySchedule,
  routeMap: RouteMap,
  includedServices: IncludedServices,
  equipmentList: EquipmentList,
  safetyRequirements: SafetyRequirements,
  transferVehicle: TransferVehicleDetails,
  transferRoute: TransferRouteDetails,
  transferConditions: TransferConditions,
};

export function RegisteredAdditionalSections({ sections = [] }) {
  return <>{sections.map((section, index) => { const Component = ADDITIONAL_SECTION_REGISTRY[section.type]; if (!Component) throw new Error(`Object detail: unregistered additional section “${section.type}”.`); return <Component key={section.id ?? `${section.type}-${index}`} {...section} />; })}</>;
}
