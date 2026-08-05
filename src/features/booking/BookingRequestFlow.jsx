import { useEffect, useMemo, useState } from 'react';
import {
  BookingExtrasPicker,
  BookingFlow,
  BookingFormSection,
  BookingJourneyHeader,
  BookingPickupChoice,
  BookingRequestSummary,
  Button,
  DateField,
  DateRangeCalendar,
  FilterChip,
  FormField,
  Input,
  Notice,
  QuantityStepper,
  Select,
  Textarea,
  TimeField,
  TimeSlotPicker,
} from '../../design-system';
import { useLanguage } from '../../i18n/LanguageContext';
import { createInitialBookingAnswers, estimateBookingTotal, formatBookingPrice, optionKey } from './contracts';
import './BookingRequestFlow.scss';

const TIME_SLOTS = [
  { value: 'morning', label: '10:00–12:00', meta: 'slot 1 · 2h', hours: 2 },
  { value: 'midday', label: '12:30–14:30', meta: 'slot 2 · 2h', hours: 2 },
  { value: 'afternoon', label: '15:00–17:00', meta: 'slot 3 · 2h', hours: 2 },
];
const MESSENGERS = ['WhatsApp', 'Telegram', 'Viber'];
const MATCH_OPTIONS = Object.freeze({
  companyType: ['Family', 'Friends', 'Solo'],
  languages: ['Russian', 'English', 'Georgian'],
  activities: ['Ski', 'Snowboard', 'Freeride', 'Sightseeing'],
  pace: ['Relaxed', 'Medium', 'Adrenaline'],
  skillLevel: ['Beginner', 'Intermediate', 'Advanced'],
  budget: ['Economy', 'Mid-range', 'Premium'],
});

function toDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function formatDateRange(range, locale = 'en-GB') {
  if (!range?.start) return '';
  const start = new Date(`${range.start}T12:00:00`);
  const end = range.end ? new Date(`${range.end}T12:00:00`) : start;
  const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' });
  if (range.start === range.end || !range.end) return formatter.format(start);
  if (start.getMonth() === end.getMonth()) return `${start.getDate()}–${formatter.format(end)}`;
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function datesInRange(range) {
  if (!range?.start) return [];
  const start = new Date(`${range.start}T12:00:00`);
  const end = new Date(`${range.end || range.start}T12:00:00`);
  const dates = [];
  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) dates.push(toDateKey(current));
  return dates;
}

function formatShortDate(dateKey, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(`${dateKey}T12:00:00`));
}

function matchHours(answers) {
  const selected = Object.values(answers.timeSlotsByDate ?? {}).flat();
  return selected.reduce((total, slotId) => total + (TIME_SLOTS.find((slot) => slot.value === slotId)?.hours ?? 0), 0);
}

function optionLabel(t, value) {
  return t(`booking.options.${optionKey(value)}`);
}

function toggleList(values, item) {
  return values.includes(item) ? values.filter((value) => value !== item) : [...values, item];
}

function ChoiceGroup({ label, options, value, onChange, multiple = false, variant = 'chips', tone = 'primary' }) {
  const { t } = useLanguage();
  return <fieldset className={`booking-request-flow__choice-group booking-request-flow__choice-group--${variant}`}>
    <legend>{label}</legend>
    <div>{options.map((option) => {
      const selected = multiple ? value.includes(option) : value === option;
      return <FilterChip key={option} tone={tone} selected={selected} onClick={() => onChange(multiple ? toggleList(value, option) : option)}>{optionLabel(t, option)}</FilterChip>;
    })}</div>
  </fieldset>;
}

function groupCounts(answers, fallbackToParticipants = false) {
  const fallbackAdults = fallbackToParticipants ? Number(answers.participants) || 1 : 1;
  const adults = Math.max(1, Number(answers.adultsCount) || fallbackAdults);
  const children = Math.max(0, Number(answers.childrenCount) || 0);
  return { adults, children, total: adults + children };
}

