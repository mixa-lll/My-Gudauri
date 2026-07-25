import { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import './FilterChip.scss';

export const FilterChip = forwardRef(function FilterChip({ children, selected = false, size = 'md', tone = 'primary', className, ...props }, ref) {
  if (!['primary', 'accent'].includes(tone)) throw new Error(`FilterChip: unsupported tone “${tone}”.`);
  return <button ref={ref} type="button" className={cn('ui-filter-chip', `ui-filter-chip--${size}`, `ui-filter-chip--${tone}`, selected && 'is-selected', className)} aria-pressed={selected} {...props}>{children}</button>;
});
