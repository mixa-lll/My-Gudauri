import { cn } from '../../../utils/cn';
import './HoverArrow.scss';

/**
 * The ↗ that reacts when its card is hovered: it flies off the top-right, then
 * re-enters from the bottom-left — the arrow never travels back the way it
 * left, which is what makes the motion read as "opens elsewhere" rather than a
 * nudge.
 *
 * Purely CSS. The reference drives this from JS with a chain of timeouts, but
 * as a keyframe it survives fast repeated hovers (the animation restarts
 * cleanly) and costs no listeners.
 *
 * Put `hover-card` on the ancestor that should trigger it — usually the whole
 * clickable card.
 *
 * variant 'pill'   filled circle, for the corner of a category tile
 *         'inline' bare glyph, for "View profile ↗" style links
 */
export function HoverArrow({ variant = 'inline', className, label }) {
  return (
    <span
      className={cn('hover-arrow', `hover-arrow--${variant}`, className)}
      aria-hidden={label ? undefined : 'true'}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      <i className="hover-arrow__glyph">↗</i>
    </span>
  );
}
