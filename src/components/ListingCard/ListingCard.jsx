import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { MediaPlaceholder } from '../MediaPlaceholder/MediaPlaceholder';
import { Pill } from '../UI/Pill/Pill';
import './ListingCard.scss';

export function ListingCard({
  to,
  className,
  variant = 'default',
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

  return (
    <Link className={cn('listing-card', `listing-card--${variant}`, className)} to={to}>
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

export function ListingCardPill({ children, icon, className, title }) {
  return (
    <Pill className={cn('listing-card__pill', className)} size="sm" tone="glass" icon={icon} title={title}>
      {children}
    </Pill>
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
