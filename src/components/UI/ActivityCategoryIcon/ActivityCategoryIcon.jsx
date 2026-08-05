import { cn } from '../../../utils/cn';
import './ActivityCategoryIcon.scss';

/*
 * Line drawings of what an activity actually is — a paraglider, a snowmobile,
 * a skin track. The catalog groups read faster with the drawing in front of the
 * words, the same way the transfer cards lead with the body type.
 *
 * The artwork is drawn as a mask rather than an image, so a single black SVG
 * takes the colour of whatever badge it sits in. Every drawing is normalised to
 * the same square, so one size renders them all at the same scale.
 */

export const ACTIVITY_CATEGORIES = ['excursions', 'freeride', 'heliskiing', 'paragliding', 'ski-touring', 'snowmobile-tours'];

export function ActivityCategoryIcon({ group, className }) {
  if (!ACTIVITY_CATEGORIES.includes(group)) return null;
  return (
    <span
      className={cn('ui-activity-icon', className)}
      style={{ '--activity-icon-src': `url("/assets/activity-icons/${group}-v4.svg")` }}
      aria-hidden="true"
    />
  );
}
