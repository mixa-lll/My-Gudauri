import { forwardRef, useId } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { Button } from '../Button/Button';
import './Core.scss';

export const Link = forwardRef(function Link({ to, href, children, className, external = false, ...props }, ref) {
  const content = <>{children}{external ? <span aria-hidden="true"> ↗</span> : null}</>;
  if (to) return <RouterLink ref={ref} className={cn('ui-link', className)} to={to} {...props}>{content}</RouterLink>;
  return <a ref={ref} className={cn('ui-link', className)} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...props}>{content}</a>;
});

export function Icon({ name, label, size = 'md', className }) {
  return <span className={cn('ui-icon', `ui-icon--${size}`, className)} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>{name}</span>;
}

export function Divider({ orientation = 'horizontal', className }) {
  return <span className={cn('ui-divider', `ui-divider--${orientation}`, className)} role="separator" aria-orientation={orientation} />;
}

export function Surface({ as: Component = 'div', tone = 'card', padding = 'md', className, children, ...props }) {
  return <Component className={cn('ui-surface', `ui-surface--${tone}`, `ui-surface--padding-${padding}`, className)} {...props}>{children}</Component>;
}

export function Notice({ tone = 'info', title, children, actions, className, role }) {
  const titleId = useId();
  return <section className={cn('ui-notice', `ui-notice--${tone}`, className)} role={role ?? (tone === 'danger' ? 'alert' : 'status')} aria-labelledby={title ? titleId : undefined}>
    <div>{title ? <h3 id={titleId}>{title}</h3> : null}<div>{children}</div></div>{actions ? <div className="ui-notice__actions">{actions}</div> : null}
  </section>;
}

export function Skeleton({ width = '100%', height = 16, radius = 'sm', label = 'Loading content', className }) {
  return <span className={cn('ui-skeleton', className)} style={{ width, height, borderRadius: `var(--radius-${radius})` }} role="status" aria-label={label} />;
}

function State({ kind, title, description, action, compact = false }) {
  return <section className={cn('ui-state', `ui-state--${kind}`, compact && 'ui-state--compact')} role={kind === 'error' ? 'alert' : 'status'}>
    <span className="ui-state__icon" aria-hidden="true">{kind === 'error' ? '!' : kind === 'loading' ? '…' : '○'}</span>
    <div><h3>{title}</h3>{description ? <p>{description}</p> : null}</div>{action ? <div>{action}</div> : null}
  </section>;
}

export const EmptyState = (props) => <State kind="empty" title="Nothing here yet" {...props} />;
export const LoadingState = (props) => <State kind="loading" title="Loading" {...props} />;
export const ErrorState = (props) => <State kind="error" title="Something went wrong" {...props} />;

export function Breadcrumbs({ items, label = 'Breadcrumbs' }) {
  return <nav className="ui-breadcrumbs" aria-label={label}><ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{index ? <span aria-hidden="true">/</span> : null}{item.to || item.href ? <Link to={item.to} href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

export function BackLink({ children = 'Back', ...props }) {
  return <Link className="ui-back-link" {...props}><span aria-hidden="true">←</span>{children}</Link>;
}

export function Pagination({ page, totalPages, onPageChange, getPageHref, label = 'Pagination' }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return <nav className="ui-pagination" aria-label={label}>
    <Button variant="ghost" size="md" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}><span aria-hidden="true">←</span> Previous</Button>
    <ol>{pages.map((item) => <li key={item}>{getPageHref ? <Link href={getPageHref(item)} aria-current={item === page ? 'page' : undefined}>{item}</Link> : <button type="button" className={item === page ? 'is-current' : ''} aria-current={item === page ? 'page' : undefined} onClick={() => onPageChange?.(item)}>{item}</button>}</li>)}</ol>
    <Button variant="ghost" size="md" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>Next <span aria-hidden="true">→</span></Button>
  </nav>;
}

export function Dialog({ trigger, title, description, children, actions }) {
  return <DialogPrimitive.Root>
    <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="ui-dialog__overlay" />
      <DialogPrimitive.Content className="ui-dialog__content">
        <header><DialogPrimitive.Title>{title}</DialogPrimitive.Title>{description ? <DialogPrimitive.Description>{description}</DialogPrimitive.Description> : null}</header>
        <div className="ui-dialog__body">{children}</div>{actions ? <footer>{actions}</footer> : null}
        <DialogPrimitive.Close asChild><Button className="ui-dialog__close" variant="ghost" aria-label="Close">×</Button></DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}
