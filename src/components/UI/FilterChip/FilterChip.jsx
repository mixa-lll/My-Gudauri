import { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import './FilterChip.scss';

export const FilterChip = forwardRef(function FilterChip({ children, selected = false, size = 'md', className, ...props }, ref) {
  return <button ref={ref} type="button" className={cn('ui-filter-chip', `ui-filter-chip--${size}`, selected && 'is-selected', className)} aria-pressed={selected} {...props}>{children}</button>;
});
