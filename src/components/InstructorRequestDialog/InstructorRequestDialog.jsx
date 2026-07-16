import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css';
import { createInstructorRequest } from '../../services/instructorRequestsApi';
import './InstructorRequestDialog.scss';

const TIME_SLOTS = [
  { id: 'morning', label: '10:00–12:00' },
  { id: 'midday', label: '12:30–14:30' },
  { id: 'afternoon', label: '15:00–17:00' }
];

const MATCH_STEPS = [
  ['Dates & time', 'Choose a date range and convenient lesson slots. We will confirm availability.'],
  ['Your group', 'Tell us who is travelling and which languages work for you.'],
  ['What are you into?', 'A few preferences help our manager find the right instructor and program.'],
  ['Contact details', 'Where should our manager send the confirmed option?']
];

const INSTRUCTOR_STEPS = [
  ['Dates & time', 'Choose a date range and the slots you would like to reserve.'],
  ['Participants', 'Add the riders who will take the lesson.'],
  ['Contact details', 'Where should our manager send the confirmation?']
];

const LANGUAGES = ['English', 'Russian', 'Georgian'];
const ACTIVITIES = ['Ski', 'Snowboard', 'Freeride', 'Sightseeing'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const MESSENGERS = ['WhatsApp', 'Telegram', 'Viber'];

function toDateKey(date) {
  if (!date) return '';
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function fromDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function listDays(range) {
  if (!range?.from) return [];
  const start = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate());
  const end = range.to ? new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate()) : start;
  const days = [];
  for (const date = start; date <= end; date.setDate(date.getDate() + 1)) days.push(new Date(date));
  return days;
}

