import { cloneElement, forwardRef, useId, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { useLanguage } from '../../../i18n/LanguageContext';
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

export const TimeField = forwardRef(function TimeField(props, ref) {
  return <Input ref={ref} type="time" {...props} />;
});

function dateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function dateFromKey(value) {
  const [year, month, day] = String(value ?? '').split('-').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(month, amount) {
  return new Date(month.getFullYear(), month.getMonth() + amount, 1);
}

function rangeDays(start, end) {
  if (!start || !end) return 0;
  return Math.round((dateFromKey(end) - dateFromKey(start)) / 86400000) + 1;
}

/**
 * A serialisable date-range control. The value contract intentionally uses
 * YYYY-MM-DD strings so it can be kept in a request draft without timezone
 * conversions: { start: '2026-02-12', end: '2026-02-15' }.
 */
export function DateRangeCalendar({
  id,
  label = 'Choose dates',
  value = {},
  onChange,
  min,
  max,
  locale,
  disabled = false,
}) {
  const { currentLanguage, t } = useLanguage();
  const activeLocale = locale ?? currentLanguage.intlLocale;
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const minDate = dateFromKey(min) ?? today;
  const maxDate = dateFromKey(max) ?? new Date(today.getFullYear() + 1, 11, 31);
  const [month, setMonth] = useState(() => monthStart(dateFromKey(value.start) ?? minDate));
  const [activeBoundary, setActiveBoundary] = useState('start');
  const start = value.start ?? '';
  const end = value.end ?? '';
  const visibleMonths = [month, shiftMonth(month, 1)];
  const weekDays = useMemo(() => {
    const monday = new Date(2026, 0, 5);
    return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(activeLocale, { weekday: 'short' }).format(new Date(2026, 0, 5 + index)));
  }, [activeLocale]);
  const selectedRangeLabel = start ? [start, end].filter(Boolean).map((key) => new Intl.DateTimeFormat(activeLocale, { day: 'numeric', month: 'long' }).format(dateFromKey(key))).join(' – ') : '';

  const selectDate = (nextDate) => {
    const next = dateKey(nextDate);
    if (activeBoundary === 'start' || !start) {
      onChange?.({ start: next, end: '' });
      setActiveBoundary('end');
      return;
    }
    onChange?.(next < start ? { start: next, end: start } : { start, end: next });
    setActiveBoundary('start');
  };

  return <section id={id} className="ui-date-range" aria-label={label}>
    <div className="ui-date-range__months">
      <Button className="ui-date-range__previous" type="button" variant="secondary" size="md" aria-label={t('calendar.previousMonth')} disabled={disabled || month <= monthStart(minDate)} onClick={() => setMonth((current) => shiftMonth(current, -1))}>‹</Button>
      {visibleMonths.map((visibleMonth) => {
        const firstWeekday = (visibleMonth.getDay() + 6) % 7;
        const totalDays = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
        const cells = [
          ...Array.from({ length: firstWeekday }, (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1 - firstWeekday)),
          ...Array.from({ length: totalDays }, (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1)),
        ];
        while (cells.length % 7 !== 0) cells.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), cells.length - firstWeekday + 1));
        return <section className="ui-date-range__month" key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`} aria-label={new Intl.DateTimeFormat(activeLocale, { month: 'long', year: 'numeric' }).format(visibleMonth)}>
          <h3>{new Intl.DateTimeFormat(activeLocale, { month: 'long', year: 'numeric' }).format(visibleMonth)}</h3>
          <div className="ui-date-range__weekdays" aria-hidden="true">{weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
          <div className="ui-date-range__grid">
            {cells.map((date, index) => {
              const key = dateKey(date);
              const outside = date.getMonth() !== visibleMonth.getMonth();
              const isDisabled = disabled || outside || date < minDate || date > maxDate;
              const selected = !outside && Boolean(start && key >= start && key <= (end || start));
              const edge = selected && (key === start || key === (end || start));
              const boundary = key === start ? ' is-start' : key === (end || start) ? ' is-end' : '';
              const weekEdge = `${index % 7 === 0 ? ' is-week-start' : ''}${index % 7 === 6 ? ' is-week-end' : ''}`;
              const isToday = key === dateKey(today);
              const dateLabel = new Intl.DateTimeFormat(activeLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
              return <button type="button" className={`ui-date-range__day${outside ? ' is-outside' : ''}${selected ? ' is-selected' : ''}${edge ? ' is-edge' : ''}${boundary}${weekEdge}${isToday ? ' is-today' : ''}`} key={key} disabled={isDisabled} aria-pressed={selected} aria-label={dateLabel} onClick={() => selectDate(date)}>{date.getDate()}</button>;
            })}
          </div>
        </section>;
      })}
      <Button className="ui-date-range__next" type="button" variant="secondary" size="md" aria-label={t('calendar.nextMonth')} disabled={disabled || shiftMonth(month, 1) >= monthStart(maxDate)} onClick={() => setMonth((current) => shiftMonth(current, 1))}>›</Button>
    </div>
    {selectedRangeLabel ? <p className="ui-date-range__hint">{t('calendar.rangeSelected', { range: selectedRangeLabel, days: rangeDays(start, end) || 1 })}</p> : <p className="ui-date-range__hint">{t('calendar.chooseRange')}</p>}
  </section>;
}

/**
 * Reusable per-day booking availability selector. Selection is stored by day
 * key, so request drafts can be serialised without converting local time.
 */
export function TimeSlotPicker({ days = [], slots = [], value = {}, onChange, disabled = false, label }) {
  const { t } = useLanguage();
  const toggleSlot = (dayId, slotId) => {
    const current = value[dayId] ?? [];
    const nextSlots = current.includes(slotId) ? current.filter((id) => id !== slotId) : [...current, slotId];
    onChange?.({ ...value, [dayId]: nextSlots });
  };

  return <fieldset className="ui-time-slot-picker" disabled={disabled}>
    <legend>{label ?? t('calendar.timePerDay')}</legend>
    <div className="ui-time-slot-picker__legend" aria-hidden="true"><span>{t('calendar.day')}</span>{slots.map((slot) => <span key={slot.id}>{slot.meta ?? slot.label}</span>)}</div>
    <div className="ui-time-slot-picker__rows">
      {days.map((day, index) => <div className="ui-time-slot-picker__row" key={day.id}>
        <div><strong>{t('calendar.dayNumber', { number: index + 1 })}</strong><small>{day.label}</small></div>
        <div>{slots.map((slot) => {
          const selected = (value[day.id] ?? []).includes(slot.id);
          return <button
            className={cn('ui-time-slot', selected && 'is-selected')}
            key={slot.id}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => toggleSlot(day.id, slot.id)}
          >{slot.label}</button>;
        })}</div>
      </div>)}
    </div>
    <p>{t('calendar.slotsHint')}</p>
  </fieldset>;
}

export function QuantityStepper({ value, min = 0, max = Infinity, step = 1, onChange, label = 'Quantity', disabled = false, variant = 'default' }) {
  if (!['default', 'booking'].includes(variant)) throw new Error(`QuantityStepper: unsupported variant “${variant}”.`);
  return <div className={`ui-quantity ui-quantity--${variant}`} role="group" aria-label={label}>
    <Button className="ui-quantity__button" variant="secondary" size="md" aria-label={`Decrease ${label}`} disabled={disabled || value <= min} onClick={() => onChange(Math.max(min, value - step))}><span aria-hidden="true">−</span></Button>
    <output aria-live="polite">{value}</output>
    <Button className="ui-quantity__button" variant="secondary" size="md" aria-label={`Increase ${label}`} disabled={disabled || value >= max} onClick={() => onChange(Math.min(max, value + step))}><span aria-hidden="true">+</span></Button>
  </div>;
}

export function FormSummary({ title = 'Please check the form', errors = [] }) {
  if (!errors.length) return null;
  return <section className="ui-form-summary" role="alert" aria-labelledby="form-summary-title"><h2 id="form-summary-title">{title}</h2><ul>{errors.map((error) => <li key={error.id ?? error.message}>{error.href ? <a href={error.href}>{error.message}</a> : error.message}</li>)}</ul></section>;
}
