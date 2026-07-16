import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css';
import { createInstructorRequest } from '../../services/instructorRequestsApi';
import './InstructorRequestDialog.scss';

const TIME_SLOTS = [
  { id: 'morning', label: '10–12' },
  { id: 'midday', label: '12:30–14:30' },
  { id: 'afternoon', label: '15–17' }
];

const MATCH_STEPS = [
  ['When would you like to go?', 'Choose the days that work for you. Time is optional — our manager can suggest the best slots and weather.'],
  ['Company', 'A few details about your group help us make a relevant match.'],
  ['What are you into?', 'Tell us what sounds good and we will find the right instructor and plan.'],
  ['Contact details', 'Where should our manager send the confirmed option?']
];

const INSTRUCTOR_STEPS = [
  ['Choose a convenient date and time', 'Pick the first and last day, then select the slots you would like on each day.'],
  ['Who will be taking the lesson?', 'General information about the group is enough — the instructor will confirm the details.'],
  ['Contact details', 'Where should our manager send the confirmation?']
];

const LANGUAGES = ['Russian', 'English', 'Georgian'];
const ACTIVITIES = ['Ski', 'Snowboard', 'Freeride', 'Sightseeing'];
const MESSENGERS = ['WhatsApp', 'Telegram', 'Viber'];

function toDateKey(date) {
  if (!date) return '';
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function daysInRange(range) {
  if (!range?.from) return [];
  const start = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate());
  const end = range.to ? new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate()) : start;
  const result = [];
  for (const date = start; date <= end; date.setDate(date.getDate() + 1)) result.push(new Date(date));
  return result;
}