function formatDate(date, options = { day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function formatDateRange(range) {
  if (!range?.from) return 'Dates not selected';
  if (!range.to || toDateKey(range.from) === toDateKey(range.to)) return formatDate(range.from);
  if (range.from.getMonth() === range.to.getMonth()) return `${range.from.getDate()}–${formatDate(range.to)}`;
  return `${formatDate(range.from)} – ${formatDate(range.to)}`;
}

function makeParticipant() {
  return { name: '', age: '', skillLevel: 'Beginner', notes: '' };
}

function initialForm(instructor) {
  return {
    requestType: instructor ? 'specific_instructor' : 'manager_match',
    instructorSlug: instructor?.slug || '',
    instructorName: instructor?.name || '',
    dateRange: undefined,
    slotsByDate: {},
    companyType: 'Family',
    participantCount: 1,
    childrenCount: 0,
    languages: [],
    activities: [],
    pace: 'Medium',
    skillLevel: 'Beginner',
    budget: 'Mid-range',
    notes: '',
    participants: [makeParticipant()],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    messenger: 'WhatsApp',
    website: ''
  };
}

function ToggleGroup({ label, options, value, onChange, multiple = false }) {
  const selected = (option) => multiple ? value.includes(option) : value === option;
  return (
    <fieldset className="instructor-request-options">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button className={selected(option) ? 'is-selected' : ''} type="button" aria-pressed={selected(option)} onClick={() => onChange(option)} key={option}>
            {option}<span aria-hidden="true">{selected(option) ? '✓' : '+'}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Counter({ label, hint, value, min = 0, max = 10, onChange }) {
  return (
    <div className="instructor-request-counter">
      <div><span>{label}</span>{hint ? <small>{hint}</small> : null}</div>
      <div>
        <button type="button" aria-label={`Remove ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
        <strong>{value}</strong>
        <button type="button" aria-label={`Add ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function DateAndSlots({ range, slotsByDate, onRangeChange, onToggleSlot }) {
  const days = listDays(range);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="instructor-request-dates">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={onRangeChange}
        disabled={{ before: today }}
        numberOfMonths={1}
        startMonth={today}
        endMonth={new Date(today.getFullYear() + 1, 11, 31)}
        max={30}
        resetOnSelect
        aria-label="Preferred lesson dates"
      />
      {days.length ? (
        <div className="instructor-request-slots" aria-live="polite">
          <p><strong>{formatDateRange(range)}</strong><span>{days.length} {days.length === 1 ? 'day' : 'days'} · choose one or more slots</span></p>
          <div className="instructor-request-slots__legend" aria-hidden="true"><span>Day</span>{TIME_SLOTS.map((slot) => <span key={slot.id}>{slot.label}</span>)}</div>
          {days.map((date, index) => {
            const key = toDateKey(date);
            const selectedSlots = slotsByDate[key] || [];
            return (
              <div className="instructor-request-slots__row" key={key}>
                <div><strong>Day {index + 1}</strong><small>{formatDate(date, { day: '2-digit', month: '2-digit', year: '2-digit' })}</small></div>
                <div>{TIME_SLOTS.map((slot) => <button className={selectedSlots.includes(slot.id) ? 'is-selected' : ''} type="button" aria-pressed={selectedSlots.includes(slot.id)} onClick={() => onToggleSlot(key, slot.id)} key={slot.id}>{slot.label}</button>)}</div>
              </div>
            );
          })}
        </div>
      ) : <div className="instructor-request-dates__empty">Select a first and last day. Each day will appear here with three two-hour slots.</div>}
    </section>
  );
}

function ParticipantFields({ participants, onChange }) {
  const update = (index, key, value) => onChange(participants.map((participant, itemIndex) => itemIndex === index ? { ...participant, [key]: value } : participant));
  const remove = (index) => onChange(participants.filter((_, itemIndex) => itemIndex !== index));
  return (
    <div className="instructor-request-participants">
      {participants.map((participant, index) => (
        <section className="instructor-request-participant" key={index}>
          <header><strong>Participant {index + 1}</strong>{participants.length > 1 ? <button type="button" onClick={() => remove(index)}>Remove</button> : null}</header>
          <div className="instructor-request-contact-grid">
            <label className="instructor-request-field"><span>Full name</span><input value={participant.name} onChange={(event) => update(index, 'name', event.target.value)} placeholder="Optional" /></label>
            <label className="instructor-request-field instructor-request-field--age"><span>Age</span><input value={participant.age} onChange={(event) => update(index, 'age', event.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="Optional" /></label>
          </div>
          <ToggleGroup label="Skill level" options={SKILL_LEVELS} value={participant.skillLevel} onChange={(value) => update(index, 'skillLevel', value)} />
          <label className="instructor-request-field"><span>Additional notes <small>optional</small></span><input value={participant.notes} onChange={(event) => update(index, 'notes', event.target.value)} placeholder="Goals or useful details" /></label>
        </section>
      ))}
      <button className="instructor-request-add" type="button" disabled={participants.length >= 10} onClick={() => onChange([...participants, makeParticipant()])}>+ Add participant</button>
    </div>
  );
}

function compactPhone(phone) {
  if (phone.length < 8) return phone || '—';
  return `${phone.slice(0, 7)}…`;
}

export function InstructorRequestDialog({ open, onOpenChange, instructor = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => initialForm(instructor));
  const [submitState, setSubmitState] = useState({ status: 'idle', error: '', requestCode: '' });
  const isSpecific = Boolean(instructor);
  const steps = isSpecific ? INSTRUCTOR_STEPS : MATCH_STEPS;
  const selectedDays = useMemo(() => listDays(form.dateRange), [form.dateRange]);
  const totalHours = useMemo(() => Object.values(form.slotsByDate).reduce((total, slots) => total + slots.length * 2, 0), [form.slotsByDate]);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setForm(initialForm(instructor));
    setSubmitState({ status: 'idle', error: '', requestCode: '' });
  }, [instructor, open]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleList = (key, value) => setForm((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));

  const selectRange = (range) => {
    const validKeys = new Set(listDays(range).map(toDateKey));
    setForm((current) => ({
      ...current,
      dateRange: range,
      slotsByDate: Object.fromEntries(Object.entries(current.slotsByDate).filter(([key]) => validKeys.has(key)))
    }));
  };

  const toggleSlot = (date, slot) => setForm((current) => {
    const active = current.slotsByDate[date] || [];
    return { ...current, slotsByDate: { ...current.slotsByDate, [date]: active.includes(slot) ? active.filter((item) => item !== slot) : [...active, slot] } };
  });

  const stepIsValid = useMemo(() => {
    if (step === 1) return Boolean(selectedDays.length && totalHours);
    if (isSpecific && step === 2) return form.participants.length > 0;
    if (!isSpecific && step === 2) return Boolean(form.participantCount > 0 && form.languages.length);
    if (!isSpecific && step === 3) return Boolean(form.activities.length && form.pace && form.skillLevel && form.budget);
    return Boolean(form.contactName.trim() && form.contactPhone.trim() && form.messenger);
  }, [form, isSpecific, selectedDays.length, step, totalHours]);

  const submit = async (event) => {
    event.preventDefault();
    if (!stepIsValid || submitState.status === 'submitting') return;
    const slots = Object.fromEntries(Object.entries(form.slotsByDate).filter(([, value]) => value.length));
    const payload = {
      ...form,
      dateRangeStart: toDateKey(form.dateRange?.from),
      dateRangeEnd: toDateKey(form.dateRange?.to || form.dateRange?.from),
      sessionSlots: slots,
      preferredDates: formatDateRange(form.dateRange),
      timePreferences: [...new Set(Object.values(slots).flat())],
      totalHours
    };
    setSubmitState({ status: 'submitting', error: '', requestCode: '' });
    try {
      const result = await createInstructorRequest(payload);
      setSubmitState({ status: 'success', error: '', requestCode: result?.requestCode || '' });
    } catch (error) {
      setSubmitState({ status: 'error', error: error.message, requestCode: '' });
    }
  };

  const dateSummary = totalHours ? `${formatDateRange(form.dateRange)} · ${totalHours} h` : 'Dates and slots not selected';
  const groupSummary = isSpecific ? `${form.participants.length} ${form.participants.length === 1 ? 'participant' : 'participants'}` : `${form.companyType} · ${form.participantCount} ${form.participantCount === 1 ? 'person' : 'people'}`;
  const summaryItems = [dateSummary, groupSummary, !isSpecific ? `${form.activities.join(', ') || 'Preferences not selected'} · ${form.skillLevel}` : null];
  const title = isSpecific ? `Book a lesson with ${instructor.name}` : 'Request a lesson — we’ll match an instructor';
  const isSuccess = submitState.status === 'success';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="instructor-request-overlay" />
        <Dialog.Content className="instructor-request-dialog" aria-describedby="instructor-request-description">
          <div className="instructor-request-dialog__top"><div className="instructor-request-dialog__brand">My Gudauri<span>.</span></div><Dialog.Close className="instructor-request-dialog__close" aria-label="Close request">×</Dialog.Close></div>
          {isSuccess ? (
            <div className="instructor-request-success">
              <div className="instructor-request-success__mark" aria-hidden="true">✓</div><span>Request sent</span><Dialog.Title>{isSpecific ? 'Your booking request has been sent.' : 'We’ll find the right instructor.'}</Dialog.Title>
              <Dialog.Description id="instructor-request-description">We will reply via {form.messenger} to confirm {isSpecific ? 'the instructor’s availability' : 'an instructor, weather and lesson plan'}.</Dialog.Description>
              {submitState.requestCode ? <p>Request ID <strong>{submitState.requestCode}</strong></p> : null}
              <ol><li>{isSpecific ? 'We check the instructor’s availability.' : 'Our manager selects an instructor and program.'}</li><li>We contact you to confirm the details.</li><li>You receive a secure payment link after confirmation.</li></ol>
              <Dialog.Close className="instructor-request-success__button">Done</Dialog.Close>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="instructor-request-dialog__progress" style={{ '--request-steps': steps.length }} aria-label={`Step ${step} of ${steps.length}`}><span>Step {step} of {steps.length}</span><div aria-hidden="true">{steps.map((item, index) => <i className={index < step ? 'is-complete' : ''} key={item[0]} />)}</div></div>
              <header className="instructor-request-dialog__heading"><span>{isSpecific ? 'Selected instructor' : 'Personal matching'}</span><Dialog.Title>{title}</Dialog.Title></header>
              <div className="instructor-request-dialog__layout">
                <div className="instructor-request-dialog__main">
                  {steps.map(([label], index) => {
                    const itemStep = index + 1;
                    const active = itemStep === step;
                    const complete = itemStep < step;
                    if (!active) return <button className="instructor-request-step-summary" type="button" disabled={!complete} onClick={() => setStep(itemStep)} key={label}><strong>{itemStep}. {label}</strong><span>{complete ? `${summaryItems[index]} · Edit` : 'Not completed'}</span></button>;
                    return <section className="instructor-request-step" key={label}><h3>{itemStep}. {label}</h3><p>{steps[index][1]}</p>
                      {itemStep === 1 ? <DateAndSlots range={form.dateRange} slotsByDate={form.slotsByDate} onRangeChange={selectRange} onToggleSlot={toggleSlot} /> : null}
                      {isSpecific && itemStep === 2 ? <ParticipantFields participants={form.participants} onChange={(participants) => update('participants', participants)} /> : null}
                      {!isSpecific && itemStep === 2 ? <div className="instructor-request-stack"><ToggleGroup label="Who’s coming" options={['Family', 'Friends', 'Solo']} value={form.companyType} onChange={(value) => update('companyType', value)} /><div className="instructor-request-counter-grid"><Counter label="Participants" value={form.participantCount} min={1} onChange={(value) => setForm((current) => ({ ...current, participantCount: value, childrenCount: Math.min(current.childrenCount, value) }))} /><Counter label="Kids under 12" value={form.childrenCount} max={form.participantCount} onChange={(value) => update('childrenCount', value)} /></div><ToggleGroup label="Languages your instructor should speak" options={LANGUAGES} value={form.languages} multiple onChange={(value) => toggleList('languages', value)} /></div> : null}
                      {!isSpecific && itemStep === 3 ? <div className="instructor-request-stack"><ToggleGroup label="Activity" options={ACTIVITIES} value={form.activities} multiple onChange={(value) => toggleList('activities', value)} /><ToggleGroup label="Pace" options={['Relaxed', 'Medium', 'Adrenaline']} value={form.pace} onChange={(value) => update('pace', value)} /><ToggleGroup label="Skill level (average)" options={SKILL_LEVELS} value={form.skillLevel} onChange={(value) => update('skillLevel', value)} /><ToggleGroup label="Budget per person" options={['Economy', 'Mid-range', 'Premium']} value={form.budget} onChange={(value) => update('budget', value)} /><label className="instructor-request-field"><span>Anything else? <small>optional</small></span><textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Goals, children, equipment or special requests" rows="3" /></label></div> : null}
                      {itemStep === steps.length ? <div className="instructor-request-contact"><label className="instructor-request-field"><span>Contact name</span><input value={form.contactName} onChange={(event) => update('contactName', event.target.value)} autoComplete="name" autoFocus /></label><div className="instructor-request-contact-grid"><label className="instructor-request-field"><span>Phone number</span><input value={form.contactPhone} onChange={(event) => update('contactPhone', event.target.value)} type="tel" autoComplete="tel" placeholder="+995 …" /></label><label className="instructor-request-field"><span>Email <small>optional</small></span><input value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} type="email" autoComplete="email" /></label></div><ToggleGroup label="Preferred messenger" options={MESSENGERS} value={form.messenger} onChange={(value) => update('messenger', value)} /><label className="instructor-request-honeypot" aria-hidden="true">Website<input value={form.website} onChange={(event) => update('website', event.target.value)} tabIndex="-1" autoComplete="off" /></label><small className="instructor-request-dialog__privacy">Payment happens only after confirmation. We use your details only to respond to this request.</small></div> : null}
                    </section>;
                  })}
                  {submitState.status === 'error' ? <p className="instructor-request-dialog__error" role="alert">{submitState.error}</p> : null}
                  <footer className="instructor-request-dialog__footer">{step > 1 ? <button className="instructor-request-dialog__back" type="button" onClick={() => setStep((value) => value - 1)}>Back</button> : <span />}{step < steps.length ? <button className="instructor-request-dialog__next" type="button" disabled={!stepIsValid} onClick={() => setStep((value) => value + 1)}>Continue <span aria-hidden="true">→</span></button> : <button className="instructor-request-dialog__next" type="submit" disabled={!stepIsValid || submitState.status === 'submitting'}>{submitState.status === 'submitting' ? 'Sending…' : 'Send request'} <span aria-hidden="true">→</span></button>}</footer>
                </div>
                <aside className="instructor-request-summary" aria-label="Request summary"><header><span>{isSpecific ? 'Instructor' : 'Instructor'}</span><strong>{isSpecific ? instructor.name : 'We’ll match one'}</strong></header><dl><div><dt>Dates</dt><dd>{form.dateRange ? formatDateRange(form.dateRange) : '—'}</dd></div><div><dt>Lesson time</dt><dd>{totalHours ? `${totalHours} hours` : '—'}</dd></div><div><dt>{isSpecific ? 'People' : 'Group'}</dt><dd>{isSpecific ? `${form.participants.length} ${form.participants.length === 1 ? 'person' : 'people'}` : `${form.companyType} · ${form.participantCount}`}</dd></div>{!isSpecific && form.activities.length ? <div><dt>Preferences</dt><dd>{form.activities.join(', ')}</dd></div> : null}{form.contactName ? <div><dt>Contact</dt><dd>{form.contactName}<br />{compactPhone(form.contactPhone)}</dd></div> : null}</dl><p>{isSpecific ? 'Final price after confirmation' : 'Price confirmed by manager'}</p></aside>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