function GroupDetailsFields({ answers, update, maxParticipants, maxAdults = 10, syncParticipants = false, includeSkillLevel = false, levelField = 'skillLevel' }) {
  const { t } = useLanguage();
  const { adults, children } = groupCounts(answers, syncParticipants);
  const setCounts = (nextAdults, nextChildren) => {
    update('adultsCount', nextAdults);
    update('childrenCount', nextChildren);
    if (syncParticipants) update('participants', nextAdults + nextChildren);
  };
  const adultMaximum = Math.max(1, Math.min(maxAdults, maxParticipants - children));
  const childMaximum = Math.max(0, Math.min(adults, maxParticipants - adults));

  return <>
    <ChoiceGroup label={t('booking.group.whoIsComing')} options={MATCH_OPTIONS.companyType} value={answers.companyType ?? 'Family'} onChange={(value) => update('companyType', value)} variant="segmented" />
    <div className="booking-request-flow__counter-grid">
      <div className="booking-request-flow__counter-field"><span>{t('booking.group.adults')}</span><div><p><strong>{adults}</strong><small>{t('booking.group.adultsShort')}</small></p><QuantityStepper variant="booking" label={t('booking.group.adults')} value={adults} min={1} max={adultMaximum} onChange={(value) => setCounts(value, Math.min(children, value, maxParticipants - value))} /></div></div>
      <div className="booking-request-flow__counter-field"><span>{t('booking.group.kids')}</span><div><p><strong>{children}</strong><small>{t('booking.group.kidsShort')}</small></p><QuantityStepper variant="booking" label={t('booking.group.kids')} value={children} min={0} max={childMaximum} onChange={(value) => setCounts(adults, value)} /></div></div>
    </div>
    <ChoiceGroup label={t('booking.group.instructorLanguage')} options={MATCH_OPTIONS.languages} value={answers.languages ?? []} multiple onChange={(values) => update('languages', values)} />
    {includeSkillLevel ? <ChoiceGroup label={t('booking.group.skillLevel')} options={MATCH_OPTIONS.skillLevel} value={answers[levelField] ?? 'Beginner'} onChange={(value) => update(levelField, value)} /> : null}
  </>;
}

export function InstructorParticipantsStep({ answers, update, definition, error, actions, stepNumber }) {
  const { t } = useLanguage();
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.instructorParticipants.title')} description={t('booking.steps.instructorParticipants.description')} error={error} actions={actions}>
    <GroupDetailsFields answers={answers} update={update} maxParticipants={definition.fields.participants.max} syncParticipants includeSkillLevel levelField="level" />
  </BookingFormSection>;
}

export function InquiryDetailsStep({ answers, update, definition, error, actions, stepNumber }) {
  const { t } = useLanguage();
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.inquiryDetails.title')} description={t('booking.steps.inquiryDetails.description')} error={error} actions={actions}>
    <FormField label={t('booking.fields.preferredDate')} required><DateField value={answers.date ?? ''} onChange={(event) => update('date', event.target.value)} /></FormField>
    {Object.values(definition.fields).filter((field) => !definition.entryFields.includes(field.id)).map((field) => <FormField label={field.label} required={field.required} key={field.id}><Input required={field.required} placeholder={field.placeholder} value={answers[field.id] ?? ''} onChange={(event) => update(field.id, event.target.value)} /></FormField>)}
    <FormField label={t('booking.fields.additionalDetails')}><Textarea value={answers.details ?? ''} onChange={(event) => update('details', event.target.value)} /></FormField>
  </BookingFormSection>;
}

export function InstructorDatesStep({ answers, update, definition, error, actions, stepNumber }) {
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.intlLocale;
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const [timeExpanded, setTimeExpanded] = useState(true);
  const selectedDays = datesInRange(answers.dateRange);
  const isSpecificInstructor = definition.presentation !== 'operator-match';
  const setDateRange = (range) => {
    const validDays = new Set(datesInRange(range));
    const timeSlotsByDate = Object.fromEntries(Object.entries(answers.timeSlotsByDate ?? {}).filter(([day]) => validDays.has(day)));
    update('dateRange', range);
    update('timeSlotsByDate', timeSlotsByDate);
    update('timePreferences', [...new Set(Object.values(timeSlotsByDate).flat())]);
  };
  const setTimeSlots = (timeSlotsByDate) => {
    update('timeSlotsByDate', timeSlotsByDate);
    update('timePreferences', [...new Set(Object.values(timeSlotsByDate).flat())]);
    const selectedHours = Object.values(timeSlotsByDate).flat().length * 2;
    if (isSpecificInstructor && selectedHours) update('duration', selectedHours);
  };
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.instructorDates.title')} description={t(isSpecificInstructor ? 'booking.steps.instructorDates.descriptionSpecific' : 'booking.steps.instructorDates.descriptionMatch')} error={error} actions={actions}>
    <DateRangeCalendar label={t('booking.fields.preferredLessonDates')} value={answers.dateRange} min={toDateKey(new Date())} max={toDateKey(maxDate)} onChange={setDateRange} />
    {selectedDays.length ? <div className="booking-request-flow__time-section">
      {timeExpanded ? <>
        <div className="booking-request-flow__time-actions"><Button type="button" variant="ghost" onClick={() => setTimeExpanded(false)}>− {t('booking.actions.collapse')}</Button></div>
        <TimeSlotPicker label={t(isSpecificInstructor ? 'booking.fields.timePerDay' : 'booking.fields.timePerDayOptional')} days={selectedDays.map((day) => ({ id: day, label: formatShortDate(day, currentLanguage.intlLocale) }))} slots={TIME_SLOTS.map(({ value, label }, index) => ({ id: value, label, meta: t('booking.fields.slotMeta', { index: index + 1 }) }))} value={answers.timeSlotsByDate ?? {}} onChange={setTimeSlots} />
      </> : <Button className="booking-request-flow__add-time" type="button" variant="secondary" onClick={() => setTimeExpanded(true)}>+ {t('booking.actions.specifyTime')} {!isSpecificInstructor ? <small>{t('booking.actions.optional')}</small> : null}</Button>}
    </div> : null}
  </BookingFormSection>;
}

