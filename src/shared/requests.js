/**
 * The request pipeline, shared by the intake API, the admin API and the CRM UI.
 *
 * Every guest form on the site ends in one row of `requests`, whatever the
 * category. The operator works that single queue: status → card → action. The
 * status model below is the contract all three sides agree on, so a transition
 * the API refuses can never be offered as a button.
 */

export const REQUEST_STATUSES = Object.freeze(['new', 'in_progress', 'waiting_guest', 'waiting_payment', 'confirmed', 'completed', 'cancelled']);

export const REQUEST_STATUS_LABELS = Object.freeze({
  new: 'Новая',
  in_progress: 'В работе',
  waiting_guest: 'Ждёт гостя',
  waiting_payment: 'Ждёт оплаты',
  confirmed: 'Подтверждена',
  completed: 'Завершена',
  cancelled: 'Отменена',
});

/** What each status means for the operator, shown next to the status control. */
export const REQUEST_STATUS_HINTS = Object.freeze({
  new: 'Пришла с сайта. Ответить в течение часа.',
  in_progress: 'Оператор разбирает заявку и проверяет календарь.',
  waiting_guest: 'Гостю предложено другое время — ждём ответа.',
  waiting_payment: 'Время подтверждено, слот занят, ссылка у гостя.',
  confirmed: 'Оплата получена, контакты переданы гостю и объекту.',
  completed: 'Занятие прошло — можно запросить отзыв.',
  cancelled: 'Заявка закрыта, слот освобождён.',
});

export const REQUEST_STATUS_TONES = Object.freeze({
  new: 'warning',
  // Being handled is not a warning and not a success: it reads as the dark,
  // neutral “someone has this” state rather than an alarm.
  in_progress: 'inverse',
  waiting_guest: 'neutral',
  waiting_payment: 'warning',
  confirmed: 'success',
  completed: 'neutral',
  cancelled: 'danger',
});

/**
 * A confirmed slot is a busy slot: these are the statuses that hold a place in
 * the object calendar. Cancelling or letting a payment lapse frees it again.
 */
export const BLOCKING_REQUEST_STATUSES = Object.freeze(['waiting_payment', 'confirmed', 'completed']);
export const OPEN_REQUEST_STATUSES = Object.freeze(['new', 'in_progress', 'waiting_guest', 'waiting_payment']);

export const REQUEST_PAYMENT_STATES = Object.freeze(['none', 'link_created', 'link_sent', 'paid']);
export const REQUEST_PAYMENT_LABELS = Object.freeze({
  none: 'Не выставлена',
  link_created: 'Ссылка создана',
  link_sent: 'Отправлена гостю',
  paid: 'Оплачено',
});

export const REQUEST_CATEGORIES = Object.freeze(['instructors', 'activities', 'transfers', 'rental', 'stays', 'services', 'places']);
export const REQUEST_CATEGORY_LABELS = Object.freeze({
  instructors: 'Инструктор',
  activities: 'Активность',
  transfers: 'Трансфер',
  rental: 'Прокат',
  stays: 'Проживание',
  services: 'Услуга',
  places: 'Место',
});

export const REQUEST_SOURCES = Object.freeze(['object_page', 'manager_match', 'booking_flow']);
export const REQUEST_SOURCE_LABELS = Object.freeze({
  object_page: 'со страницы объекта',
  manager_match: 'подбор менеджером',
  booking_flow: 'из формы бронирования',
});

/** The three bookable lesson slots the public booking flow offers. */
export const REQUEST_TIME_SLOTS = Object.freeze([
  { id: 'morning', start: '10:00', end: '12:00', label: '10:00–12:00' },
  { id: 'midday', start: '12:30', end: '14:30', label: '12:30–14:30' },
  { id: 'afternoon', start: '15:00', end: '17:00', label: '15:00–17:00' },
]);

export const requestTimeSlot = (id) => REQUEST_TIME_SLOTS.find((slot) => slot.id === id) ?? null;

/** A payment link the guest never opens must not hold a slot forever. */
export const PAYMENT_WINDOW_HOURS = 24;
/** Offered alternatives are held for the same window, then released. */
export const SLOT_OFFER_WINDOW_HOURS = 24;

/**
 * Transitions an operator may pick by hand. The rest of the model is driven by
 * actions — confirming a slot, sending a payment link, cancelling — because
 * those carry side effects the queue cannot invent from a status alone.
 */
export const REQUEST_STATUS_TRANSITIONS = Object.freeze({
  new: ['in_progress', 'waiting_guest', 'cancelled'],
  in_progress: ['new', 'waiting_guest', 'cancelled'],
  waiting_guest: ['in_progress', 'cancelled'],
  waiting_payment: ['in_progress', 'confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: ['confirmed'],
  cancelled: ['in_progress'],
});

export const canTransition = (from, to) => Boolean(REQUEST_STATUS_TRANSITIONS[from]?.includes(to));

export const isBlockingStatus = (status) => BLOCKING_REQUEST_STATUSES.includes(status);

/** Two slots on one day collide when they overlap at all, not only exactly. */
export function slotsOverlap(a, b) {
  if (!a?.date || !b?.date || a.date !== b.date) return false;
  const start = (value, fallback) => value || fallback;
  const aStart = start(a.start, '00:00');
  const aEnd = start(a.end, '23:59');
  const bStart = start(b.start, '00:00');
  const bEnd = start(b.end, '23:59');
  return aStart < bEnd && bStart < aEnd;
}

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

/** «Пн 12 янв» — the queue and the calendar need the weekday to scan quickly. */
export function formatRequestDate(date, { weekday = true } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) return '';
  const parsed = new Date(`${date}T12:00:00Z`);
  const day = `${parsed.getUTCDate()} ${MONTHS[parsed.getUTCMonth()]}`;
  if (!weekday) return day;
  const name = WEEKDAYS[parsed.getUTCDay()];
  return `${name[0].toUpperCase()}${name.slice(1)} ${day}`;
}

/**
 * The one-line schedule the queue row and the card header both show.
 *
 * A concrete time always wins over the range the guest picked from: once an
 * hour is on the table, that is the thing the operator answers and the calendar
 * checks. The full range stays visible in the request details.
 */
export function formatRequestSchedule({ scheduled_date: date, scheduled_end_date: endDate, scheduled_start: start, scheduled_end: end, schedule_label: label } = {}) {
  if (!date) return label || '—';
  if (start) return `${formatRequestDate(date)}, ${start}${end ? `–${end}` : ''}`;
  if (endDate && endDate !== date) return `${formatRequestDate(date, { weekday: false })} – ${formatRequestDate(endDate, { weekday: false })}`;
  return formatRequestDate(date);
}

/** Relative age of a request, the way an inbox reads it. */
export function formatRequestAge(value, now = Date.now()) {
  if (!value) return '—';
  const created = new Date(value.includes('T') ? value : `${value}Z`).getTime();
  if (Number.isNaN(created)) return '—';
  const minutes = Math.max(0, Math.round((now - created) / 60_000));
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ч`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'вчера';
  if (days < 30) return `${days} дн`;
  return formatRequestDate(value.slice(0, 10), { weekday: false });
}

export function formatRequestAmount(amount, currency = 'GEL') {
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) return '—';
  const symbol = currency === 'GEL' ? '₾' : currency;
  return `${new Intl.NumberFormat('ru-RU').format(Math.round(Number(amount)))} ${symbol}`;
}
