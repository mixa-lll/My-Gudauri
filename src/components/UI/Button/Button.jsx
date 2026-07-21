import { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import './Button.scss';

export const Button = forwardRef(function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  loadingLabel = 'Loading',
  iconOnly = false,
  fullWidth = false,
  type = 'button',
  ...rest
}, ref) {
  const isDisabled = rest.disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, iconOnly && 'ui-button--icon-only', fullWidth && 'ui-button--full-width', className)}
      {...rest}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={iconOnly ? (rest['aria-label'] ?? (typeof children === 'string' ? children : undefined)) : rest['aria-label']}
    >
      {loading ? <span className="ui-button__spinner" aria-hidden="true" /> : iconLeft ? <img className="ui-button__icon" src={iconLeft} alt="" aria-hidden="true" /> : null}
      <span className={iconOnly ? 'ui-button__label--sr-only' : undefined}>{loading ? loadingLabel : children}</span>
      {!loading && iconRight ? <img className="ui-button__icon" src={iconRight} alt="" aria-hidden="true" /> : null}
    </button>
  );
});