export function InstructorMatchCompanyStep({ answers, update, error, actions, stepNumber }) {
  const { t } = useLanguage();
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.matchCompany.title')} description={t('booking.steps.matchCompany.description')} error={error} actions={actions}>
    <GroupDetailsFields answers={answers} update={update} maxParticipants={20} />
  </BookingFormSection>;
}

export function InstructorMatchPreferencesStep({ answers, update, error, actions, stepNumber }) {
  const { t } = useLanguage();
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.matchPreferences.title')} description={t('booking.steps.matchPreferences.description')} error={error} actions={actions}>
    <ChoiceGroup label={t('booking.fields.activity')} options={MATCH_OPTIONS.activities} value={answers.activities ?? []} multiple onChange={(values) => update('activities', values)} />
    <ChoiceGroup label={t('booking.fields.pace')} options={MATCH_OPTIONS.pace} value={answers.pace} onChange={(value) => update('pace', value)} />
    <ChoiceGroup label={t('booking.fields.skillLevel')} options={MATCH_OPTIONS.skillLevel} value={answers.skillLevel} onChange={(value) => update('skillLevel', value)} />
    <ChoiceGroup label={t('booking.fields.budget')} options={MATCH_OPTIONS.budget} value={answers.budget} onChange={(value) => update('budget', value)} />
    <FormField label={t('booking.fields.anythingElse')} hint={t('booking.fields.anythingElseHint')}><Textarea rows="3" value={answers.notes ?? ''} onChange={(event) => update('notes', event.target.value)} placeholder={t('booking.fields.anythingElsePlaceholder')} /></FormField>
  </BookingFormSection>;
}

/*
 * Transfer helpers.
 *
 * A route's meeting points always describe its city end. Which end that is
 * depends on the direction the guest chose, so everything below resolves the
 * journey first and only then decides which question to ask.
 */
function transferJourney(offer, answers) {
  const route = offer?.route ?? {};
  const anchor = route.destination || 'Gudauri';
  const city = route.origin || '';
  const fromGudauri = answers.direction === 'From Gudauri';
  return {
    fromGudauri,
    anchor,
    city,
    origin: fromGudauri ? anchor : city,
    destination: fromGudauri ? city : anchor,
    points: route.pickupPoints ?? [],
    duration: route.duration,
  };
}

function defaultPoint(points) {
  return points.find((point) => point.isDefault) ?? points[0] ?? null;
}

function activePoint(offer, answers) {
  const points = offer?.route?.pickupPoints ?? [];
  return points.find((point) => String(point.id) === String(answers.pointId)) ?? defaultPoint(points);
}

function selectedExtras(offer, answers) {
  return (offer?.extras ?? [])
    .map((item) => ({ ...item, quantity: Number(answers.extras?.[item.slug]) || 0 }))
    .filter((item) => item.quantity > 0);
}

function extrasSummary(offer, answers) {
  return selectedExtras(offer, answers).map((item) => (item.maxQuantity > 1 && item.quantity > 1 ? `${item.label} × ${item.quantity}` : item.label)).join(', ');
}

