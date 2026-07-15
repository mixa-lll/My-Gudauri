import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { MediaPlaceholder } from '../MediaPlaceholder/MediaPlaceholder';
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
  eyebrow,
  title,
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
        {eyebrow && <div className="listing-card__eyebrow">{eyebrow}</div>}
        {createElement(`h${headingLevel}`, { className: 'listing-card__title' }, title)}
        {description && <p className="listing-card__description">{description}</p>}
        {footer && <div className="listing-card__footer">{footer}</div>}
      </div>
    </Link>
  );
}

export function ListingCardPill({ children, icon, className, title }) {
  return (
    <span className={cn('listing-card__pill', className)} title={title}>
      {icon && <img src={icon} alt="" aria-hidden="true" />}
      {children}
    </span>
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
