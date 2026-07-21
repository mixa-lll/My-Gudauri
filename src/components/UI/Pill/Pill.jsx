import { cn } from '../../../utils/cn';
import './Pill.scss';

/** @deprecated Use Badge for metadata and FilterChip for interactive filters. */
export function Pill({ as: Component = 'span', children, className, size = 'md', tone = 'light', icon, ...props }) {
  return (
    <Component {...props} className={cn('ui-pill', `ui-pill--${size}`, `ui-pill--${tone}`, className)}>
      {icon ? <img className="ui-pill__icon" src={icon} alt="" aria-hidden="true" /> : null}
      {children}
    </Component>
  );
}