export function TransferRouteStep({ answers, update, offer, error, actions, stepNumber }) {
  const { t } = useLanguage();
  const journey = transferJourney(offer, answers);
  const point = activePoint(offer, answers);

  // The guest can land here from a card with no point chosen yet; seed the
  // route's default so the radio group and the stored answer never disagree.
  useEffect(() => {
    if (!answers.pointId && point) selectPoint(point);
  }, [point?.id]);

  function selectPoint(next) {
    update('pointId', next.id);
    update('pointKind', next.kind);
    update('pointLabel', next.label);
  }

  const swapDirection = () => update('direction', journey.fromGudauri ? 'To Gudauri' : 'From Gudauri');
  const cityQuestion = t(journey.fromGudauri ? 'booking.transfer.dropoffQuestion' : 'booking.transfer.pickupQuestion', { city: journey.city });
  const gudauriLabel = t(journey.fromGudauri ? 'booking.transfer.gudauriPickup' : 'booking.transfer.gudauriDropoff');

  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.transferRoute.title')} description={t('booking.steps.transferRoute.description')} error={error} actions={actions}>
    <BookingJourneyHeader
      fromLabel={t('booking.transfer.from')}
      toLabel={t('booking.transfer.to')}
      origin={journey.origin}
      destination={journey.destination}
      meta={journey.duration}
      note={t('booking.transfer.samePrice')}
      swapLabel={t('booking.transfer.swap')}
      onSwap={swapDirection}
    />
    <BookingPickupChoice
      label={cityQuestion}
      options={journey.points.map((item) => ({ id: item.id, kind: item.kind, label: item.label, hint: item.hint }))}
      value={point?.id ?? ''}
      onChange={(id) => {
        const next = journey.points.find((item) => String(item.id) === String(id));
        if (next) selectPoint(next);
      }}
    />
    {point?.requiresFlight ? <FormField label={t(journey.fromGudauri ? 'booking.transfer.flightDeparture' : 'booking.transfer.flightArrival')} hint={t('booking.transfer.flightHint')}>
      <Input value={answers.flightNumber ?? ''} placeholder="A9 641" onChange={(event) => update('flightNumber', event.target.value)} />
    </FormField> : null}
    {point?.requiresAddress ? <FormField label={t('booking.transfer.cityAddress', { city: journey.city })} required>
      <Input value={answers.cityAddress ?? ''} onChange={(event) => update('cityAddress', event.target.value)} />
    </FormField> : null}
    {point && !point.requiresFlight && !point.requiresAddress ? <FormField label={t('booking.transfer.meetingNotes')} required>
      <Input value={answers.meetingNotes ?? ''} onChange={(event) => update('meetingNotes', event.target.value)} />
    </FormField> : null}
    <FormField label={gudauriLabel} required hint={t('booking.transfer.gudauriHint')}>
      <Input value={answers.gudauriAddress ?? ''} onChange={(event) => update('gudauriAddress', event.target.value)} />
    </FormField>
  </BookingFormSection>;
}

export function TransferTripStep({ answers, update, definition, offer, error, actions, stepNumber }) {
  const { t } = useLanguage();
  const journey = transferJourney(offer, answers);
  const point = activePoint(offer, answers);
  const isFlight = Boolean(point?.requiresFlight);
  const fields = definition.fields;
  const counters = [fields.passengers, fields.suitcases, fields.skis];

  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.transferTrip.title')} description={t('booking.steps.transferTrip.description')} error={error} actions={actions}>
    <div className="booking-request-flow__field-grid">
      <FormField label={t(isFlight && !journey.fromGudauri ? 'booking.transfer.arrivalDate' : 'booking.transfer.date')} required>
        <DateField value={answers.date ?? ''} min={toDateKey(new Date())} onChange={(event) => update('date', event.target.value)} />
      </FormField>
      <FormField label={t(isFlight && !journey.fromGudauri ? 'booking.transfer.arrivalTime' : 'booking.transfer.time')} hint={t(isFlight ? 'booking.transfer.timeHintFlight' : 'booking.transfer.timeHint')}>
        <TimeField value={answers.time ?? ''} onChange={(event) => update('time', event.target.value)} />
      </FormField>
    </div>
    <div className="booking-request-flow__counter-grid">
      {counters.map((field) => <div className="booking-request-flow__counter-field" key={field.id}>
        <span>{field.label}</span>
        <div>
          <p><strong>{Number(answers[field.id]) || 0}</strong></p>
          <QuantityStepper variant="booking" label={field.label} value={Number(answers[field.id]) || 0} min={field.min} max={field.max} onChange={(value) => update(field.id, value)} />
        </div>
      </div>)}
    </div>
    {offer?.extras?.length ? <BookingExtrasPicker
      label={t('booking.transfer.extrasLabel')}
      description={t('booking.transfer.extrasDescription')}
      items={offer.extras.map((item) => ({
        ...item,
        priceLabel: item.priceAmount > 0 ? `${item.priceAmount} ${item.currency}` : t('booking.transfer.free'),
        addLabel: t('booking.transfer.addExtra'),
        selectedLabel: t('booking.transfer.extraAdded'),
      }))}
      value={answers.extras ?? {}}
      onChange={(value) => update('extras', value)}
    /> : null}
    <FormField label={t('booking.fields.additionalDetails')}>
      <Textarea rows="3" value={answers.comment ?? ''} onChange={(event) => update('comment', event.target.value)} placeholder={t('booking.transfer.commentPlaceholder')} />
    </FormField>
  </BookingFormSection>;
}

