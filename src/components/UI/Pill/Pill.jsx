import { cn } from '../../../utils/cn';
import './Pill.scss';

export function Pill({ children, className, size = 'md', tone = 'light', icon }) {
  return (
    <span className={cn('ui-pill', `ui-pill--${size}`, `ui-pill--${tone}`, className)}>
      {icon ? <img className="ui-pill__icon" src={icon} alt="" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
