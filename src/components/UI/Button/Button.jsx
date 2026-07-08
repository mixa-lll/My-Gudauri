import { cn } from '../../../utils/cn';
import './Button.scss';

export function Button({
  children,
  className,
  variant = 'outline',
  size = 'md',
  iconLeft,
  iconRight,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
      {...rest}
    >
      {iconLeft ? <img className="ui-button__icon" src={iconLeft} alt="" aria-hidden="true" /> : null}
      <span>{children}</span>
      {iconRight ? <img className="ui-button__icon" src={iconRight} alt="" aria-hidden="true" /> : null}
    </button>
  );
}
