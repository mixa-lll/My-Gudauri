import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { MediaPlaceholder } from '../MediaPlaceholder/MediaPlaceholder';
import { Badge } from '../UI/Badge/Badge';
import './ListingCard.scss';

const CARD_LAYOUTS = ['vertical', 'horizontal', 'featured'];
const GRID_COLUMNS = ['auto', 2, 3, 4];

export function ListingCard({
  to,
  className,
  layout = 'vertical',
  mediaPosition = 'center',
  image,
  imageAlt = '',
  placeholderLabel,
  mediaTop,
  mediaBottom,
  title,
  titleMeta,
  description,
  headingLevel = 3,
  footer,
  loading = 'lazy'
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [image]);

  if (!CARD_LAYOUTS.includes(layout)) throw new Error(`ListingCard: unknown layout “${layout}”.`);
  if (!['center', 'top'].includes(mediaPosition)) throw new Error(`ListingCard: unknown media position “${mediaPosition}”.`);
  if (!Number.isInteger(headingLevel) || headingLevel < 2 || headingLevel > 6) throw new Error('ListingCard: headingLevel must be between 2 and 6.');

  return (
    <Link className={cn('listing-card', `listing-card--${layout}`, `listing-card--media-${mediaPosition}`, className)} to={to}>
      <div className="listing-card__media">
        {image && !imageFailed ? (
          <img src={image} alt={imageAlt} loading={loading} onError={() => setImageFailed(true)} />
        ) : (
          <MediaPlaceholder label={placeholderLabel ?? title} />
        )}
        {mediaTop && <div className="listing-card__media-top">{mediaTop}</div>}
        {mediaBottom && <div className="listing-card__media-bottom">{mediaBottom}</div>}
      </div>

      <div className="listing-card__body">
        <div className="listing-card__title-row">
          {createElement(`h${headingLevel}`, { className: 'listing-card__title' }, title)}
          {titleMeta}
        </div>
        {description && <p className="listing-card__description">{description}</p>}
        {footer && <div className="listing-card__footer">{footer}</div>}
      </div>
    </Link>
  );
}

export function ListingCardGrid({ children, columns = 'auto', className, ariaLabel }) {
  if (!GRID_COLUMNS.includes(columns)) throw new Error('ListingCardGrid: columns must be “auto”, 2, 3 or 4.');
  const Component = ariaLabel ? 'section' : 'div';
  return <Component className={cn('listing-card-grid', `listing-card-grid--${columns}`, className)} aria-label={ariaLabel}>{children}</Component>;
}

export function ListingCardPill({ children, icon, className, title }) {
  return (
    <Badge className={cn('listing-card__pill', className)} size="sm" mediaOverlay icon={icon} title={title}>
      {children}
    </Badge>
  );
}

export function ListingCardRating({ rating, reviews }) {
  return (
    <span className="listing-card__rating">
      <b aria-hidden="true">★</b>
      <strong>{rating}</strong>
      {reviews && <small>{reviews}</small>}
    </span>
  );
}

export function ListingCardPrice({ price, suffix }) {
  return (
    <span className="listing-card__price">
      <strong>{price}</strong>
      {suffix && <small>{suffix}</small>}
    </span>
  );
}

export function ListingCardAction({ children = 'View details' }) {
  return <span className="listing-card__action">{children}<i aria-hidden="true">↗</i></span>;
}

export const ListingCardFrame = ListingCard;
export const Rating = ListingCardRating;
export const Price = ListingCardPrice;
