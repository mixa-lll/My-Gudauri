import { cn } from '../../../utils/cn';
import './Badge.scss';

export function Badge({ as: Component = 'span', children, className, size = 'md', tone = 'neutral', mediaOverlay = false, icon, ...props }) {
  return (
    <Component className={cn('ui-badge', `ui-badge--${size}`, `ui-badge--${tone}`, mediaOverlay && 'ui-badge--media-overlay', className)} {...props}>
      {icon ? <img className="ui-badge__icon" src={icon} alt="" aria-hidden="true" /> : null}
      {children}
    </Component>
  );
}
