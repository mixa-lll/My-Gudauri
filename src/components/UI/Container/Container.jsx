import { cn } from '../../../utils/cn';
import './Container.scss';

export function Container({ as: Component = 'div', children, className, width = 'wide', ...props }) {
  return <Component className={cn('ui-container', `ui-container--${width}`, className)} {...props}>{children}</Component>;
}
