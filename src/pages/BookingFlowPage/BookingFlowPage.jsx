import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import '../../../styles/system.css';
import './BookingFlowPage.scss';

const SLOT_OPTIONS = [
  { id: 'slot-1', label: '10:00 - 12:00', hours: 2 },
  { id: 'slot-2', label: '12:30 - 14:30', hours: 2 },
  { id: 'slot-3', label: '15:00 - 17:00', hours: 2 }
];

const LANG_OPTIONS = ['English', 'Russian', 'Georgian'];
const MESSENGER_OPTIONS = ['WhatsApp', 'Telegram', 'Email'];
const SKILL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const REQUEST_ERROR_KEY = 'bookingForceError';
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CALENDAR_COLUMNS = 6;

function calculatePrice(hours, people) {
  return Math.round((hours / 2) * 200 + people * 23.5);
}

function normalizeDraft(draftRaw) {
  if (!draftRaw) return null;

  try {
    const parsed = JSON.parse(draftRaw);
    const hours = Number(parsed.hours);
    const participants = Number(parsed.participants);
    const safeHours = Number.isFinite(hours) && hours >= 2 ? hours : 2;
    const safePeople = Number.isFinite(participants) && participants >= 1 ? participants : 2;

    return {
      instructor: {
        name: parsed?.instructor?.name || 'Mikhail Andreev',
        avatar: parsed?.instructor?.avatar || '/assets/design-3/avatar-booking.jpg'
      },
      hours: safeHours,
      participants: safePeople,
      priceGel:
        Number.isFinite(Number(parsed.priceGel)) && Number(parsed.priceGel) > 0
          ? Number(parsed.priceGel)
          : calculatePrice(safeHours, safePeople)
    };
  } catch {
    return null;
  }
}

function createParticipant(idx) {
  return {
    id: `participant-${idx}-${Date.now()}`,
    fullName: '',
    age: '',
    skill: 'Beginner',
    notes: ''
  };
}

function makeInitialParticipants(count) {
  return Array.from({ length: count }, (_, idx) => createParticipant(idx + 1));
}

function toDateOnlyIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateOnlyIso(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDateShort(dateValue) {
  const date = typeof dateValue === 'string' ? fromDateOnlyIso(dateValue) : null;
  if (!date) return 'Not selected';
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).slice(-2)}`;
}

function formatDateCompact(dateValue) {
  const date = typeof dateValue === 'string' ? fromDateOnlyIso(dateValue) : null;
  if (!date) return '';
  return String(date.getDate());
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildCalendarGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: daysInMonth }, (_, idx) => new Date(year, month, idx + 1));

  let extraDay = 1;
  while (cells.length % CALENDAR_COLUMNS !== 0) {
    cells.push(new Date(year, month + 1, extraDay));
    extraDay += 1;
  }

  return cells;
}

function fakeSubmitRequest(payload) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const forceError = window.localStorage.getItem(REQUEST_ERROR_KEY) === '1';
      if (forceError) {
        reject(new Error('Unable to submit request right now. Please try again.'));
        return;
      }

      resolve({ requestId: `MG-${Math.floor(10000 + Math.random() * 89999)}`, payload });
    }, 700);
  });
}

export function BookingFlowPage() {
  const navigate = useNavigate();
  const draft = useMemo(
    () =>
      normalizeDraft(window.localStorage.getItem('bookingDraftV1')) || {
        instructor: { name: 'Mikhail Andreev', avatar: '/assets/design-3/avatar-booking.jpg' },
        hours: 2,
        participants: 2,
        priceGel: 247
      },
    []
  );

  const [activeStep, setActiveStep] = useState(1);
  const [calendarForDayId, setCalendarForDayId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date(2026, 2, 1)));
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [days, setDays] = useState([{ id: 'day-1', label: 'Day 1', date: null, slots: [] }]);
  const [participantCount, setParticipantCount] = useState(draft.participants);
  const [participants, setParticipants] = useState(() => makeInitialParticipants(draft.participants));
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: '',
    messenger: 'WhatsApp',
    language: 'English',
    comment: ''
  });
  const [confirmed, setConfirmed] = useState({ step1: null, step2: null, step3: null });
  const [submitState, setSubmitState] = useState({ status: 'idle', error: '', requestId: '' });
  const dateButtonRefs = useRef({});
  const calendarPopoverRef = useRef(null);

  const totalSelectedHours = useMemo(() => {
    return days.reduce((sum, day) => {
      const dayHours = day.slots.reduce((inner, slotId) => {
        const slot = SLOT_OPTIONS.find((item) => item.id === slotId);
        return inner + (slot ? slot.hours : 0);
      }, 0);

      return sum + dayHours;
    }, 0);
  }, [days]);

  const step1Valid = days.some((day) => day.date) && totalSelectedHours > 0;
  const step2Valid = participants.every((participant) => participant.fullName.trim() && participant.age.trim());
  const step3Valid = contact.name.trim() && contact.phone.trim() && contact.email.trim();

  const effectiveHours = confirmed.step1 ? confirmed.step1.totalHours : draft.hours;
  const effectivePeople = confirmed.step2 ? confirmed.step2.participants.length : participantCount;
  const effectivePrice = confirmed.step1
    ? calculatePrice(Math.max(effectiveHours, 2), Math.max(effectivePeople, 1))
    : draft.priceGel;

  const isSuccess = submitState.status === 'success';

  const updateDay = (dayId, updater) => {
    setDays((prev) => prev.map((day) => (day.id === dayId ? { ...day, ...updater(day) } : day)));
  };

  const openCalendar = (dayId) => {
    const buttonNode = dateButtonRefs.current[dayId];
    if (!buttonNode) return;

    const rect = buttonNode.getBoundingClientRect();
    const day = days.find((item) => item.id === dayId);
    const parsedDate = fromDateOnlyIso(day?.date);

    setCalendarMonth(startOfMonth(parsedDate || new Date(2026, 2, 1)));
    setCalendarPosition({
      left: Math.round(rect.left),
      top: Math.round(rect.bottom + 6)
    });
    setCalendarForDayId(dayId);
  };

  const selectDate = (dayId, selectedDate) => {
    updateDay(dayId, () => ({ date: toDateOnlyIso(selectedDate) }));
    setCalendarForDayId(null);
  };

  const toggleSlot = (dayId, slotId) => {
    updateDay(dayId, (day) => {
      if (!day.date) return {};

      const hasSlot = day.slots.includes(slotId);
      return {
        slots: hasSlot ? day.slots.filter((item) => item !== slotId) : [...day.slots, slotId]
      };
    });
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        id: `day-${prev.length + 1}-${Date.now()}`,
        label: `Day ${prev.length + 1}`,
        date: null,
        slots: []
      }
    ]);
  };

  useEffect(() => {
    if (!calendarForDayId) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setCalendarForDayId(null);
    };

    const closeOnOutsideClick = (event) => {
      const popoverNode = calendarPopoverRef.current;
      const buttonNode = dateButtonRefs.current[calendarForDayId];
      const target = event.target;

      if (popoverNode?.contains(target) || buttonNode?.contains(target)) return;
      setCalendarForDayId(null);
    };

    const closeOnViewportChange = () => setCalendarForDayId(null);

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('mousedown', closeOnOutsideClick);
    window.addEventListener('resize', closeOnViewportChange);
    window.addEventListener('scroll', closeOnViewportChange, true);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('mousedown', closeOnOutsideClick);
      window.removeEventListener('resize', closeOnViewportChange);
      window.removeEventListener('scroll', closeOnViewportChange, true);
    };
  }, [calendarForDayId]);

  const removeDay = (dayId) => {
    setDays((prev) => {
      if (prev.length === 1) {
        return [{ ...prev[0], date: null, slots: [] }];
      }

      return prev.filter((day) => day.id !== dayId).map((day, idx) => ({ ...day, label: `Day ${idx + 1}` }));
    });
  };

  const goStep2 = () => {
    if (!step1Valid) return;

    const selectedDates = days
      .filter((day) => day.date)
      .map((day) => fromDateOnlyIso(day.date))
      .filter(Boolean)
      .sort((a, b) => a - b);

    const sameMonth = selectedDates.every((date) => date.getMonth() === selectedDates[0]?.getMonth() && date.getFullYear() === selectedDates[0]?.getFullYear());
    const dateSummary = sameMonth
      ? `${selectedDates.map((date) => date.getDate()).join(', ')} ${MONTH_NAMES[selectedDates[0].getMonth()]}`
      : selectedDates.map((date) => formatDateShort(toDateOnlyIso(date))).join(', ');

    setConfirmed((prev) => ({
      ...prev,
      step1: {
        days: days.filter((day) => day.date),
        totalHours: totalSelectedHours,
        summary: `${dateSummary} • ${totalSelectedHours} hours`
      }
    }));

    setActiveStep(2);
  };

  const setParticipantField = (participantId, field, value) => {
    setParticipants((prev) => prev.map((item) => (item.id === participantId ? { ...item, [field]: value } : item)));
  };

  const addParticipant = () => {
    setParticipantCount((prev) => prev + 1);
    setParticipants((prev) => [...prev, createParticipant(prev.length + 1)]);
  };

  const removeParticipant = (participantId) => {
    setParticipants((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((item) => item.id !== participantId);
      setParticipantCount(filtered.length);
      return filtered;
    });
  };

  const goStep3 = () => {
    if (!step2Valid) return;

    const names = participants
      .map((participant) => participant.fullName.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(', ');

    setConfirmed((prev) => ({
      ...prev,
      step2: {
        participants,
        summary: `${participants.length} peple • ${names || '—'}`
      }
    }));

    setActiveStep(3);
  };

  const goStep4 = () => {
    if (!step3Valid) return;

    setConfirmed((prev) => ({
      ...prev,
      step3: {
        ...contact,
        summary: `${contact.phone} • ${contact.messenger}`
      }
    }));

    setActiveStep(4);
  };

  const submitRequest = async () => {
    if (!(confirmed.step1 && confirmed.step2 && confirmed.step3)) return;

    setSubmitState({ status: 'loading', error: '', requestId: '' });

    try {
      const response = await fakeSubmitRequest({
        instructor: draft.instructor,
        days: confirmed.step1.days,
        totalHours: confirmed.step1.totalHours,
        participants: confirmed.step2.participants,
        contact: confirmed.step3,
        priceSnapshot: effectivePrice
      });

      setSubmitState({ status: 'success', error: '', requestId: response.requestId });
    } catch (error) {
      setSubmitState({ status: 'error', error: error.message, requestId: '' });
    }
  };

  const copyRequestId = async () => {
    if (!submitState.requestId) return;

    try {
      await navigator.clipboard.writeText(submitState.requestId);
    } catch {
      // no-op
    }
  };

  const summaryDaysLabel = confirmed.step1
    ? `${confirmed.step1.days.map((day) => formatDateShort(day.date)).join(', ')}`
    : 'Not selected';
  const isInitialSummary = !isSuccess && activeStep === 1 && !confirmed.step1 && !confirmed.step2 && !confirmed.step3;

  return (
    <div className="booking-flow-page">
      <div className="container booking-flow-page__header-brand-wrap">
        <p className="site-nav__brand booking-flow-page__brand" aria-label="My Gudauri">
          <span className="site-nav__brand-muted">My </span>
          Gudauri
        </p>
      </div>

      <div className="booking-flow-page__header-line" />

      <div className="container booking-flow-page__header">
        <button className="ui-btn-md" type="button" onClick={() => navigate('/profile')}>
          <img className="ui-btn-md__arrow ui-btn-md__arrow--left" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
          Back
        </button>
        <h1>
          Book a lesson with <b>{draft.instructor.name}</b>
        </h1>
      </div>

      <div className="container booking-flow-page__content">
        <section className="booking-flow-page__left" aria-label="Booking flow steps">
          {!isSuccess && (
            <>
              <article className={`booking-step booking-step--dates ${activeStep === 1 ? 'is-open' : ''}`}>
                <header className="booking-step__head">
                  <h2>1. {activeStep === 1 ? 'Choose a convenient date and time' : 'Dates & time'}</h2>
                  {confirmed.step1 && activeStep !== 1 ? (
                    <>
                      <p className="booking-step__summary">{confirmed.step1.summary}</p>
                      <button className="booking-step__edit" type="button" onClick={() => setActiveStep(1)}>
                        Edit
                        <img src="/assets/design-4/icon-edit.png" alt="" aria-hidden="true" />
                      </button>
                    </>
                  ) : null}
                </header>

                {activeStep === 1 ? (
                  <div className="booking-step__body">
                    <div className="booking-day-labels">
                      <span>date</span>
                      <span>slot 1 (2h)</span>
                      <span>slot 2 (2h)</span>
                      <span>slot 3 (2h)</span>
                    </div>

                    <div className="booking-day-list">
                      {days.map((day) => (
                        <div className="booking-day-row" key={day.id}>
                          <button className="ui-icon-btn" type="button" onClick={() => removeDay(day.id)} aria-label={`Remove ${day.label}`} />
                          <span className="booking-day-name">{day.label}</span>

                          {day.date ? (
                            <button
                              ref={(node) => {
                                dateButtonRefs.current[day.id] = node;
                              }}
                              className="ui-btn-md booking-date-btn booking-date-btn--selected"
                              type="button"
                              onClick={() => openCalendar(day.id)}
                            >
                              {formatDateShort(day.date)}
                            </button>
                          ) : (
                            <button
                              ref={(node) => {
                                dateButtonRefs.current[day.id] = node;
                              }}
                              className="ui-btn-md booking-date-btn"
                              type="button"
                              onClick={() => openCalendar(day.id)}
                            >
                              Add date
                            </button>
                          )}

                          {SLOT_OPTIONS.map((slot) => {
                            const isSelected = day.slots.includes(slot.id);
                            const isDisabled = !day.date;
                            return (
                              <button
                                className={`booking-slot-btn ${isSelected ? 'is-selected' : ''}`}
                                key={slot.id}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => toggleSlot(day.id, slot.id)}
                              >
                                {slot.label}
                              </button>
                            );
                          })}

                        </div>
                      ))}
                    </div>

                    {calendarForDayId
                      ? createPortal(
                        <div
                          ref={calendarPopoverRef}
                          className="booking-calendar-popover"
                          style={{ top: `${calendarPosition.top}px`, left: `${calendarPosition.left}px` }}
                          role="dialog"
                          aria-modal="false"
                          aria-label="Calendar"
                        >
                          <div className="booking-calendar-head">
                            <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth((prev) => addMonths(prev, -1))}>
                              <img src="/assets/design-4/calendar-arrow-left.svg" alt="" aria-hidden="true" />
                            </button>
                            <span>{MONTH_NAMES[calendarMonth.getMonth()]}</span>
                            <button type="button" aria-label="Next month" onClick={() => setCalendarMonth((prev) => addMonths(prev, 1))}>
                              <img src="/assets/design-4/calendar-arrow-right.svg" alt="" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="booking-calendar-grid">
                            {buildCalendarGrid(calendarMonth).map((dateValue) => {
                              const iso = toDateOnlyIso(dateValue);
                              const activeDay = days.find((item) => item.id === calendarForDayId);
                              const isSelected = activeDay?.date === iso;
                              const isOutsideMonth = dateValue.getMonth() !== calendarMonth.getMonth();
                              return (
                                <button
                                  type="button"
                                  key={iso}
                                  className={`${isSelected ? 'is-active' : ''} ${isOutsideMonth ? 'is-outside' : ''}`}
                                  onClick={() => selectDate(calendarForDayId, dateValue)}
                                >
                                  {dateValue.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>,
                        document.body
                      )
                      : null}

                    <div className="booking-step__actions">
                      <button className="ui-btn-md ui-btn-md--soft" type="button" onClick={() => navigate('/profile')}>
                        <img className="ui-btn-md__arrow ui-btn-md__arrow--left" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                        Back
                      </button>

                      <button className="ui-btn-md booking-add-btn" type="button" onClick={addDay}>
                        + Add another day
                      </button>

                      <button className="ui-btn-md ui-btn-md--filled" type="button" onClick={goStep2} disabled={!step1Valid}>
                        Next
                        <img className="ui-btn-md__arrow" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>

              <article className={`booking-step booking-step--participants ${activeStep === 2 ? 'is-open' : ''}`}>
                <header className="booking-step__head">
                  <h2>2. Information about participants</h2>
                  {confirmed.step2 && activeStep !== 2 ? (
                    <>
                      <p className="booking-step__summary">{confirmed.step2.summary}</p>
                      <button className="booking-step__edit" type="button" onClick={() => setActiveStep(2)}>
                        Edit
                        <img src="/assets/design-4/icon-edit.png" alt="" aria-hidden="true" />
                      </button>
                    </>
                  ) : null}
                </header>

                {activeStep === 2 ? (
                  <div className="booking-step__body booking-step__body--participants">
                    <div className="participant-list">
                      {participants.map((participant, idx) => (
                        <article className="participant-card" key={participant.id}>
                          <div className="participant-card__head">
                            <button className="ui-icon-btn" type="button" onClick={() => removeParticipant(participant.id)} aria-label={`Remove participant ${idx + 1}`} />
                            <h3>Participant {idx + 1}</h3>
                          </div>

                          <div className="participant-grid">
                            <label>
                              <span>1. Full name</span>
                              <input
                                type="text"
                                value={participant.fullName}
                                placeholder="Name"
                                onChange={(event) => setParticipantField(participant.id, 'fullName', event.target.value)}
                              />
                            </label>

                            <label>
                              <span>2. Age</span>
                              <input
                                type="text"
                                value={participant.age}
                                placeholder="25"
                                onChange={(event) => setParticipantField(participant.id, 'age', event.target.value)}
                              />
                            </label>
                          </div>

                          <label className="participant-skill">
                            <span>3. Skill level</span>
                            <div className="segment-control">
                              {SKILL_OPTIONS.map((skill) => (
                                <button
                                  key={skill}
                                  type="button"
                                  className={participant.skill === skill ? 'is-active' : ''}
                                  onClick={() => setParticipantField(participant.id, 'skill', skill)}
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          </label>

                          <label>
                            <span>4. Additional notes</span>
                            <input
                              type="text"
                              placeholder="Injuries, fears, goals, or anything the instructor should know."
                              value={participant.notes}
                              onChange={(event) => setParticipantField(participant.id, 'notes', event.target.value)}
                            />
                          </label>
                        </article>
                      ))}
                    </div>

                    <div className="booking-step__actions">
                      <button className="ui-btn-md ui-btn-md--soft" type="button" onClick={() => setActiveStep(1)}>
                        <img className="ui-btn-md__arrow ui-btn-md__arrow--left" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                        Back
                      </button>

                      <button className="ui-btn-md booking-add-btn" type="button" onClick={addParticipant}>
                        + Add participant
                      </button>

                      <button className="ui-btn-md ui-btn-md--filled" type="button" onClick={goStep3} disabled={!step2Valid}>
                        Next
                        <img className="ui-btn-md__arrow" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>

              <article className={`booking-step booking-step--contact ${activeStep === 3 ? 'is-open' : ''}`}>
                <header className="booking-step__head">
                  <h2>3. Contact details</h2>
                  {confirmed.step3 && activeStep !== 3 ? (
                    <>
                      <p className="booking-step__summary">{confirmed.step3.summary}</p>
                      <button className="booking-step__edit" type="button" onClick={() => setActiveStep(3)}>
                        Edit
                        <img src="/assets/design-4/icon-edit.png" alt="" aria-hidden="true" />
                      </button>
                    </>
                  ) : null}
                </header>

                {activeStep === 3 ? (
                  <div className="booking-step__body booking-step__body--contact">
                    <label>
                      <span>1. Сontact name</span>
                      <input
                        type="text"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(event) => setContact((prev) => ({ ...prev, name: event.target.value }))}
                      />
                    </label>

                    <div className="booking-contact-grid">
                      <label>
                        <span>2. Phone number</span>
                        <input
                          type="text"
                          placeholder="+7 916 121 06 06"
                          value={contact.phone}
                          onChange={(event) => setContact((prev) => ({ ...prev, phone: event.target.value }))}
                        />
                      </label>

                      <label>
                        <span>3. Email</span>
                        <input
                          type="email"
                          placeholder="mail@example.com"
                          value={contact.email}
                          onChange={(event) => setContact((prev) => ({ ...prev, email: event.target.value }))}
                        />
                      </label>
                    </div>

                    <div className="booking-contact-group">
                      <span>Select a messenger for communication</span>
                      <div className="segment-control segment-control--messenger">
                        {MESSENGER_OPTIONS.map((messenger) => (
                          <button
                            key={messenger}
                            type="button"
                            className={contact.messenger === messenger ? 'is-active' : ''}
                            onClick={() => setContact((prev) => ({ ...prev, messenger }))}
                          >
                            {messenger}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="booking-contact-group">
                      <span>4. Language for communication</span>
                      <div className="segment-control">
                        {LANG_OPTIONS.map((language) => (
                          <button
                            key={language}
                            type="button"
                            className={contact.language === language ? 'is-active' : ''}
                            onClick={() => setContact((prev) => ({ ...prev, language }))}
                          >
                            {language}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label>
                      <span>5. Additional comment</span>
                      <input
                        type="text"
                        placeholder="Goals, concerns or special requests"
                        value={contact.comment}
                        onChange={(event) => setContact((prev) => ({ ...prev, comment: event.target.value }))}
                      />
                    </label>

                    <div className="booking-step__actions">
                      <button className="ui-btn-md ui-btn-md--soft" type="button" onClick={() => setActiveStep(2)}>
                        <img className="ui-btn-md__arrow ui-btn-md__arrow--left" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                        Back
                      </button>

                      <button className="ui-btn-md ui-btn-md--filled" type="button" onClick={goStep4} disabled={!step3Valid}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>

              {activeStep === 4 ? null : null}
            </>
          )}

          {!isSuccess && activeStep === 4 ? (
            <article className="booking-step booking-step--review">
              <header className="booking-step__head">
                <h2>1. Dates & time</h2>
                <p className="booking-step__summary">{confirmed.step1?.summary}</p>
                <button className="booking-step__edit" type="button" onClick={() => setActiveStep(1)}>
                  Edit
                  <img src="/assets/design-4/icon-edit.png" alt="" aria-hidden="true" />
                </button>
              </header>

              <header className="booking-step__head">
                <h2>2. Information about participants</h2>
                <p className="booking-step__summary">{confirmed.step2?.summary}</p>
                <button className="booking-step__edit" type="button" onClick={() => setActiveStep(2)}>
                  Edit
                  <img src="/assets/design-4/icon-edit.png" alt="" aria-hidden="true" />
                </button>
              </header>

              <header className="booking-step__head">
                <h2>3. Contact details</h2>
                <p className="booking-step__summary">{confirmed.step3?.summary}</p>
                <button className="booking-step__edit" type="button" onClick={() => setActiveStep(3)}>
                  Edit
                  <img src="/assets/design-4/icon-edit.png" alt="" aria-hidden="true" />
                </button>
              </header>
            </article>
          ) : null}

          {isSuccess ? (
            <section className="booking-success-card">
              <img className="booking-success-card__icon" src="/assets/design-4/icon-done.png" alt="Success" />
              <h2>Your booking request has been sent</h2>

              <p className="booking-success-card__label">Request ID</p>
              <button className="booking-success-card__request" type="button" onClick={copyRequestId}>
                {submitState.requestId}
                <img src="/assets/design-4/icon-copy.png" alt="" aria-hidden="true" />
              </button>

              <p className="booking-success-card__hint">*Please save your request ID - it may be useful if you contact support.</p>

              <div className="booking-success-card__next">
                <h3>What happens next</h3>
                <ol>
                  <li>We check the instructor’s availability</li>
                  <li>We contact you to confirm the details</li>
                  <li>You receive a secure payment link for the prepayment</li>
                </ol>
              </div>

              <div className="booking-success-card__links">
                <a href="https://t.me" target="_blank" rel="noreferrer">Go to messenger</a>
                <a href="mailto:support@mygudauri.com">Contact support</a>
                <Link to="/instructors">Back to instructors</Link>
                <Link to="/">Back to home</Link>
              </div>
            </section>
          ) : null}
        </section>

        <div className="booking-summary-column">
          <aside className={`booking-summary ${isInitialSummary ? 'booking-summary--initial' : ''}`} aria-label="Booking summary">
            <div className="booking-summary__head">
              <img src={draft.instructor.avatar} alt={draft.instructor.name} />
              <div>
                <p>Instructor</p>
                <h3>{draft.instructor.name}</h3>
              </div>
            </div>

            {!isSuccess ? (
              <>
                <div className={`booking-summary__stat booking-summary__stat--hours ${confirmed.step1 ? '' : 'booking-summary__stat--empty'}`}>
                  <div>
                    <b>{summaryDaysLabel}</b>
                    <span>{confirmed.step1 ? 'March' : ''}</span>
                  </div>
                  <p>
                    {confirmed.step1 ? confirmed.step1.totalHours : 0} <span>hour</span>
                  </p>
                </div>

                <div className={`booking-summary__stat booking-summary__stat--people ${activeStep >= 2 || confirmed.step2 ? 'booking-summary__stat--highlight' : ''}`}>
                  <div>
                    <b>{effectivePeople}</b>
                    <span>peple</span>
                  </div>
                  {confirmed.step2 ? <p>{confirmed.step2.participants.map((item) => item.fullName).filter(Boolean).slice(0, 2).join(', ')}</p> : null}
                </div>

                {confirmed.step3 ? (
                  <div className="booking-summary__contact">
                    <div><span>Сontact name</span><p>{confirmed.step3.name}</p></div>
                    <div><span>Phone number</span><p>{confirmed.step3.phone}</p></div>
                    <div><span>Messenger</span><p>{confirmed.step3.messenger}</p></div>
                  </div>
                ) : null}

                <div className="booking-summary__price">
                  <strong>{effectivePrice} gel</strong>
                  <p>
                    for <b>{Math.max(effectiveHours, 0)} hour</b> & <b>{Math.max(effectivePeople, 1)} peple</b>
                  </p>
                </div>

                {activeStep === 4 ? (
                  <>
                    <button className="ui-btn-lg ui-btn-lg--filled booking-summary__submit" type="button" onClick={submitRequest} disabled={submitState.status === 'loading'}>
                      {submitState.status === 'loading' ? 'Sending...' : 'Send a request'}
                    </button>

                    {submitState.status === 'error' ? <p className="booking-summary__error">{submitState.error}</p> : null}
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div className="booking-summary__list-block">
                  <h4>lesson days</h4>
                  <div>
                    {confirmed.step1?.days.map((day) => (
                      <p key={day.id}>
                        <span>{formatDateShort(day.date)}</span>
                        <b>{day.slots.length * 2}h</b>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="booking-summary__list-block">
                  <h4>Information</h4>
                  <div>
                    <p><span>Participants</span><b>{effectivePeople}</b></p>
                    <p><span>Сontact name</span><b>{confirmed.step3?.name}</b></p>
                    <p><span>Phone number</span><b>{confirmed.step3?.phone}</b></p>
                    <p><span>Messenger</span><b>{confirmed.step3?.messenger}</b></p>
                  </div>
                </div>
              </>
            )}
          </aside>

          {!isSuccess && activeStep === 4 ? (
            <div className="booking-summary__info-card">
              <p className="booking-summary__info-title">
                <img src="/assets/design-4/icon-info.png" alt="" aria-hidden="true" />
                What happens next?
              </p>
              <p>
                After submitting your request, our manager will contact you to confirm the lesson details and send a payment link for the prepayment
              </p>
              <img className="booking-summary__operator" src="/assets/design-4/info-operator.png" alt="" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
