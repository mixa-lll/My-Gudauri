import { cn } from '../../../utils/cn';
import './Container.scss';

export function Container({ children, className }) {
  return <div className={cn('ui-container', className)}>{children}</div>;
}