export function ContactDetailsStep({ answers, update, definition, error, actions, stepNumber }) {
  const { t } = useLanguage();
  const isMatch = definition.presentation === 'operator-match';
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.contact.title')} description={t(isMatch ? 'booking.steps.contact.descriptionMatch' : 'booking.steps.contact.description')} error={error} actions={actions}>
    <div className="booking-request-flow__field-grid">
      <FormField label={t('booking.fields.name')} required><Input autoComplete="name" value={answers.contactName ?? ''} onChange={(event) => update('contactName', event.target.value)} /></FormField>
      <FormField label={t('booking.fields.phone')} required><Input type="tel" autoComplete="tel" value={answers.contactPhone ?? ''} onChange={(event) => update('contactPhone', event.target.value)} /></FormField>
      <FormField label={t('booking.fields.email')} required hint={isMatch ? t('booking.fields.emailHint') : undefined}><Input type="email" autoComplete="email" value={answers.contactEmail ?? ''} onChange={(event) => update('contactEmail', event.target.value)} /></FormField>
      <FormField label={t('booking.fields.messenger')} required><Select value={answers.messenger ?? ''} onChange={(event) => update('messenger', event.target.value)}><option value="">{t('booking.fields.messengerPlaceholder')}</option>{MESSENGERS.map((option) => <option value={option} key={option}>{option}</option>)}</Select></FormField>
    </div>
    {isMatch ? <p className="booking-request-flow__privacy">{t('booking.steps.contact.privacy')}</p> : <FormField label={t('booking.fields.comment')}><Textarea value={answers.comment ?? ''} onChange={(event) => update('comment', event.target.value)} /></FormField>}
  </BookingFormSection>;
}

export function RequestReviewStep({ answers, definition, offer, error, actions, stepNumber }) {
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.intlLocale;
  const total = estimateBookingTotal(definition, offer, answers);
  return <BookingFormSection stepNumber={stepNumber} title={t('booking.steps.review.title')} description={t('booking.steps.review.description')} error={error} actions={actions}>
    <dl className="booking-request-flow__review">
      <div><dt>{t('booking.review.offer')}</dt><dd>{offer.object.name}</dd></div>
      {offer.route ? <div><dt>{t('booking.transfer.directionLabel')}</dt><dd>{`${transferJourney(offer, answers).origin} → ${transferJourney(offer, answers).destination}`}</dd></div> : null}
      {answers.pointLabel ? <div><dt>{t(answers.direction === 'From Gudauri' ? 'booking.transfer.dropoffLabel' : 'booking.transfer.pickupLabel')}</dt><dd>{answers.pointLabel}</dd></div> : null}
      {answers.flightNumber ? <div><dt>{t('booking.transfer.flightLabel')}</dt><dd>{answers.flightNumber}</dd></div> : null}
      {answers.dateRange?.start ? <div><dt>{t('booking.review.dates')}</dt><dd>{formatDateRange(answers.dateRange, locale)}</dd></div> : null}
      {!answers.dateRange?.start && answers.date ? <div><dt>{t('booking.review.date')}</dt><dd>{[answers.date, answers.time].filter(Boolean).join(' · ')}</dd></div> : null}
      {extrasSummary(offer, answers) ? <div><dt>{t('booking.transfer.extrasLabel')}</dt><dd>{extrasSummary(offer, answers)}</dd></div> : null}
      {matchHours(answers) ? <div><dt>{t('booking.review.preferredTime')}</dt><dd>{t('booking.review.hoursSelected', { hours: matchHours(answers) })}</dd></div> : null}
      {answers.duration ? <div><dt>{t('booking.review.duration')}</dt><dd>{t('booking.review.hours', { hours: answers.duration })}</dd></div> : null}
      {answers.participants ? <div><dt>{t('booking.review.participants')}</dt><dd>{answers.participants}</dd></div> : null}
      {answers.languages?.length ? <div><dt>{t('booking.group.instructorLanguage')}</dt><dd>{answers.languages.map((value) => optionLabel(t, value)).join(', ')}</dd></div> : null}
      {answers.level ? <div><dt>{t('booking.group.skillLevel')}</dt><dd>{optionLabel(t, answers.level)}</dd></div> : null}
      <div><dt>{t('booking.review.contact')}</dt><dd>{answers.contactName} · {answers.contactPhone}</dd></div>
      <div><dt>{definition.priceLabel}</dt><dd>{formatBookingPrice(total, offer.currency, t('booking.onRequest'))}</dd></div>
    </dl>
  </BookingFormSection>;
}

const required = (value) => Boolean(String(value ?? '').trim());
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '');
const matchDateRange = (answers) => Boolean(answers.dateRange?.start);

function inquirySummaryRows({ definition, answers, t }) {
  return [
    { label: t('booking.review.date'), value: answers.date || t('booking.notSelected'), muted: !answers.date },
    ...definition.entryFields.map((fieldId) => {
      const field = definition.fields[fieldId];
      const value = answers[fieldId];
      return { label: field.label, value: value === undefined || value === null || value === '' ? '—' : String(value), muted: value === undefined || value === null || value === '' };
    }),
  ];
}

function inquiryCompactSummary({ definition, answers }) {
  return [answers.date, ...definition.entryFields.map((fieldId) => answers[fieldId])].filter(Boolean).join(' · ');
}

const contactSummary = ({ answers }) => answers.contactName ? `${answers.contactName} · ${answers.messenger}` : '';

