import { useMemo, useState } from 'react';
import {
  BookingFlow,
  BookingFormSection,
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
  TimeSlotPicker,
} from '../../design-system';
import { createInitialBookingAnswers, estimateBookingTotal, formatBookingPrice } from './contracts';
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

function formatDateRange(range) {
  if (!range?.start) return '';
  const start = new Date(`${range.start}T12:00:00`);
  const end = range.end ? new Date(`${range.end}T12:00:00`) : start;
  const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });
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

function formatShortDate(dateKey) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(`${dateKey}T12:00:00`));
}

function matchHours(answers) {
  const selected = Object.values(answers.timeSlotsByDate ?? {}).flat();
  return selected.reduce((total, slotId) => total + (TIME_SLOTS.find((slot) => slot.value === slotId)?.hours ?? 0), 0);
}

function toggleList(values, item) {
  return values.includes(item) ? values.filter((value) => value !== item) : [...values, item];
}

function ChoiceGroup({ label, options, value, onChange, multiple = false, variant = 'chips', tone = 'primary' }) {
  return <fieldset className={`booking-request-flow__choice-group booking-request-flow__choice-group--${variant}`}>
    <legend>{label}</legend>
    <div>{options.map((option) => {
      const selected = multiple ? value.includes(option) : value === option;
      return <FilterChip key={option} tone={tone} selected={selected} onClick={() => onChange(multiple ? toggleList(value, option) : option)}>{option}</FilterChip>;
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
  const { adults, children } = groupCounts(answers, syncParticipants);
  const setCounts = (nextAdults, nextChildren) => {
    update('adultsCount', nextAdults);
    update('childrenCount', nextChildren);
    if (syncParticipants) update('participants', nextAdults + nextChildren);
  };
  const adultMaximum = Math.max(1, Math.min(maxAdults, maxParticipants - children));
  const childMaximum = Math.max(0, Math.min(adults, maxParticipants - adults));

  return <>
    <ChoiceGroup label="Who's coming" options={MATCH_OPTIONS.companyType} value={answers.companyType ?? 'Family'} onChange={(value) => update('companyType', value)} variant="segmented" />
    <div className="booking-request-flow__counter-grid">
      <div className="booking-request-flow__counter-field"><span>Adults</span><div><p><strong>{adults}</strong><small>adults</small></p><QuantityStepper variant="booking" label="Adults" value={adults} min={1} max={adultMaximum} onChange={(value) => setCounts(value, Math.min(children, value, maxParticipants - value))} /></div></div>
      <div className="booking-request-flow__counter-field"><span>Kids under 12</span><div><p><strong>{children}</strong><small>kids</small></p><QuantityStepper variant="booking" label="Kids under 12" value={children} min={0} max={childMaximum} onChange={(value) => setCounts(adults, value)} /></div></div>
    </div>
    <ChoiceGroup label="Instructor language" options={MATCH_OPTIONS.languages} value={answers.languages ?? []} multiple tone="accent" onChange={(values) => update('languages', values)} />
    {includeSkillLevel ? <ChoiceGroup label="Group skill level" options={MATCH_OPTIONS.skillLevel} value={answers[levelField] ?? 'Beginner'} onChange={(value) => update(levelField, value)} /> : null}
  </>;
}

export function InstructorParticipantsStep({ answers, update, definition, error, actions, stepNumber }) {
  return <BookingFormSection stepNumber={stepNumber} title="Company" description="Tell the instructor who is coming and choose the preferred lesson language and group level." error={error} actions={actions}>
    <GroupDetailsFields answers={answers} update={update} maxParticipants={definition.fields.participants.max} syncParticipants includeSkillLevel levelField="level" />
  </BookingFormSection>;
}

export function InquiryDetailsStep({ answers, update, definition, error, actions, stepNumber }) {
  return <BookingFormSection stepNumber={stepNumber} title="Add request details" description="Share the preferred date and anything the local team should know." error={error} actions={actions}>
    <FormField label="Preferred date" required><DateField value={answers.date ?? ''} onChange={(event) => update('date', event.target.value)} /></FormField>
    {Object.values(definition.fields).filter((field) => !definition.entryFields.includes(field.id)).map((field) => <FormField label={field.label} key={field.id}><Input value={answers[field.id] ?? ''} onChange={(event) => update(field.id, event.target.value)} /></FormField>)}
    <FormField label="Additional details"><Textarea value={answers.details ?? ''} onChange={(event) => update('details', event.target.value)} /></FormField>
  </BookingFormSection>;
}

export function InstructorDatesStep({ answers, update, definition, error, actions, stepNumber }) {
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
  return <BookingFormSection stepNumber={stepNumber} title="When would you like to go?" description={isSpecificInstructor ? 'Choose one or several lesson days, then mark the time slots that work for you.' : 'Choose your preferred days. You can add a preferred time after selecting the dates.'} error={error} actions={actions}>
    <DateRangeCalendar label="Preferred lesson dates" value={answers.dateRange} min={toDateKey(new Date())} max={toDateKey(maxDate)} onChange={setDateRange} />
    {selectedDays.length ? <div className="booking-request-flow__time-section">
      {timeExpanded ? <>
        <div className="booking-request-flow__time-actions"><Button type="button" variant="ghost" onClick={() => setTimeExpanded(false)}>− Collapse</Button></div>
        <TimeSlotPicker label={`Time per day${isSpecificInstructor ? '' : ' — optional'}`} days={selectedDays.map((day) => ({ id: day, label: formatShortDate(day) }))} slots={TIME_SLOTS.map(({ value, label, meta }) => ({ id: value, label, meta }))} value={answers.timeSlotsByDate ?? {}} onChange={setTimeSlots} />
      </> : <Button className="booking-request-flow__add-time" type="button" variant="secondary" onClick={() => setTimeExpanded(true)}>+ Specify time {!isSpecificInstructor ? <small>(optional)</small> : null}</Button>}
    </div> : null}
  </BookingFormSection>;
}

export function InstructorMatchCompanyStep({ answers, update, error, actions, stepNumber }) {
  return <BookingFormSection stepNumber={stepNumber} title="Company" description="A few details about your group help the operator make a relevant match." error={error} actions={actions}>
    <GroupDetailsFields answers={answers} update={update} maxParticipants={20} />
  </BookingFormSection>;
}

export function InstructorMatchPreferencesStep({ answers, update, error, actions, stepNumber }) {
  return <BookingFormSection stepNumber={stepNumber} title="What are you into?" description="A few preferences help the operator match the right lesson and instructor." error={error} actions={actions}>
    <ChoiceGroup label="Activity" options={MATCH_OPTIONS.activities} value={answers.activities ?? []} multiple onChange={(values) => update('activities', values)} />
    <ChoiceGroup label="Pace" options={MATCH_OPTIONS.pace} value={answers.pace} onChange={(value) => update('pace', value)} />
    <ChoiceGroup label="Skill level" options={MATCH_OPTIONS.skillLevel} value={answers.skillLevel} onChange={(value) => update('skillLevel', value)} />
    <ChoiceGroup label="Budget per person" options={MATCH_OPTIONS.budget} value={answers.budget} onChange={(value) => update('budget', value)} />
    <FormField label="Anything else" hint="Goals, kids, rental equipment"><Textarea rows="3" value={answers.notes ?? ''} onChange={(event) => update('notes', event.target.value)} placeholder="2 beginners and a child, rental needed" /></FormField>
  </BookingFormSection>;
}

export function ContactDetailsStep({ answers, update, definition, error, actions, stepNumber }) {
  const isMatch = definition.presentation === 'operator-match';
  return <BookingFormSection stepNumber={stepNumber} title="Contact details" description={isMatch ? 'Where should the operator send the confirmed option?' : 'A local manager will use these details only for this request.'} error={error} actions={actions}>
    <div className="booking-request-flow__field-grid">
      <FormField label="Name" required><Input autoComplete="name" value={answers.contactName ?? ''} onChange={(event) => update('contactName', event.target.value)} /></FormField>
      <FormField label="Phone" required><Input type="tel" autoComplete="tel" value={answers.contactPhone ?? ''} onChange={(event) => update('contactPhone', event.target.value)} /></FormField>
      <FormField label="Email" required hint={isMatch ? 'Confirmation goes here' : undefined}><Input type="email" autoComplete="email" value={answers.contactEmail ?? ''} onChange={(event) => update('contactEmail', event.target.value)} /></FormField>
      <FormField label="Preferred messenger" required><Select value={answers.messenger ?? ''} onChange={(event) => update('messenger', event.target.value)}><option value="">Choose a messenger</option>{MESSENGERS.map((option) => <option key={option}>{option}</option>)}</Select></FormField>
    </div>
    {isMatch ? <p className="booking-request-flow__privacy">Payment happens after confirmation. The operator replies within an hour to confirm the instructor, weather and meeting point.</p> : <FormField label="Comment"><Textarea value={answers.comment ?? ''} onChange={(event) => update('comment', event.target.value)} /></FormField>}
  </BookingFormSection>;
}

export function RequestReviewStep({ answers, definition, offer, error, actions, stepNumber }) {
  const total = estimateBookingTotal(definition, offer, answers);
  return <BookingFormSection stepNumber={stepNumber} title="Review your request" description="Nothing is charged now. We confirm availability and the final total first." error={error} actions={actions}>
    <dl className="booking-request-flow__review">
      <div><dt>Offer</dt><dd>{offer.object.name}</dd></div>
      {answers.dateRange?.start ? <div><dt>Dates</dt><dd>{formatDateRange(answers.dateRange)}</dd></div> : null}
      {!answers.dateRange?.start && answers.date ? <div><dt>Date</dt><dd>{answers.date}</dd></div> : null}
      {matchHours(answers) ? <div><dt>Preferred time</dt><dd>{matchHours(answers)} hours selected</dd></div> : null}
      {answers.duration ? <div><dt>Duration</dt><dd>{answers.duration} hours</dd></div> : null}
      {answers.participants ? <div><dt>Participants</dt><dd>{answers.participants}</dd></div> : null}
      {answers.languages?.length ? <div><dt>Instructor language</dt><dd>{answers.languages.join(', ')}</dd></div> : null}
      {answers.level ? <div><dt>Group skill level</dt><dd>{answers.level}</dd></div> : null}
      <div><dt>Contact</dt><dd>{answers.contactName} · {answers.contactPhone}</dd></div>
      <div><dt>{definition.priceLabel}</dt><dd>{formatBookingPrice(total, offer.currency)}</dd></div>
    </dl>
  </BookingFormSection>;
}

const required = (value) => Boolean(String(value ?? '').trim());
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '');
const matchDateRange = (answers) => Boolean(answers.dateRange?.start);

function inquirySummaryRows({ definition, answers }) {
  return [
    { label: 'Date', value: answers.date || 'Not selected', muted: !answers.date },
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

export const BOOKING_STEP_REGISTRY = Object.freeze({
  'instructor-dates': {
    label: 'Dates & time',
    scope: ['instructors'],
    Component: InstructorDatesStep,
    validate: (answers) => matchDateRange(answers) && matchHours(answers) ? '' : 'Choose at least one date and one preferred time slot.',
    compactSummary: ({ answers }) => [formatDateRange(answers.dateRange), matchHours(answers) ? `${matchHours(answers)} hours` : 'time flexible'].filter(Boolean).join(' · '),
    summaryRows: ({ answers }) => [
      { label: 'Dates', value: formatDateRange(answers.dateRange) || null },
      { label: 'Time slots', value: matchHours(answers) ? `${matchHours(answers)} hours selected` : 'Not selected', muted: !matchHours(answers) },
      { label: 'Duration', value: answers.duration ? `${answers.duration} hours` : null },
    ],
  },
  'instructor-participants': {
    label: 'Company',
    scope: ['instructors'],
    Component: InstructorParticipantsStep,
    validate: (answers) => {
      const group = groupCounts(answers, true);
      return group.total <= 10 && answers.languages?.length && required(answers.level) ? '' : 'Choose the group size, instructor language and skill level.';
    },
    compactSummary: ({ answers }) => {
      const group = groupCounts(answers, true);
      return `${answers.companyType ?? 'Group'} · ${group.total} people · ${answers.level ?? 'Beginner'}`;
    },
    summaryRows: ({ answers, currentStep, stepIndex }) => {
      const group = groupCounts(answers, true);
      return [
        { label: 'Participants', value: `${group.total} · ${group.adults} adults${group.children ? ` · ${group.children} ${group.children === 1 ? 'child' : 'kids'}` : ''}` },
        ...(currentStep >= stepIndex ? [{ label: 'Lesson', value: `${(answers.languages ?? []).join(', ') || 'Language not selected'} · ${answers.level ?? 'Level not selected'}`, muted: !answers.languages?.length || !answers.level }] : []),
      ];
    },
  },
  'instructor-match-dates': {
    label: 'When would you like to go?',
    scope: ['instructor-match'],
    Component: InstructorDatesStep,
    validate: (answers) => matchDateRange(answers) ? '' : 'Choose at least one preferred date.',
    compactSummary: ({ answers }) => [formatDateRange(answers.dateRange), matchHours(answers) ? `${matchHours(answers)} hours` : ''].filter(Boolean).join(' · '),
    summaryRows: ({ answers }) => [{
      label: formatDateRange(answers.dateRange) || 'Dates',
      value: matchHours(answers) ? `${matchHours(answers)} h` : 'time not set',
      emphasis: true,
      muted: !answers.dateRange?.start,
    }],
  },
  'instructor-match-company': {
    label: 'Company',
    scope: ['instructor-match'],
    Component: InstructorMatchCompanyStep,
    validate: (answers) => Number(answers.adultsCount) > 0 && Number(answers.childrenCount) <= Number(answers.adultsCount) && answers.languages?.length ? '' : 'Tell us about the group and preferred languages.',
    compactSummary: ({ answers }) => `${answers.companyType} · ${Number(answers.adultsCount) + Number(answers.childrenCount || 0)}`,
    summaryRows: ({ answers, currentStep, stepIndex }) => currentStep >= stepIndex ? [{
      label: 'People',
      value: `${answers.companyType} · ${Number(answers.adultsCount) + Number(answers.childrenCount || 0)}`,
    }] : [{ label: 'People', value: '—', muted: true }],
  },
  'instructor-match-preferences': {
    label: 'What are you into?',
    scope: ['instructor-match'],
    Component: InstructorMatchPreferencesStep,
    validate: (answers) => answers.activities?.length && answers.pace && answers.skillLevel && answers.budget ? '' : 'Choose activity, pace, skill level and budget.',
    compactSummary: ({ answers }) => [answers.activities?.join(', '), answers.pace, answers.skillLevel].filter(Boolean).join(' · '),
    summaryRows: ({ answers, currentStep, stepIndex }) => currentStep >= stepIndex ? [{
      label: 'Preferences',
      value: answers.activities?.length ? `${answers.activities.join(', ')} · ${answers.pace}` : '—',
      muted: !answers.activities?.length,
    }] : [],
  },
  'activity-details': { label: 'Activity details', scope: ['activities'], Component: InquiryDetailsStep, validate: (answers) => required(answers.date) ? '' : 'Choose a preferred date.', compactSummary: inquiryCompactSummary, summaryRows: inquirySummaryRows },
  'rental-details': { label: 'Rental details', scope: ['rental'], Component: InquiryDetailsStep, validate: (answers) => required(answers.date) ? '' : 'Choose a preferred date.', compactSummary: inquiryCompactSummary, summaryRows: inquirySummaryRows },
  'transfer-details': { label: 'Transfer details', scope: ['transfers'], Component: InquiryDetailsStep, validate: (answers) => required(answers.date) ? '' : 'Choose a preferred date.', compactSummary: inquiryCompactSummary, summaryRows: inquirySummaryRows },
  'stay-details': { label: 'Stay details', scope: ['stays'], Component: InquiryDetailsStep, validate: (answers) => required(answers.date) ? '' : 'Choose a preferred date.', compactSummary: inquiryCompactSummary, summaryRows: inquirySummaryRows },
  'service-details': { label: 'Service details', scope: ['services'], Component: InquiryDetailsStep, validate: (answers) => required(answers.date) ? '' : 'Choose a preferred date.', compactSummary: inquiryCompactSummary, summaryRows: inquirySummaryRows },
  'place-details': { label: 'Place details', scope: ['places'], Component: InquiryDetailsStep, validate: (answers) => required(answers.date) ? '' : 'Choose a preferred date.', compactSummary: inquiryCompactSummary, summaryRows: inquirySummaryRows },
  'contact-details': {
    label: 'Contact details',
    scope: ['shared'],
    Component: ContactDetailsStep,
    validate: (answers) => required(answers.contactName) && required(answers.contactPhone) && validEmail(answers.contactEmail) && required(answers.messenger) ? '' : 'Add a valid name, phone, email and preferred messenger.',
    compactSummary: contactSummary,
    summaryRows: ({ answers, currentStep, stepIndex }) => currentStep >= stepIndex && answers.contactName ? [{ label: 'Contact', value: `${answers.contactName} · ${answers.messenger}` }] : [],
  },
  'request-review': { label: 'Review', scope: ['shared'], Component: RequestReviewStep, validate: () => '', compactSummary: () => 'Ready to send', summaryRows: () => [] },
});

export function getBookingStepPresentation(stepId, { definition, answers, currentStep = 0, stepIndex = 0 }) {
  const step = BOOKING_STEP_REGISTRY[stepId];
  if (!step) throw new Error(`Booking flow: unregistered step “${stepId}”.`);
  const context = { definition, answers, currentStep, stepIndex };
  return {
    label: step.label,
    scope: step.scope,
    compactSummary: step.compactSummary?.(context) ?? '',
    summaryRows: step.summaryRows?.(context) ?? [],
  };
}

export function BookingRequestFlow({ definition, offer, initialAnswers, onAnswersChange, onSubmit, onBack }) {
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
    const validationError = active.validate(answers);
    if (validationError) { setError(validationError); return; }
    goTo(Math.min(currentStep + 1, steps.length - 1));
  };
  const submit = async () => {
    const validationError = active.validate(answers);
    if (validationError) { setError(validationError); return; }
    setSubmitState({ status: 'loading', message: '', requestCode: '' });
    try {
      const result = await onSubmit({ definition, offer, answers, estimatedTotal: total });
      setSubmitState({ status: 'success', message: 'Your request has been sent.', requestCode: result?.requestCode ?? '' });
    } catch (submitError) {
      setSubmitState({ status: 'error', message: submitError.message, requestCode: '' });
    }
  };
  const summaryRows = steps.flatMap((step, stepIndex) => step.summaryRows?.({ definition, answers, currentStep, stepIndex }) ?? []);
  const matchingHours = definition.presentation === 'operator-match' ? matchHours(answers) : 0;
  const matchingHasPrice = definition.presentation === 'operator-match' && currentStep > 0 && matchingHours > 0;

  if (submitState.status === 'success') return <Notice tone="info" title="Request received"><p>{submitState.message}</p>{submitState.requestCode ? <p>Reference: <strong>{submitState.requestCode}</strong></p> : null}<Button variant="secondary" onClick={onBack}>Back to {offer.object?.name ? 'the offer' : 'instructors'}</Button></Notice>;

  const actions = <div className={`booking-request-flow__actions${currentStep === 0 ? ' booking-request-flow__actions--forward-only' : ''}`}>
    {currentStep > 0 ? <Button className="booking-request-flow__back-action" variant="ghost" onClick={() => goTo(currentStep - 1)}>← Back</Button> : null}
    {currentStep === steps.length - 1
      ? <Button variant="accent" onClick={submit} loading={submitState.status === 'loading'} loadingLabel="Sending request">Send request →</Button>
      : <Button variant="accent" onClick={next}>Next →</Button>}
  </div>;

  return <BookingFlow
    step={<div className="booking-request-flow__steps">{steps.map((step, index) => {
      if (index !== currentStep) return <BookingFormSection key={step.id} compact stepNumber={index + 1} title={step.label} summary={index < currentStep ? step.compactSummary?.({ definition, answers, currentStep, stepIndex: index }) : ''} onEdit={index < currentStep ? () => goTo(index) : undefined} />;
      const StepComponent = step.Component;
      return <StepComponent key={step.id} answers={answers} update={update} definition={definition} offer={offer} stepNumber={index + 1} actions={actions} error={error || (submitState.status === 'error' ? submitState.message : '')} />;
    })}</div>}
    summary={<BookingRequestSummary title="Your request" object={definition.presentation === 'operator-match' ? null : offer.object} rows={summaryRows} priceLabel={definition.presentation === 'operator-match' ? `for ${matchingHours} hours` : definition.priceLabel} totalLabel={definition.presentation === 'operator-match' ? (matchingHasPrice ? formatBookingPrice(total, offer.currency) : null) : formatBookingPrice(total, offer.currency)} note={definition.presentation === 'operator-match' ? (matchingHasPrice ? 'Same official rate for every instructor.' : 'Price appears once you set the time and participants.') : undefined} />}
    status={submitState.status === 'error' ? <Notice tone="danger">{submitState.message}</Notice> : null}
  />;
}