function formatDate(date, options = { day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function formatRange(range) {
  if (!range?.from) return 'Dates not selected';
  if (!range.to || toDateKey(range.from) === toDateKey(range.to)) return formatDate(range.from);
  if (range.from.getMonth() === range.to.getMonth()) return `${range.from.getDate()}–${formatDate(range.to)}`;
  return `${formatDate(range.from)} – ${formatDate(range.to)}`;
}

function createInitialForm(instructor) {
  return {
    requestType: instructor ? 'specific_instructor' : 'manager_match',
    instructorSlug: instructor?.slug || '',
    instructorName: instructor?.name || '',
    dateRange: undefined,
    slotsByDate: {},
    companyType: 'Family',
    adultsCount: 1,
    childrenCount: 0,
    languages: ['Russian'],
    groupSkillLevel: 'Mixed',
    activities: ['Ski'],
    pace: 'Medium',
    skillLevel: 'Beginner',
    budget: 'Mid-range',
    notes: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    messenger: 'WhatsApp',
    website: ''
  };
}

function ChoiceGroup({ label, options, value, onChange, multiple = false }) {
  const selected = (option) => multiple ? value.includes(option) : value === option;
  return (
    <fieldset className="instructor-request-choice">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button className={selected(option) ? 'is-selected' : ''} type="button" aria-pressed={selected(option)} onClick={() => onChange(option)} key={option}>
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Counter({ label, value, min = 0, max = 10, onChange }) {
  return (
    <div className="instructor-request-counter">
      <span>{label}</span>
      <div>
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
        <strong>{value}</strong>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function DateAndTime({ isSpecific, range, slotsByDate, timeExpanded, onSelectRange, onToggleTime, onToggleSlot }) {
  const days = daysInRange(range);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasDates = days.length > 0;

  return (
    <div className={`instructor-request-dates ${isSpecific ? 'is-specific' : ''}`}>
      <div className="instructor-request-calendar-wrap">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={onSelectRange}
          disabled={{ before: today }}
          startMonth={today}
          endMonth={new Date(today.getFullYear() + 1, 11, 31)}
          max={30}
          resetOnSelect
          aria-label="Preferred lesson dates"
        />
        {isSpecific && !hasDates ? <p className="instructor-request-dates__placeholder">Select a start and end date<br />to add day rows here.</p> : null}
      </div>

      {!isSpecific && hasDates ? <button className="instructor-request-time-toggle" type="button" aria-expanded={timeExpanded} onClick={onToggleTime}>{timeExpanded ? '− Hide preferred time' : '+ Add preferred time'} <small>(optional)</small></button> : null}

      {(isSpecific || timeExpanded) && hasDates ? (
        <section className="instructor-request-slots" aria-label="Time slots by day">
          {!isSpecific ? <header><span>Time on each day <small>(optional)</small></span><button type="button" onClick={onToggleTime}>− Hide</button></header> : null}
          <div className="instructor-request-slots__labels" aria-hidden="true"><span /><span>slot 1 · 2h</span><span>slot 2 · 2h</span><span>slot 3 · 2h</span></div>
          {days.map((date, index) => {
            const key = toDateKey(date);
            const slots = slotsByDate[key] || [];
            return <div className="instructor-request-slots__row" key={key}>
              <div><strong>Day {index + 1}</strong><small>{formatDate(date, { day: '2-digit', month: '2-digit', year: '2-digit' })}</small></div>
              {TIME_SLOTS.map((slot) => <button className={slots.includes(slot.id) ? 'is-selected' : ''} type="button" aria-pressed={slots.includes(slot.id)} onClick={() => onToggleSlot(key, slot.id)} key={slot.id}>{slot.label}</button>)}
            </div>;
          })}
        </section>
      ) : null}
    </div>
  );
}

function Summary({ isSpecific, instructor, form, totalHours }) {
  const people = form.adultsCount + form.childrenCount;
  return (
    <aside className="instructor-request-summary" aria-label="Request summary">
      <header><span>Instructor</span><strong>{isSpecific ? instructor.name : 'We will match one'}</strong></header>
      <div className="instructor-request-summary__item"><span>Dates</span><strong>{form.dateRange ? formatRange(form.dateRange) : '—'}</strong>{form.dateRange ? <small>{totalHours ? `${totalHours} h selected` : 'time not specified'}</small> : null}</div>
      <div className="instructor-request-summary__item"><span>People</span><strong>{people ? `${form.companyType} · ${people}` : '—'}</strong>{form.childrenCount ? <small>{form.adultsCount} adults + {form.childrenCount} kid{form.childrenCount > 1 ? 's' : ''}</small> : null}</div>
      {!isSpecific && form.activities.length ? <div className="instructor-request-summary__item"><span>Preferences</span><strong>{form.activities.join(', ')}</strong></div> : null}
      <p>{isSpecific ? 'Final price after confirmation' : 'Price confirmed by manager'}</p>
    </aside>
  );
}

export function InstructorRequestDialog({ open, onOpenChange, instructor = null }) {
  const isSpecific = Boolean(instructor);
  const steps = isSpecific ? INSTRUCTOR_STEPS : MATCH_STEPS;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => createInitialForm(instructor));
  const [timeExpanded, setTimeExpanded] = useState(isSpecific);
  const [submitState, setSubmitState] = useState({ status: 'idle', error: '', requestCode: '' });
  const selectedDays = useMemo(() => daysInRange(form.dateRange), [form.dateRange]);
  const totalHours = useMemo(() => Object.values(form.slotsByDate).reduce((sum, slots) => sum + slots.length * 2, 0), [form.slotsByDate]);
  const peopleCount = form.adultsCount + form.childrenCount;

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setForm(createInitialForm(instructor));
    setTimeExpanded(Boolean(instructor));
    setSubmitState({ status: 'idle', error: '', requestCode: '' });
  }, [instructor, open]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleList = (key, value) => setForm((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  const selectRange = (range) => {
    const activeDates = new Set(daysInRange(range).map(toDateKey));
    setForm((current) => ({ ...current, dateRange: range, slotsByDate: Object.fromEntries(Object.entries(current.slotsByDate).filter(([date]) => activeDates.has(date))) }));
  };
  const toggleSlot = (date, slot) => setForm((current) => {
    const active = current.slotsByDate[date] || [];
    return { ...current, slotsByDate: { ...current.slotsByDate, [date]: active.includes(slot) ? active.filter((item) => item !== slot) : [...active, slot] } };
  });

  const isStepValid = useMemo(() => {
    if (step === 1) return isSpecific ? Boolean(selectedDays.length && totalHours) : Boolean(selectedDays.length);
    if (step === 2) return Boolean(peopleCount && form.languages.length);
    if (!isSpecific && step === 3) return true;
    return Boolean(form.contactName.trim() && form.contactPhone.trim() && form.messenger);
  }, [form.contactName, form.contactPhone, form.languages.length, form.messenger, isSpecific, peopleCount, selectedDays.length, step, totalHours]);

  const submit = async (event) => {
    event.preventDefault();
    if (!isStepValid || submitState.status === 'submitting') return;
    const sessionSlots = Object.fromEntries(Object.entries(form.slotsByDate).filter(([, slots]) => slots.length));
    const payload = {
      ...form,
      participantCount: peopleCount,
      dateRangeStart: toDateKey(form.dateRange?.from),
      dateRangeEnd: toDateKey(form.dateRange?.to || form.dateRange?.from),
      preferredDates: formatRange(form.dateRange),
      sessionSlots,
      timePreferences: [...new Set(Object.values(sessionSlots).flat())],
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

  const summaries = [
    `${formatRange(form.dateRange)}${totalHours ? ` · ${totalHours} h` : isSpecific ? '' : ' · time flexible'}`,
    `${form.companyType} · ${peopleCount} people`,
    !isSpecific ? `${form.activities.join(', ')} · ${form.pace}` : null
  ];
  const isSuccess = submitState.status === 'success';
  const title = isSpecific ? <>Book a lesson with <b>{instructor.name}</b></> : <>Request a lesson — <b>we will match an instructor</b></>;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="instructor-request-overlay" />
        <Dialog.Content className="instructor-request-dialog" aria-describedby="instructor-request-description" data-form-version="wireframe-2">
          <div className="instructor-request-dialog__bar">
            <span>My Gudauri<span>.</span></span>
            <span className="instructor-request-dialog__bar-links" aria-hidden="true">Instructors · Articles · About</span>
            <Dialog.Close className="instructor-request-dialog__close" aria-label="Close request">×</Dialog.Close>
          </div>
          {isSuccess ? (
            <div className="instructor-request-success">
              <div className="instructor-request-success__mark" aria-hidden="true">✓</div><span>Request sent</span><Dialog.Title>{isSpecific ? 'Your booking request has been sent.' : 'Your request has been sent.'}</Dialog.Title>
              <Dialog.Description id="instructor-request-description">We will reply via {form.messenger} to {isSpecific ? 'confirm the instructor and schedule' : 'confirm an instructor, weather and lesson plan'}.</Dialog.Description>
              {submitState.requestCode ? <p>Request ID <strong>{submitState.requestCode}</strong></p> : null}
              <ol><li>{isSpecific ? 'We check the instructor’s availability.' : 'Our manager selects an instructor and program.'}</li><li>We contact you to confirm the details.</li><li>You receive a secure payment link after confirmation.</li></ol>
              <Dialog.Close className="instructor-request-primary">Done</Dialog.Close>
            </div>
          ) : (
            <form onSubmit={submit}>
              <header className="instructor-request-dialog__heading">
                <Dialog.Close className="instructor-request-dialog__head-back" aria-label="Close request">← Back</Dialog.Close>
                <Dialog.Title>{title}</Dialog.Title>
              </header>
              <div className="instructor-request-dialog__layout">
                <div className="instructor-request-dialog__main">
                  {steps.map(([label, description], index) => {
                    const sectionStep = index + 1;
                    const active = sectionStep === step;
                    const complete = sectionStep < step;
                    if (!active) return <button className="instructor-request-step-summary" type="button" disabled={!complete} onClick={() => setStep(sectionStep)} key={label}><strong>{sectionStep}. {label}</strong><span>{complete ? summaries[index] : ''}{complete ? <em>Edit ↗</em> : null}</span></button>;
                    return <section className="instructor-request-step" key={label}>
                      <h3>{sectionStep}. {label}</h3><p>{description}</p>
                      {sectionStep === 1 ? <DateAndTime isSpecific={isSpecific} range={form.dateRange} slotsByDate={form.slotsByDate} timeExpanded={timeExpanded} onSelectRange={selectRange} onToggleTime={() => setTimeExpanded((value) => !value)} onToggleSlot={toggleSlot} /> : null}
                      {sectionStep === 2 ? <div className="instructor-request-stack"><ChoiceGroup label="Who’s coming" options={['Family', 'Friends', 'Solo']} value={form.companyType} onChange={(value) => update('companyType', value)} /><div className="instructor-request-counter-grid"><Counter label={isSpecific ? 'Adults' : 'Participants'} value={form.adultsCount} min={1} onChange={(value) => update('adultsCount', value)} /><Counter label="Kids under 12" value={form.childrenCount} onChange={(value) => update('childrenCount', value)} /></div>{isSpecific ? <ChoiceGroup label="Group skill level (average)" options={['Beginner', 'Mixed', 'Advanced']} value={form.groupSkillLevel} onChange={(value) => update('groupSkillLevel', value)} /> : null}<ChoiceGroup label="Instructor language" options={LANGUAGES} value={form.languages} multiple onChange={(value) => toggleList('languages', value)} />{isSpecific ? <label className="instructor-request-field"><span>Anything else <small>optional</small></span><textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Goals, rental needs or anything useful" rows="2" /></label> : null}</div> : null}
                      {!isSpecific && sectionStep === 3 ? <div className="instructor-request-stack"><ChoiceGroup label="Activity" options={ACTIVITIES} value={form.activities} multiple onChange={(value) => toggleList('activities', value)} /><ChoiceGroup label="Pace" options={['Relaxed', 'Medium', 'Adrenaline']} value={form.pace} onChange={(value) => update('pace', value)} /><ChoiceGroup label="Skill level (average)" options={['Beginner', 'Intermediate', 'Advanced']} value={form.skillLevel} onChange={(value) => update('skillLevel', value)} /><ChoiceGroup label="Budget per person" options={['Economy', 'Mid-range', 'Premium']} value={form.budget} onChange={(value) => update('budget', value)} /><label className="instructor-request-field"><span>Anything else <small>optional</small></span><textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Goals, children, equipment or special requests" rows="2" /></label></div> : null}
                      {sectionStep === steps.length ? <div className="instructor-request-contact"><label className="instructor-request-field"><span>Contact name</span><input value={form.contactName} onChange={(event) => update('contactName', event.target.value)} autoComplete="name" autoFocus /></label><div className="instructor-request-contact-grid"><label className="instructor-request-field"><span>Phone number</span><input value={form.contactPhone} onChange={(event) => update('contactPhone', event.target.value)} type="tel" autoComplete="tel" placeholder="+995 …" /></label><label className="instructor-request-field"><span>Email <small>optional</small></span><input value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} type="email" autoComplete="email" /></label></div><ChoiceGroup label="Preferred messenger" options={MESSENGERS} value={form.messenger} onChange={(value) => update('messenger', value)} /><label className="instructor-request-honeypot" aria-hidden="true">Website<input value={form.website} onChange={(event) => update('website', event.target.value)} tabIndex="-1" autoComplete="off" /></label><small className="instructor-request-dialog__privacy">Payment happens after confirmation. We use your details only to respond to this request.</small></div> : null}
                    </section>;
                  })}
                  {submitState.status === 'error' ? <p className="instructor-request-dialog__error" role="alert">{submitState.error}</p> : null}
                  <footer className="instructor-request-dialog__footer">{step > 1 ? <button className="instructor-request-back" type="button" onClick={() => setStep((value) => value - 1)}>← Back</button> : <span />}{step < steps.length ? <button className="instructor-request-primary" type="button" disabled={!isStepValid} onClick={() => setStep((value) => value + 1)}>Next <span aria-hidden="true">→</span></button> : <button className="instructor-request-primary" type="submit" disabled={!isStepValid || submitState.status === 'submitting'}>{submitState.status === 'submitting' ? 'Sending…' : 'Send request'} <span aria-hidden="true">→</span></button>}</footer>
                </div>
                <Summary isSpecific={isSpecific} instructor={instructor} form={form} totalHours={totalHours} />
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
