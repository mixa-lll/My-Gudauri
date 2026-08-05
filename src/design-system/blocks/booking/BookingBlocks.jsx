import { useEffect, useId, useMemo, useState } from 'react';
import { Button, Dialog, FormField, Input, QuantityStepper, Select, Surface } from '../../../components';
import './BookingBlocks.scss';
import { useLanguage } from '../../../i18n/LanguageContext';

const numberFormatter = new Intl.NumberFormat('en');

function formatQuantity(field, value, short = false) {
  const number = Number(value) || 0;
  if (short && field.shortLabel) return `${number} ${number === 1 ? (field.shortSingularLabel ?? field.shortLabel) : field.shortLabel}`;
  const label = number === 1 ? (field.singularLabel ?? field.label) : field.label;
  return `${number} ${label.toLowerCase()}`;
}

/** `estimate` may return a plain total or the full quote from the pricing engine. */
function toQuote(result, basePrice) {
  if (result && typeof result === 'object') return result;
  return { total: Number(result ?? basePrice) || 0 };
}

const money = (amount) => numberFormatter.format(Math.round(amount));

/**
 * Why the total is what it is: base rate × units, the group surcharge on top,
 * and the volume discount taken off. The rows are additive, so a guest can read
 * the ladder rather than trust an opaque number.
 */
function getPriceBreakdown({ fields, values, basePrice, quote, t }) {
  if (!Number(basePrice) || !Number(quote.total)) return [];
  const labelFor = (id, units) => {
    const field = fields.find((item) => item.id === id);
    return field ? formatQuantity(field, units, true) : units;
  };

  if (!quote.dimensions) {
    // Legacy BookingWidget path: a bare total with no engine breakdown.
    const priceField = fields.find((field) => field.control === 'quantity' && field.affectsPrice);
    if (!priceField) return [];
    return [{ label: `${money(basePrice)} × ${formatQuantity(priceField, Number(values[priceField.id]) || 0, true)}`, value: money(quote.total) }];
  }

  const rows = [];
  const multiply = quote.dimensions.find((item) => item.mode === 'multiply');
  if (multiply) rows.push({ label: `${money(basePrice)} × ${labelFor(multiply.field, multiply.units)}`, value: money(quote.subtotal) });

  const surcharge = quote.dimensions.find((item) => item.mode === 'surcharge');
  if (surcharge && quote.groupAmount >= 1) {
    rows.push({ label: t('configurator.groupSurcharge', { group: labelFor(surcharge.field, surcharge.units) }), value: `+${money(quote.groupAmount)}` });
  }
  if (quote.discountAmount >= 1) {
    rows.push({ label: t('configurator.volumeDiscount', { percent: Math.round(quote.discountPercent) }), value: `−${money(quote.discountAmount)}`, saving: true });
  }
  return rows.length > 1 ? rows : rows.map((row) => ({ ...row, value: money(quote.total) }));
}

/** The line that makes “the more you book, the cheaper it gets” legible. */
function getUnitNote({ fields, quote, currency, t }) {
  if (!quote.dimensions || quote.discountAmount < 1) return '';
  const multiply = quote.dimensions.find((item) => item.mode === 'multiply');
  const field = multiply && fields.find((item) => item.id === multiply.field);
  if (!field || !quote.units) return '';
  const unit = field.shortSingularLabel ?? field.shortLabel ?? field.singularLabel ?? field.label;
  return t('configurator.unitPrice', { amount: money(quote.unitPrice), currency, unit });
}

function initialValues(fields, defaults = {}) {
  return { ...Object.fromEntries(fields.map((field) => [field.id, field.initial ?? ''])), ...defaults };
}

function EntryField({ field, value, onChange, disabled }) {
  if (field.control === 'quantity') {
    return <div className="ds-booking-configurator__quantity">
      <span className="ds-booking-configurator__quantity-value">{formatQuantity(field, value)}</span>
      <QuantityStepper
        label={field.label}
        value={Number(value)}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={disabled}
        variant="booking"
        onChange={(next) => onChange(field.id, next)}
      />
    </div>;
  }

  if (field.control === 'select') {
    return <FormField label={field.label} required={field.required}>
      <Select value={value} disabled={disabled} onChange={(event) => onChange(field.id, event.target.value)}>
        {field.options.map((option) => {
          const optionValue = option?.value ?? option;
          return <option value={optionValue} key={optionValue}>{option?.label ?? option}</option>;
        })}
      </Select>
    </FormField>;
  }

  return <FormField label={field.label} required={field.required}>
    <Input
      value={value}
      disabled={disabled}
      placeholder={field.placeholder}
      onChange={(event) => onChange(field.id, event.target.value)}
    />
  </FormField>;
}