const detailsStep = (labelKey, scope) => ({
  labelKey,
  scope,
  Component: InquiryDetailsStep,
  validate: (answers, t, definition) => {
    if (!required(answers.date)) return t('booking.validation.date');
    const missing = Object.values(definition.fields).filter((field) => !definition.entryFields.includes(field.id) && field.required && !required(answers[field.id]));
    return missing.length ? t('booking.validation.details') : '';
  },
  compactSummary: inquiryCompactSummary,
  summaryRows: inquirySummaryRows,
});

export const BOOKING_STEP_REGISTRY = Object.freeze({
  'instructor-dates': {
    labelKey: 'booking.steps.instructorDates.label',
    scope: ['instructors'],
    Component: InstructorDatesStep,
    validate: (answers, t) => matchDateRange(answers) && matchHours(answers) ? '' : t('booking.validation.dateAndSlot'),
    compactSummary: ({ answers, t, locale }) => [formatDateRange(answers.dateRange, locale), matchHours(answers) ? t('booking.review.hours', { hours: matchHours(answers) }) : t('booking.timeFlexible')].filter(Boolean).join(' · '),
    summaryRows: ({ answers, t, locale }) => [
      { label: t('booking.review.dates'), value: formatDateRange(answers.dateRange, locale) || null },
      { label: t('booking.review.timeSlots'), value: matchHours(answers) ? t('booking.review.hoursSelected', { hours: matchHours(answers) }) : t('booking.notSelected'), muted: !matchHours(answers) },
      { label: t('booking.review.duration'), value: answers.duration ? t('booking.review.hours', { hours: answers.duration }) : null },
    ],
  },
  'instructor-participants': {
    labelKey: 'booking.steps.instructorParticipants.label',
    scope: ['instructors'],
    Component: InstructorParticipantsStep,
    validate: (answers, t) => {
      const group = groupCounts(answers, true);
      return group.total <= 10 && answers.languages?.length && required(answers.level) ? '' : t('booking.validation.group');
    },
    compactSummary: ({ answers, t, locale }) => {
      const group = groupCounts(answers, true);
      return `${optionLabel(t, answers.companyType ?? 'Family')} · ${t('booking.review.people', { count: group.total })} · ${optionLabel(t, answers.level ?? 'Beginner')}`;
    },
    summaryRows: ({ answers, currentStep, stepIndex, t, locale }) => {
      const group = groupCounts(answers, true);
      return [
        { label: t('booking.review.participants'), value: `${group.total} · ${t('booking.review.adultsCount', { count: group.adults })}${group.children ? ` · ${t('booking.review.kidsCount', { count: group.children })}` : ''}` },
        ...(currentStep >= stepIndex ? [{ label: t('booking.review.lesson'), value: `${(answers.languages ?? []).map((value) => optionLabel(t, value)).join(', ') || t('booking.languageNotSelected')} · ${answers.level ? optionLabel(t, answers.level) : t('booking.levelNotSelected')}`, muted: !answers.languages?.length || !answers.level }] : []),
      ];
    },
  },
  'instructor-match-dates': {
    labelKey: 'booking.steps.instructorDates.title',
    scope: ['instructor-match'],
    Component: InstructorDatesStep,
    validate: (answers, t) => matchDateRange(answers) ? '' : t('booking.validation.dateOnly'),
    compactSummary: ({ answers, t, locale }) => [formatDateRange(answers.dateRange, locale), matchHours(answers) ? t('booking.review.hours', { hours: matchHours(answers) }) : ''].filter(Boolean).join(' · '),
    summaryRows: ({ answers, t, locale }) => [{
      label: formatDateRange(answers.dateRange, locale) || t('booking.review.dates'),
      value: matchHours(answers) ? `${matchHours(answers)} ${t('booking.hourShort')}` : t('booking.timeNotSet'),
      emphasis: true,
      muted: !answers.dateRange?.start,
    }],
  },
  'instructor-match-company': {
    labelKey: 'booking.steps.instructorParticipants.label',
    scope: ['instructor-match'],
    Component: InstructorMatchCompanyStep,
    validate: (answers, t) => Number(answers.adultsCount) > 0 && Number(answers.childrenCount) <= Number(answers.adultsCount) && answers.languages?.length ? '' : t('booking.validation.matchGroup'),
    compactSummary: ({ answers, t, locale }) => `${optionLabel(t, answers.companyType)} · ${Number(answers.adultsCount) + Number(answers.childrenCount || 0)}`,
    summaryRows: ({ answers, currentStep, stepIndex, t, locale }) => currentStep >= stepIndex ? [{
      label: t('booking.review.peopleLabel'),
      value: `${optionLabel(t, answers.companyType)} · ${Number(answers.adultsCount) + Number(answers.childrenCount || 0)}`,
    }] : [{ label: t('booking.review.peopleLabel'), value: '—', muted: true }],
  },
  'instructor-match-preferences': {
    labelKey: 'booking.steps.matchPreferences.title',
    scope: ['instructor-match'],
    Component: InstructorMatchPreferencesStep,
    validate: (answers, t) => answers.activities?.length && answers.pace && answers.skillLevel && answers.budget ? '' : t('booking.validation.preferences'),
    compactSummary: ({ answers, t, locale }) => [answers.activities?.map((value) => optionLabel(t, value)).join(', '), answers.pace && optionLabel(t, answers.pace), answers.skillLevel && optionLabel(t, answers.skillLevel)].filter(Boolean).join(' · '),
    summaryRows: ({ answers, currentStep, stepIndex, t, locale }) => currentStep >= stepIndex ? [{
      label: t('booking.review.preferences'),
      value: answers.activities?.length ? `${answers.activities.map((value) => optionLabel(t, value)).join(', ')} · ${optionLabel(t, answers.pace)}` : '—',
      muted: !answers.activities?.length,
    }] : [],
  },
  'transfer-route': {
    labelKey: 'booking.steps.transferRoute.label',
    scope: ['transfers'],
    Component: TransferRouteStep,
    validate: (answers, t, definition, offer) => {
      const point = activePoint(offer, answers);
      if (!point) return t('booking.validation.transferPoint');
      if (point.requiresAddress && !required(answers.cityAddress)) return t('booking.validation.transferCityAddress');
      if (!point.requiresAddress && !point.requiresFlight && !required(answers.meetingNotes)) return t('booking.validation.transferMeeting');
      return required(answers.gudauriAddress) ? '' : t('booking.validation.transferGudauriAddress');
    },
    compactSummary: ({ answers, offer }) => {
      const journey = transferJourney(offer, answers);
      return [`${journey.origin} → ${journey.destination}`, answers.pointLabel].filter(Boolean).join(' · ');
    },
    summaryRows: ({ answers, offer, t }) => {
      const journey = transferJourney(offer, answers);
      return [
        { label: t('booking.transfer.directionLabel'), value: `${journey.origin} → ${journey.destination}`, emphasis: true },
        { label: t(journey.fromGudauri ? 'booking.transfer.dropoffLabel' : 'booking.transfer.pickupLabel'), value: answers.pointLabel || t('booking.notSelected'), muted: !answers.pointLabel },
        { label: t('booking.transfer.flightLabel'), value: answers.flightNumber || null },
      ];
    },
  },
  'transfer-trip': {
    labelKey: 'booking.steps.transferTrip.label',
    scope: ['transfers'],
    Component: TransferTripStep,
    validate: (answers, t) => required(answers.date) && Number(answers.passengers) > 0 ? '' : t('booking.validation.transferTrip'),
    compactSummary: ({ answers, t }) => [answers.date, answers.time, t('booking.review.people', { count: Number(answers.passengers) || 0 })].filter(Boolean).join(' · '),
    summaryRows: ({ answers, offer, currentStep, stepIndex, t }) => currentStep >= stepIndex ? [
      { label: t('booking.transfer.whenLabel'), value: [answers.date, answers.time].filter(Boolean).join(' · ') || t('booking.notSelected'), muted: !answers.date },
      { label: t('booking.transfer.groupLabel'), value: t('booking.review.people', { count: Number(answers.passengers) || 0 }) },
      { label: t('booking.transfer.extrasLabel'), value: extrasSummary(offer, answers) || null },
    ] : [],
  },
  'activity-details': detailsStep('booking.steps.activityDetails', ['activities']),
  'rental-details': detailsStep('booking.steps.rentalDetails', ['rental']),
  'stay-details': detailsStep('booking.steps.stayDetails', ['stays']),
  'service-details': detailsStep('booking.steps.serviceDetails', ['services']),
  'place-details': detailsStep('booking.steps.placeDetails', ['places']),
  'contact-details': {
    labelKey: 'booking.steps.contact.title',
    scope: ['shared'],
    Component: ContactDetailsStep,
    validate: (answers, t) => required(answers.contactName) && required(answers.contactPhone) && validEmail(answers.contactEmail) && required(answers.messenger) ? '' : t('booking.validation.contact'),
    compactSummary: contactSummary,
    summaryRows: ({ answers, currentStep, stepIndex, t, locale }) => currentStep >= stepIndex && answers.contactName ? [{ label: t('booking.review.contact'), value: `${answers.contactName} · ${answers.messenger}` }] : [],
  },
  'request-review': { labelKey: 'booking.steps.review.label', scope: ['shared'], Component: RequestReviewStep, validate: () => '', compactSummary: ({ t }) => t('booking.readyToSend'), summaryRows: () => [] },
});

