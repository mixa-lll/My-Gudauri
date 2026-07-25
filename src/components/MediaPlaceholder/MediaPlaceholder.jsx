import { cn } from '../../utils/cn';
import './MediaPlaceholder.scss';

const PLACEHOLDER_KINDS = ['generic', 'activity', 'instructor', 'rental', 'transfer', 'stay', 'service', 'place', 'editorial'];

const KIND_LABELS = {
  generic: 'Gudauri',
  activity: 'Mountain activity',
  instructor: 'Instructor',
  rental: 'Rental equipment',
  transfer: 'Mountain transfer',
  stay: 'Place to stay',
  service: 'Local service',
  place: 'Local place',
  editorial: 'Gudauri guide',
};

function normalizeKind(kind) {
  return PLACEHOLDER_KINDS.includes(kind) ? kind : 'generic';
}

export function MediaPlaceholder({ label = 'Gudauri', kind = 'generic', className, compact = false }) {
  const normalizedKind = normalizeKind(kind);
  const categoryLabel = KIND_LABELS[normalizedKind];
  return (
    <div
      className={cn('media-placeholder', `media-placeholder--${normalizedKind}`, compact && 'media-placeholder--compact', className)}
      role="img"
      aria-label={`${label} — ${categoryLabel.toLowerCase()} photo coming soon`}
    >
      <span className="media-placeholder__sun" aria-hidden="true" />
      <span className="media-placeholder__ridge media-placeholder__ridge--back" aria-hidden="true" />
      <span className="media-placeholder__ridge media-placeholder__ridge--front" aria-hidden="true" />
      <span className="media-placeholder__brand">MY GUDAURI · {categoryLabel}</span>
      <span className="media-placeholder__copy">
        <strong>{label}</strong>
        <small>Photo coming soon</small>
      </span>
    </div>
  );
}
