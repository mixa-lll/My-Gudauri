import { cloneElement, forwardRef, useId } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../Button/Button';
import './Forms.scss';

export function FieldMessage({ children, tone = 'help', id }) {
  return <p className={cn('ui-field-message', `ui-field-message--${tone}`)} id={id}>{children}</p>;
}

export function FormField({ label, hint, error, success, required = false, children, className }) {
  const generatedId = useId();
  const controlId = children.props.id ?? generatedId;
  const message = error ?? success ?? hint;
  const messageId = message ? `${controlId}-message` : undefined;
  const state = error ? 'error' : success ? 'success' : 'default';
  return <div className={cn('ui-form-field', `ui-form-field--${state}`, className)}>
    <label htmlFor={controlId}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
    {cloneElement(children, { id: controlId, required, 'aria-invalid': Boolean(error), 'aria-describedby': messageId, 'data-field-state': state })}
    {message ? <FieldMessage id={messageId} tone={error ? 'error' : success ? 'success' : 'help'}>{message}</FieldMessage> : null}
  </div>;
}

export const Input = forwardRef(function Input({ className, loading = false, ...props }, ref) {
  return <span className={cn('ui-control-wrap', loading && 'is-loading')}><input ref={ref} className={cn('ui-control', className)} {...props} />{loading ? <span className="ui-control-spinner" aria-hidden="true" /> : null}</span>;
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn('ui-control ui-textarea', className)} {...props} />;
});

export const Select = forwardRef(function Select({ children, className, ...props }, ref) {
  return <select ref={ref} className={cn('ui-control ui-select', className)} {...props}>{children}</select>;
});

export const Checkbox = forwardRef(function Checkbox({ label, className, ...props }, ref) {
  return <label className={cn('ui-choice', className)}><input ref={ref} type="checkbox" {...props} /><span aria-hidden="true" /><b>{label}</b></label>;
});

export const Radio = forwardRef(function Radio({ label, className, ...props }, ref) {
  return <label className={cn('ui-choice ui-choice--radio', className)}><input ref={ref} type="radio" {...props} /><span aria-hidden="true" /><b>{label}</b></label>;
});

export const DateField = forwardRef(function DateField(props, ref) {
  return <Input ref={ref} type="date" {...props} />;
});

export function QuantityStepper({ value, min = 0, max = Infinity, onChange, label = 'Quantity', disabled = false }) {
  return <div className="ui-quantity" role="group" aria-label={label}>
    <Button iconOnly variant="secondary" size="md" disabled={disabled || value <= min} onClick={() => onChange(Math.max(min, value - 1))}>Decrease {label}</Button>
    <output aria-live="polite">{value}</output>
    <Button iconOnly variant="secondary" size="md" disabled={disabled || value >= max} onClick={() => onChange(Math.min(max, value + 1))}>Increase {label}</Button>
  </div>;
}

export function FormSummary({ title = 'Please check the form', errors = [] }) {
  if (!errors.length) return null;
  return <section className="ui-form-summary" role="alert" aria-labelledby="form-summary-title"><h2 id="form-summary-title">{title}</h2><ul>{errors.map((error) => <li key={error.id ?? error.message}>{error.href ? <a href={error.href}>{error.message}</a> : error.message}</li>)}</ul></section>;
}