export function getBookingStepPresentation(stepId, { definition, offer, answers, currentStep = 0, stepIndex = 0, t, locale }) {
  const step = BOOKING_STEP_REGISTRY[stepId];
  if (!step) throw new Error(`Booking flow: unregistered step “${stepId}”.`);
  const context = { definition, offer, answers, currentStep, stepIndex, t, locale };
  return {
    label: t(step.labelKey),
    scope: step.scope,
    compactSummary: step.compactSummary?.(context) ?? '',
    summaryRows: step.summaryRows?.(context) ?? [],
  };
}

export function BookingRequestFlow({ definition, offer, initialAnswers, onAnswersChange, onSubmit, onBack }) {
  const { currentLanguage, t } = useLanguage();
  const locale = currentLanguage.intlLocale;
  const [answers, setAnswers] = useState(() => createInitialBookingAnswers(definition, initialAnswers));
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '', requestCode: '' });
  const steps = useMemo(() => definition.steps.map((key) => {
    const registered = BOOKING_STEP_REGISTRY[key];
    if (!registered) throw new Error(`Booking flow: unregistered step “${key}”.`);
    return { id: key, ...registered };
  }), [definition]);
  const active = steps[currentStep];
  const total = estimateBookingTotal(definition, offer, answers);
  const update = (key, value) => setAnswers((current) => {
    const next = { ...current, [key]: value };
    onAnswersChange?.(next);
    return next;
  });
  const goTo = (index) => { setError(''); setCurrentStep(index); };
  const next = () => {
    const validationError = active.validate(answers, t, definition, offer);
    if (validationError) { setError(validationError); return; }
    goTo(Math.min(currentStep + 1, steps.length - 1));
  };
  const submit = async () => {
    const validationError = active.validate(answers, t, definition, offer);
    if (validationError) { setError(validationError); return; }
    setSubmitState({ status: 'loading', message: '', requestCode: '' });
    try {
      const result = await onSubmit({ definition, offer, answers, estimatedTotal: total });
      setSubmitState({ status: 'success', message: t('booking.submitted'), requestCode: result?.requestCode ?? '' });
    } catch (submitError) {
      setSubmitState({ status: 'error', message: submitError.message, requestCode: '' });
    }
  };
  const summaryRows = steps.flatMap((step, stepIndex) => step.summaryRows?.({ definition, offer, answers, currentStep, stepIndex, t, locale }) ?? []);
  const matchingHours = definition.presentation === 'operator-match' ? matchHours(answers) : 0;
  const matchingHasPrice = definition.presentation === 'operator-match' && currentStep > 0 && matchingHours > 0;

  if (submitState.status === 'success') return <Notice tone="info" title={t('booking.received')}><p>{submitState.message}</p>{submitState.requestCode ? <p>{t('booking.reference')} <strong>{submitState.requestCode}</strong></p> : null}<Button variant="secondary" onClick={onBack}>{t(offer.object?.name ? 'booking.actions.backToOffer' : 'booking.actions.backToInstructors')}</Button></Notice>;

  const actions = <div className={`booking-request-flow__actions${currentStep === 0 ? ' booking-request-flow__actions--forward-only' : ''}`}>
    {currentStep > 0 ? <Button className="booking-request-flow__back-action" variant="ghost" onClick={() => goTo(currentStep - 1)}>← {t('booking.actions.back')}</Button> : null}
    {currentStep === steps.length - 1
      ? <Button variant="accent" onClick={submit} loading={submitState.status === 'loading'} loadingLabel={t('booking.actions.sending')}>{t('booking.actions.send')} →</Button>
      : <Button variant="accent" onClick={next}>{t('booking.actions.next')} →</Button>}
  </div>;

  return <BookingFlow
    step={<div className="booking-request-flow__steps">{steps.map((step, index) => {
      if (index !== currentStep) return <BookingFormSection key={step.id} compact stepNumber={index + 1} title={t(step.labelKey)} summary={index < currentStep ? step.compactSummary?.({ definition, offer, answers, currentStep, stepIndex: index, t, locale }) : ''} onEdit={index < currentStep ? () => goTo(index) : undefined} />;
      const StepComponent = step.Component;
      return <StepComponent key={step.id} answers={answers} update={update} definition={definition} offer={offer} stepNumber={index + 1} actions={actions} error={error || (submitState.status === 'error' ? submitState.message : '')} />;
    })}</div>}
    summary={<BookingRequestSummary title={t('booking.summaryTitle')} object={definition.presentation === 'operator-match' ? null : offer.object} rows={summaryRows} priceLabel={definition.presentation === 'operator-match' ? t('booking.forHours', { hours: matchingHours }) : definition.priceLabel} totalLabel={definition.presentation === 'operator-match' ? (matchingHasPrice ? formatBookingPrice(total, offer.currency, t('booking.onRequest')) : null) : formatBookingPrice(total, offer.currency, t('booking.onRequest'))} note={definition.presentation === 'operator-match' ? (matchingHasPrice ? t('booking.sameRateNote') : t('booking.priceLaterNote')) : undefined} />}
    status={submitState.status === 'error' ? <Notice tone="danger">{submitState.message}</Notice> : null}
  />;
}
