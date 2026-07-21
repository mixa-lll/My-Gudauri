import { cn } from '../../../utils/cn';
import './StarRating.scss';

const STAR_SIZES = ['sm', 'md'];

function normalizeRating(value, max) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.min(Math.max(numericValue, 0), max);
}

export function StarRating({ value = 0, max = 5, size = 'sm', className, ariaLabel, decorative = false }) {
  if (!Number.isInteger(max) || max < 1) throw new Error('StarRating: max must be a positive integer.');
  if (!STAR_SIZES.includes(size)) throw new Error(`StarRating: unsupported size “${size}”.`);

  const normalizedValue = normalizeRating(value, max);
  const fill = `${(normalizedValue / max) * 100}%`;
  const stars = '★'.repeat(max);
  const accessibilityProps = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': ariaLabel ?? `${normalizedValue} out of ${max} stars` };

  return (
    <span
      className={cn('star-rating', `star-rating--${size}`, className)}
      style={{ '--star-rating-fill': fill }}
      {...accessibilityProps}
    >
      <span className="star-rating__empty" aria-hidden="true">{stars}</span>
      <span className="star-rating__filled" aria-hidden="true">{stars}</span>
    </span>
  );
}