function ConfiguratorForm({ className = '', object, objectName, availability, fields, values, disabled, loading, update, breakdown, unitNote, totalLabel, quantitySummary, priceLabel, entryNote, actionLabel, confirmationText, ready, onContinue }) {
  return <form className={`ds-booking-configurator__form ${className}`} onSubmit={(event) => { event.preventDefault(); if (ready) onContinue?.(values); }}>
    <div className="ds-booking-configurator__head">
      {object?.image ? <img src={object.image} alt="" /> : <span className="ds-booking-configurator__object-fallback" aria-hidden="true">{objectName.slice(0, 1)}</span>}
      <div><small>{availability ?? object?.typeLabel ?? 'Selected offer'}</small><h2>{objectName}</h2></div>
    </div>
    <div className="ds-booking-configurator__fields">
      {fields.map((field) => <EntryField field={field} value={values[field.id]} disabled={disabled || loading} onChange={update} key={field.id} />)}
    </div>
    {breakdown.length ? <dl className="ds-booking-configurator__breakdown">{breakdown.map((row) => <div className={row.saving ? 'is-saving' : undefined} key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl> : null}
    <div className="ds-booking-configurator__total"><strong>{totalLabel}</strong>{quantitySummary ? <span>for {quantitySummary}</span> : <span>{priceLabel}</span>}</div>
    {unitNote ? <p className="ds-booking-configurator__unit-note">{unitNote}</p> : null}
    {entryNote ? <p className="ds-booking-configurator__entry-note"><span aria-hidden="true">◷</span>{entryNote}</p> : null}
    <Button className="ds-booking-configurator__action" type="submit" size="lg" fullWidth disabled={disabled || !ready} loading={loading}>{actionLabel}</Button>
    <p className="ds-booking-configurator__note">{confirmationText}</p>
  </form>;
}

export function BookingConfigurator({
  id = 'booking-request',
  title,
  priceLabel,
  object,
  fields = [],
  basePrice,
  currency = 'GEL',
  availability,
  entryNote,
  confirmationText,
  defaultValues,
  estimate,
  actionLabel,
  disabled = false,
  loading = false,
  onValuesChange,
  onSummaryChange,
  onContinue,
}) {
  const { t } = useLanguage();
  const [values, setValues] = useState(() => initialValues(fields, defaultValues));
  const quote = useMemo(() => toQuote(estimate?.(values), basePrice), [basePrice, estimate, values]);
  const estimatedTotal = quote.total;
  const totalLabel = estimatedTotal ? `${numberFormatter.format(estimatedTotal)} ${currency}` : 'On request';
  const ready = fields.every((field) => !field.required || String(values[field.id] ?? '').trim());
  const breakdown = getPriceBreakdown({ fields, values, basePrice, quote, t });
  const unitNote = getUnitNote({ fields, quote, currency, t });
  const quantitySummary = fields.filter((field) => field.control === 'quantity').map((field) => formatQuantity(field, values[field.id], true)).join(' · ');
  const objectName = object?.name ?? title;

  const update = (fieldId, value) => {
    setValues((current) => {
      const next = { ...current, [fieldId]: value };
      onValuesChange?.(next);
      return next;
    });
  };

  useEffect(() => {
    onSummaryChange?.({ actionLabel, ready, totalLabel });
  }, [actionLabel, onSummaryChange, ready, totalLabel]);

  const formProps = {
    object,
    objectName,
    availability,
    fields,
    values,
    disabled,
    loading,
    update,
    breakdown,
    unitNote,
    totalLabel,
    quantitySummary,
    priceLabel: priceLabel ?? t('configurator.priceLabel'),
    entryNote,
    actionLabel: actionLabel ?? t('configurator.action'),
    confirmationText: confirmationText ?? t('configurator.confirmation'),
    ready,
    onContinue,
  };

  return <Surface as="aside" id={id} className="ds-booking-configurator" padding="md" aria-label={`Booking request for ${objectName}`}>
    <Dialog
      className="ds-booking-configurator__sheet"
      bodyClassName="ds-booking-configurator__sheet-body"
      title={objectName}
      description={availability ?? title}
      trigger={<button type="button" className="ds-booking-configurator__mobile-summary" disabled={disabled}>
        <span><strong>{totalLabel}</strong><small>{quantitySummary || priceLabel}</small></span>
        <span className="ds-booking-configurator__mobile-action" aria-hidden="true">{actionLabel}</span>
      </button>}
    >
      <ConfiguratorForm {...formProps} className="ds-booking-configurator__form--sheet" />
    </Dialog>
    <ConfiguratorForm {...formProps} className="ds-booking-configurator__form--desktop" />
  </Surface>;
}

const LEGACY_FIELDS = Object.freeze({
  instructor: [{ id: 'duration', label: 'Hours', control: 'quantity', min: 1, max: 8, step: 1, initial: 2 }, { id: 'participants', label: 'People', control: 'quantity', min: 1, max: 8, step: 1, initial: 1 }],
  activity: [{ id: 'participants', label: 'People', control: 'quantity', min: 1, max: 12, step: 1, initial: 1 }],
  rental: [{ id: 'days', label: 'Days', control: 'quantity', min: 1, max: 14, step: 1, initial: 1 }],
  transfer: [{ id: 'passengers', label: 'Passengers', control: 'quantity', min: 1, max: 16, step: 1, initial: 2 }, { id: 'pickup', label: 'Pickup point', control: 'text', initial: '', placeholder: 'Tbilisi airport', required: true }],
  stay: [{ id: 'nights', label: 'Nights', control: 'quantity', min: 1, max: 30, step: 1, initial: 2 }, { id: 'guests', label: 'Guests', control: 'quantity', min: 1, max: 12, step: 1, initial: 2 }],
});

const LEGACY_MULTIPLIER_FIELD = { instructor: 'duration', activity: 'participants', rental: 'days', transfer: null, stay: 'nights' };

export function BookingWidget({ category = 'instructor', price, ...props }) {
  const fields = LEGACY_FIELDS[category];
  if (!fields) throw new Error(`BookingWidget: unsupported category “${category}”.`);
  const multiplierField = LEGACY_MULTIPLIER_FIELD[category];
  return <BookingConfigurator
    fields={fields}
    basePrice={price}
    estimate={(values) => (Number(price) || 0) * (multiplierField ? Number(values[multiplierField]) || 1 : 1)}
    {...props}
  />;
}

export function StickyBookingWidget(props) {
  return <BookingWidget {...props} />;
}

export function BookingProgress({ steps = [], currentStep = 0, label = 'Booking progress' }) {
  return <nav className="ds-booking-progress" aria-label={label}>
    <ol>{steps.map((step, index) => <li className={index === currentStep ? 'is-current' : index < currentStep ? 'is-complete' : ''} key={step.id ?? step.label} aria-current={index === currentStep ? 'step' : undefined}>
      <span aria-hidden="true">{index < currentStep ? '✓' : index + 1}</span><b>{step.label}</b>
    </li>)}</ol>
  </nav>;
}

export function BookingFormSection({ title, description, children, actions, error, status = 'editing', compact = false, summary, onEdit, stepNumber }) {
  const { t } = useLanguage();
  const titleId = useId();
  if (compact) return <section className={`ds-booking-form-section ds-booking-form-section--${status} ds-booking-form-section--compact`} aria-labelledby={titleId}>
    <button type="button" className="ds-booking-form-section__compact-trigger" onClick={onEdit} disabled={!onEdit}>
      <strong id={titleId}>{stepNumber ? `${stepNumber}. ` : ''}{title ?? t('configurator.title')}</strong>
      <span>{summary ? <small>{summary}</small> : null}{onEdit ? <em>{t('booking.actions.edit')} ↗</em> : null}</span>
    </button>
  </section>;
  return <section className={`ds-booking-form-section ds-booking-form-section--${status}`} aria-labelledby={titleId}>
    <header><div><h2 id={titleId}>{stepNumber ? `${stepNumber}. ` : ''}{title ?? t('configurator.title')}</h2>{description ? <p>{description}</p> : null}</div></header>
    {error ? <p className="ds-booking-form-section__error" role="alert">{error}</p> : null}
    <div className="ds-booking-form-section__body">{children}</div>
    {actions ? <footer>{actions}</footer> : null}
  </section>;
}

export function BookingRequestSummary({ title = 'Your request', object, objectAction, legs = [], rows = [], breakdown = [], priceLabel = 'Estimated total', totalLabel = 'On request', note, status }) {
  const hasObject = Boolean(object?.name);
  return <Surface as="section" className={`ds-booking-request-summary ${hasObject ? 'ds-booking-request-summary--object' : 'ds-booking-request-summary--match'}`} padding="md" aria-label="Request summary">
    <h2 className="ds-booking-request-summary__heading">{title}</h2>
    {legs.map((leg) => <div className="ds-booking-request-summary__leg" key={leg.kicker ?? leg.title}>
      {leg.kicker ? <small>{leg.kicker}</small> : null}
      <strong>{leg.title}</strong>
      {leg.meta ? <span>{leg.meta}</span> : null}
    </div>)}
    <dl>{rows.filter((row) => row?.value !== undefined && row?.value !== null && row?.value !== '').map((row) => <div className={`${row.emphasis ? 'is-emphasis' : ''}${row.muted ? ' is-muted' : ''}`} key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    {hasObject ? <div className="ds-booking-request-summary__object">
      {object.image
        ? <img src={object.image} alt="" />
        : <span className="ds-booking-request-summary__object-fallback" aria-hidden="true">{object.name.slice(0, 1)}</span>}
      <div><h3>{object.name}</h3>{objectAction ?? (object.typeLabel ? <small>{object.typeLabel}</small> : null)}</div>
    </div> : null}
    {breakdown.length ? <div className="ds-booking-request-summary__breakdown">
      {breakdown.map((line) => <div key={line.label}><span>{line.label}</span><b>{line.value}</b></div>)}
    </div> : null}
    {totalLabel ? <div className="ds-booking-request-summary__total"><span>{priceLabel}</span><strong>{totalLabel}</strong></div> : null}
    {note ? <p className="ds-booking-request-summary__note">{note}</p> : null}
    {status ? <div className="ds-booking-request-summary__status" role="status">{status}</div> : null}
  </Surface>;
}

/*
 * Transfer request blocks.
 *
 * The flow asks "where and when" first and keeps every address, flight number
 * and add-on optional in a later step, because a guest who has not booked their
 * hotel yet must still be able to send a request. These blocks carry that:
 * a journey header that names and reverses the two ends, a per-end detail block
 * whose fields follow the kind of place chosen, an option grid the operator
 * prices later, and the confirmation panel.
 */

function PointGlyph({ kind }) {
  if (kind === 'airport') return <svg viewBox="0 0 24 24" aria-hidden="true" className="ds-booking-glyph"><path d="M12 3c.8 0 1.2.8 1.2 1.8v4.3l7 3.9v1.7l-7-2.1v3.7l2.3 1.7v1.3L12 19l-3.5 1.3v-1.3l2.3-1.7v-3.7l-7 2.1v-1.7l7-3.9V4.8C10.8 3.8 11.2 3 12 3z" /></svg>;
  if (kind === 'city') return <svg viewBox="0 0 24 24" aria-hidden="true" className="ds-booking-glyph ds-booking-glyph--stroke"><path d="M3 21V9.5L9 6v15M9 21h12V13h-6M13 17h1.5M17 17h1.5M13 9.5h5.5M5.5 12.5h1M5.5 16.5h1" /></svg>;
  if (kind === 'hotel') return <svg viewBox="0 0 24 24" aria-hidden="true" className="ds-booking-glyph ds-booking-glyph--stroke"><path d="M3.5 18v-6.5a2 2 0 012-2h8a3.5 3.5 0 013.5 3.5v5M3.5 15h13.5M20.5 18v-3.5M6.5 9.5V7h11v2.5" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="ds-booking-glyph ds-booking-glyph--stroke"><path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15 12 21 12 21z" /><circle cx="12" cy="10.3" r="2.3" /></svg>;
}

function LockGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="ds-booking-glyph ds-booking-glyph--stroke"><rect x="5" y="10.5" width="14" height="9" rx="2" /><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" /></svg>;
}

function SwapGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="ds-booking-glyph ds-booking-glyph--stroke"><path d="M4 9h15l-3.5-3.5M20 15H5l3.5 3.5" /></svg>;
}

export function BookingJourneyHeader({ fromLabel = 'Departure point', toLabel = 'Arrival point', origin, destination, hint, swapLabel = 'Swap direction', onSwap }) {
  if (!origin || !destination) throw new Error('BookingJourneyHeader: origin and destination are required.');
  return <section className="ds-booking-journey" aria-label={`${origin} → ${destination}`}>
    <div className="ds-booking-journey__board">
      <div className="ds-booking-journey__end">
        <span><s aria-hidden="true">A</s>{fromLabel}</span>
        <div className="ds-booking-journey__place">{origin}<LockGlyph /></div>
      </div>
      {onSwap
        ? <button className="ds-booking-journey__swap" type="button" onClick={onSwap} aria-label={swapLabel} title={swapLabel}><SwapGlyph /></button>
        : <span className="ds-booking-journey__swap ds-booking-journey__swap--static" aria-hidden="true">→</span>}
      <div className="ds-booking-journey__end">
        <span><s aria-hidden="true">B</s>{toLabel}</span>
        <div className="ds-booking-journey__place">{destination}<LockGlyph /></div>
      </div>
    </div>
    {hint ? <p className="ds-booking-journey__hint">{hint}</p> : null}
  </section>;
}

/**
 * One end of the journey. The tiles say what kind of place it is; the field
 * underneath asks for the single detail that kind needs, and the checkbox lets
 * the guest defer it without blocking the request.
 */
export function BookingPointDetails({ badge, title, question, options = [], value, onChange, children }) {
  return <section className="ds-booking-point">
    <header className="ds-booking-point__head">
      <span className="ds-booking-point__pin" aria-hidden="true"><PointGlyph kind="spot" /></span>
      <div><b>{badge ? `${badge} · ` : ''}{title}</b>{question ? <p>{question}</p> : null}</div>
    </header>
    <div className="ds-booking-point__tiles" role="radiogroup" aria-label={question ?? title}>
      {options.map((option) => {
        const selected = option.id === value;
        return <button
          type="button"
          role="radio"
          aria-checked={selected}
          className={`ds-booking-point__tile${selected ? ' is-selected' : ''}`}
          key={option.id}
          onClick={() => onChange?.(option.id)}
        >
          <PointGlyph kind={option.kind ?? option.id} />
          <span><b>{option.label}</b>{option.hint ? <small>{option.hint}</small> : null}</span>
        </button>;
      })}
    </div>
    {children ? <div className="ds-booking-point__reveal">{children}</div> : null}
  </section>;
}

export function BookingOptionCards({ label, items = [], value = {}, onChange }) {
  const toggle = (slug) => onChange?.({ ...value, [slug]: value[slug] ? 0 : 1 });
  return <fieldset className="ds-booking-options">
    {label ? <legend>{label}</legend> : null}
    <div className="ds-booking-options__grid">
      {items.map((item) => {
        const selected = Boolean(value[item.slug]);
        return <button
          type="button"
          aria-pressed={selected}
          className={`ds-booking-options__card${selected ? ' is-selected' : ''}`}
          key={item.slug}
          onClick={() => toggle(item.slug)}
        >
          <span className="ds-booking-options__icon" aria-hidden="true"><PointGlyph kind={item.glyph ?? 'spot'} /></span>
          <span><b>{item.label}</b>{item.priceLabel ? <small>{item.priceLabel}</small> : null}</span>
        </button>;
      })}
    </div>
  </fieldset>;
}

/** The confirmation screen: a reference to quote, and what happens next. */
export function BookingRequestSent({ title, requestCode, referenceLabel, copyLabel = 'Copy', copiedLabel = 'Copied', saveNote, nextTitle, steps = [], action }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    globalThis.navigator?.clipboard?.writeText?.(requestCode);
    setCopied(true);
  };
  return <Surface as="section" className="ds-booking-sent" padding="lg" aria-label={title}>
    <span className="ds-booking-sent__mark" aria-hidden="true">✓</span>
    <h2>{title}</h2>
    {requestCode ? <>
      <small className="ds-booking-sent__reference">{referenceLabel}</small>
      <div className="ds-booking-sent__code">
        <strong>{requestCode}</strong>
        <Button type="button" variant="secondary" size="sm" onClick={copy}>{copied ? copiedLabel : copyLabel}</Button>
      </div>
      {saveNote ? <p className="ds-booking-sent__note">{saveNote}</p> : null}
    </> : null}
    {steps.length ? <div className="ds-booking-sent__next">
      <h3>{nextTitle}</h3>
      <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
    </div> : null}
    {action ? <div className="ds-booking-sent__action">{action}</div> : null}
  </Surface>;
}
