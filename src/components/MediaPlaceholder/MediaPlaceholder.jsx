import { cn } from '../../utils/cn';
import './MediaPlaceholder.scss';

function getTone(label) {
  const value = Array.from(label ?? '').reduce((total, character) => total + character.charCodeAt(0), 0);
  return value % 4;
}
export function MediaPlaceholder({ label = 'Gudauri', className, compact = false }) {
  return (
    <div
      className={cn('media-placeholder', `media-placeholder--tone-${getTone(label)}`, compact && 'media-placeholder--compact', className)}
      role="img"
      aria-label={`${label} — photo coming soon`}
    >
      <span className="media-placeholder__sun" aria-hidden="true" />
      <span className="media-placeholder__ridge media-placeholder__ridge--back" aria-hidden="true" />
      <span className="media-placeholder__ridge media-placeholder__ridge--front" aria-hidden="true" />
      <span className="media-placeholder__brand">MY GUDAURI</span>
      <span className="media-placeholder__copy">
        <strong>{label}</strong>
        <small>Photo coming soon</small>
      </span>
    </div>
  );
}
