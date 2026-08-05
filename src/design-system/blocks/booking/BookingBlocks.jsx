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

export function BookingRequestSummary({ title = 'Your request', object, rows = [], priceLabel = 'Estimated total', totalLabel = 'On request', note, status }) {
  const hasObject = Boolean(object?.name);
  return <Surface as="section" className={`ds-booking-request-summary ${hasObject ? 'ds-booking-request-summary--object' : 'ds-booking-request-summary--match'}`} padding="md" aria-label="Request summary">
    <h2 className="ds-booking-request-summary__heading">{title ?? t('configurator.title')}</h2>
    {hasObject ? <div className="ds-booking-request-summary__object">
      {object.image
        ? <img src={object.image} alt="" />
        : <span className="ds-booking-request-summary__object-fallback" aria-hidden="true">{object.name.slice(0, 1)}</span>}
      <div><small>{object.typeLabel ?? title}</small><h3>{object.name}</h3></div>
    </div> : null}
    <dl>{rows.filter((row) => row?.value !== undefined && row?.value !== null && row?.value !== '').map((row) => <div className={`${row.emphasis ? 'is-emphasis' : ''}${row.muted ? ' is-muted' : ''}`} key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    {totalLabel ? <div className="ds-booking-request-summary__total"><span>{priceLabel}</span><strong>{totalLabel}</strong></div> : null}
    {note ? <p className="ds-booking-request-summary__note">{note}</p> : null}
    {status ? <div className="ds-booking-request-summary__status" role="status">{status}</div> : null}
  </Surface>;
}
