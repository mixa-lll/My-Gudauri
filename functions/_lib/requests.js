import {
  BLOCKING_REQUEST_STATUSES,
  PAYMENT_WINDOW_HOURS,
  REQUEST_PAYMENT_LABELS,
  REQUEST_PAYMENT_STATES,
  REQUEST_STATUS_LABELS,
  SLOT_OFFER_WINDOW_HOURS,
  canTransition,
  formatRequestDate,
  slotsOverlap,
} from '../../src/shared/requests.js';

/**
 * The server side of the request pipeline.
 *
 * Intake endpoints call `insertRequest`; the admin API calls the readers and
 * `applyRequestAction`. Every state change goes through one place, so the
 * history is written by the same code that moves the status — an operator can
 * never see a status the timeline cannot explain.
 */

const BLOCKING_LIST = BLOCKING_REQUEST_STATUSES.map((status) => `'${status}'`).join(', ');
const LIST_COLUMNS = `id, request_code, category, source, source_label, object_slug, object_name, object_kicker,
  object_image_url, scheduled_date, scheduled_end_date, scheduled_start, scheduled_end, schedule_label,
  guest_count, amount, currency, contact_name, contact_phone, contact_email, messenger, status,
  payment_state, payment_due_at, operator, created_at, updated_at, status_changed_at`;

export const text = (value, maxLength = 500) => (typeof value === 'string' ? value.trim().slice(0, maxLength) : '');
export const dateValue = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(value ?? '') ? value : null);
export const timeValue = (value) => (/^\d{2}:\d{2}$/.test(value ?? '') ? value : null);

/** D1 writes CURRENT_TIMESTAMP as UTC `YYYY-MM-DD HH:MM:SS`; ours must match. */
const stamp = (offsetHours = 0) => new Date(Date.now() + offsetHours * 3_600_000).toISOString().replace('T', ' ').slice(0, 19);

export function newRequestCode() {
  return `MG-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

const parseJson = (value, fallback) => { try { return JSON.parse(value ?? ''); } catch { return fallback; } };

/**
 * The queue reads better with the object's own photo, but a missing picture is
 * never a reason to lose a request — the lookup fails quietly to a placeholder.
 */
const IMAGE_TABLES = { instructors: 'instructors', activities: 'activities', transfers: 'transfers' };
export async function objectImage(db, category, slug) {
  const table = IMAGE_TABLES[category];
  if (!table || !slug) return null;
  try {
    const row = await db.prepare(`SELECT card_image_url FROM ${table} WHERE slug = ?`).bind(slug).first();
    return row?.card_image_url ?? null;
  } catch {
    return null;
  }
}

async function addEvent(db, requestId, kind, message, actor = 'operator') {
  await db.prepare('INSERT INTO request_events (request_id, kind, message, actor) VALUES (?, ?, ?, ?)')
    .bind(requestId, kind, message, actor).run();
}

/**
 * One guest request, whatever form it came from.
 *
 * The caller has already validated its own flow — this only normalises what the
 * queue and the calendar need to read, and keeps the rest in `details`.
 */
export async function insertRequest(db, input) {
  const requestCode = input.requestCode || newRequestCode();
  const result = await db.prepare(`
    INSERT INTO requests (
      request_code, category, source, source_label, object_slug, object_name, object_kicker, object_image_url,
      scheduled_date, scheduled_end_date, scheduled_start, scheduled_end, schedule_label,
      guest_count, amount, currency, contact_name, contact_phone, contact_email, messenger,
      guest_note, details_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    requestCode,
    text(input.category, 40),
    text(input.source, 40) || 'object_page',
    text(input.sourceLabel, 120) || null,
    text(input.objectSlug, 120) || null,
    text(input.objectName, 160) || null,
    text(input.objectKicker, 120) || null,
    text(input.objectImageUrl, 400) || null,
    dateValue(input.scheduledDate),
    dateValue(input.scheduledEndDate),
    timeValue(input.scheduledStart),
    timeValue(input.scheduledEnd),
    text(input.scheduleLabel, 180) || null,
    Math.max(1, Math.min(99, Number.parseInt(input.guestCount, 10) || 1)),
    Number.isFinite(Number(input.amount)) && Number(input.amount) > 0 ? Number(input.amount) : null,
    text(input.currency, 8) || 'GEL',
    text(input.contactName, 100),
    text(input.contactPhone, 80),
    text(input.contactEmail, 160) || null,
    text(input.messenger, 40) || null,
    text(input.guestNote, 1200) || null,
    JSON.stringify(input.details ?? {}),
  ).run();

  await addEvent(db, result.meta.last_row_id, 'created', text(input.arrivalNote, 200) || 'Заявка получена — форма на сайте', 'guest');
  return requestCode;
}

/** The queue: newest first, unanswered requests pinned to the top. */
export async function listAdminRequests(db, limit = 500) {
  const { results } = await db.prepare(`
    SELECT ${LIST_COLUMNS} FROM requests
    ORDER BY (status = 'new') DESC, created_at DESC
    LIMIT ?
  `).bind(limit).all();
  return results;
}

/**
 * What the object already has booked around the requested day.
 *
 * A confirmed request is a busy slot, so the same table answers “is this time
 * free?” — there is no second calendar to keep in sync.
 */
export async function objectCalendar(db, request, windowDays = 3) {
  if (!request.object_slug || !request.scheduled_date) return null;
  const day = (offset) => new Date(`${request.scheduled_date}T12:00:00Z`).getTime() + offset * 86_400_000;
  const key = (time) => new Date(time).toISOString().slice(0, 10);
  const from = key(day(-1));
  const to = key(day(windowDays - 1));

  const { results } = await db.prepare(`
    SELECT id, request_code, contact_name, scheduled_date, scheduled_start, scheduled_end, status, guest_count
    FROM requests
    WHERE category = ? AND object_slug = ? AND id != ?
      AND status IN (${BLOCKING_LIST})
      AND scheduled_date BETWEEN ? AND ?
    ORDER BY scheduled_date, scheduled_start
  `).bind(request.category, request.object_slug, request.id, from, to).all();

  const requested = { date: request.scheduled_date, start: request.scheduled_start, end: request.scheduled_end };
  const days = [];
  for (let offset = -1; offset < windowDays; offset += 1) {
    const date = key(day(offset));
    days.push({
      date,
      label: formatRequestDate(date),
      isRequested: date === request.scheduled_date,
      bookings: results.filter((item) => item.scheduled_date === date).map((item) => ({
        requestCode: item.request_code,
        guest: item.contact_name,
        start: item.scheduled_start,
        end: item.scheduled_end,
        status: item.status,
      })),
    });
  }

  const conflicts = results
    .filter((item) => slotsOverlap(requested, { date: item.scheduled_date, start: item.scheduled_start, end: item.scheduled_end }))
    .map((item) => ({ requestCode: item.request_code, guest: item.contact_name, start: item.scheduled_start, end: item.scheduled_end }));

  // Free slots the operator can offer instead, drawn from the same window. The
  // guest asked for a day: alternatives on that day come first, past days are
  // never offered at all.
  const today = new Date().toISOString().slice(0, 10);
  const free = days.flatMap((entry) => ['10:00', '12:30', '15:00']
    .filter((start) => !entry.bookings.some((booking) => slotsOverlap({ date: entry.date, start, end: addHours(start, 2) }, { date: entry.date, start: booking.start, end: booking.end })))
    .filter((start) => !(entry.date === requested.date && start === requested.start))
    .map((start) => ({ date: entry.date, label: entry.label, start, end: addHours(start, 2) })))
    .filter((slot) => slot.date >= today)
    .sort((a, b) => (a.date === requested.date ? 0 : 1) - (b.date === requested.date ? 0 : 1) || a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

  return { days, conflicts, free: free.slice(0, 9) };
}

function addHours(start, hours) {
  const [hour, minute] = start.split(':').map(Number);
  const total = hour * 60 + minute + hours * 60;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export async function getAdminRequest(db, code) {
  const request = await db.prepare(`SELECT *, details_json FROM requests WHERE request_code = ?`).bind(code).first();
  if (!request) return null;
  const [events, offers] = await db.batch([
    db.prepare('SELECT kind, message, actor, created_at FROM request_events WHERE request_id = ? ORDER BY id').bind(request.id),
    db.prepare('SELECT id, slot_date, slot_start, slot_end, state, expires_at, created_at FROM request_slot_offers WHERE request_id = ? ORDER BY id').bind(request.id),
  ]);
  return {
    ...request,
    details: parseJson(request.details_json, {}),
    events: events.results,
    offers: offers.results,
    calendar: await objectCalendar(db, request),
  };
}

class RequestActionError extends Error {
  constructor(message, status = 400, extra = {}) { super(message); this.status = status; Object.assign(this, extra); }
}

const fail = (message, status = 400, extra) => { throw new RequestActionError(message, status, extra); };

async function setStatus(db, request, status, { note, payment, paymentLink, paymentDue, schedule, operator } = {}) {
  const assignments = ['status = ?', 'status_changed_at = ?', 'updated_at = ?'];
  const values = [status, stamp(), stamp()];
  if (note !== undefined) { assignments.push('resolution_note = ?'); values.push(note); }
  if (payment !== undefined) { assignments.push('payment_state = ?'); values.push(payment); }
  if (paymentLink !== undefined) { assignments.push('payment_link = ?'); values.push(paymentLink); }
  if (paymentDue !== undefined) { assignments.push('payment_due_at = ?'); values.push(paymentDue); }
  if (operator !== undefined) { assignments.push('operator = ?'); values.push(operator); }
  if (schedule) {
    assignments.push('scheduled_date = ?', 'scheduled_start = ?', 'scheduled_end = ?', 'schedule_label = ?');
    values.push(schedule.date, schedule.start, schedule.end, `${formatRequestDate(schedule.date)}, ${schedule.start}`);
  }
  await db.prepare(`UPDATE requests SET ${assignments.join(', ')} WHERE id = ?`).bind(...values, request.id).run();
}

const slotLabel = (slot) => `${formatRequestDate(slot.date)}, ${slot.start}${slot.end ? `–${slot.end}` : ''}`;

function cleanSlots(value) {
  return (Array.isArray(value) ? value : []).slice(0, 3)
    .map((slot) => ({ date: dateValue(slot?.date), start: timeValue(slot?.start), end: timeValue(slot?.end) }))
    .filter((slot) => slot.date && slot.start);
}

/**
 * Every operator action in one place: it validates the transition, applies the
 * side effect and writes the history entry that explains it.
 */
export async function applyRequestAction(db, code, payload) {
  const request = await db.prepare('SELECT * FROM requests WHERE request_code = ?').bind(code).first();
  if (!request) return null;
  const action = text(payload?.action, 40);
  const operator = text(payload?.operator, 60) || 'admin';

  switch (action) {
    case 'take': {
      if (request.status !== 'new') fail('Заявка уже в работе.');
      await setStatus(db, request, 'in_progress', { operator });
      await addEvent(db, request.id, 'status', `Заявка взята в работу — оператор ${operator}`, operator);
      break;
    }
    case 'status': {
      const status = text(payload?.status, 30);
      if (!canTransition(request.status, status)) fail(`Из статуса «${REQUEST_STATUS_LABELS[request.status]}» нельзя перейти в «${REQUEST_STATUS_LABELS[status] ?? status}».`);
      await setStatus(db, request, status, { operator });
      await addEvent(db, request.id, 'status', `Статус изменён вручную: ${REQUEST_STATUS_LABELS[request.status]} → ${REQUEST_STATUS_LABELS[status]}`, operator);
      break;
    }
    case 'note': {
      const message = text(payload?.message, 1000);
      if (!message) fail('Пустая заметка.');
      await db.prepare('UPDATE requests SET updated_at = ? WHERE id = ?').bind(stamp(), request.id).run();
      await addEvent(db, request.id, 'note', message, operator);
      break;
    }
    case 'message': {
      const channel = text(payload?.channel, 40) || request.messenger || 'сообщение';
      const message = text(payload?.message, 1000);
      await db.prepare('UPDATE requests SET updated_at = ? WHERE id = ?').bind(stamp(), request.id).run();
      await addEvent(db, request.id, 'message', `Оператор написал гостю (${channel})${message ? `: ${message}` : ''}`, operator);
      break;
    }
    case 'confirm': {
      const slot = cleanSlots([payload?.slot ?? { date: request.scheduled_date, start: request.scheduled_start, end: request.scheduled_end }])[0];
      if (!slot) fail('Не указаны дата и время занятия.');
      const busy = await conflictsFor(db, request, slot);
      if (busy.length) fail(`Время занято: ${busy.map((item) => `${item.request_code} · ${item.contact_name}`).join(', ')}.`, 409, { conflicts: busy });
      const due = stamp(PAYMENT_WINDOW_HOURS);
      await setStatus(db, request, 'waiting_payment', { schedule: { ...slot, end: slot.end ?? addHours(slot.start, 2) }, payment: 'none', paymentDue: due, operator });
      await withdrawOffers(db, request.id);
      await addEvent(db, request.id, 'slot', `Слот закреплён: ${slotLabel(slot)} — время занято в календаре объекта`, operator);
      await addEvent(db, request.id, 'status', `Статус: ${REQUEST_STATUS_LABELS.waiting_payment} · оплата ждётся до ${due} UTC`, operator);
      break;
    }
    case 'offer': {
      const slots = cleanSlots(payload?.slots);
      if (!slots.length) fail('Выберите хотя бы один свободный слот.');
      const message = text(payload?.message, 1000);
      const channel = text(payload?.channel, 40) || request.messenger || 'e-mail';
      const expires = stamp(SLOT_OFFER_WINDOW_HOURS);
      await withdrawOffers(db, request.id);
      await db.batch(slots.map((slot) => db.prepare('INSERT INTO request_slot_offers (request_id, slot_date, slot_start, slot_end, expires_at) VALUES (?, ?, ?, ?, ?)')
        .bind(request.id, slot.date, slot.start, slot.end ?? addHours(slot.start, 2), expires)));
      await setStatus(db, request, 'waiting_guest', { operator });
      await addEvent(db, request.id, 'slot', `Гостю предложено ${slots.length} варианта времени (${channel}): ${slots.map(slotLabel).join(' · ')}`, operator);
      if (message) await addEvent(db, request.id, 'message', message, operator);
      break;
    }
    case 'accept-offer': {
      const offer = await db.prepare('SELECT * FROM request_slot_offers WHERE id = ? AND request_id = ?').bind(Number.parseInt(payload?.offerId, 10) || 0, request.id).first();
      if (!offer) fail('Такого предложенного слота нет.');
      // One accepted option retires the rest, so the card never shows a slot the
      // guest is still supposedly choosing from.
      await withdrawOffers(db, request.id);
      await db.prepare("UPDATE request_slot_offers SET state = 'accepted' WHERE id = ?").bind(offer.id).run();
      await setStatus(db, request, 'in_progress', { schedule: { date: offer.slot_date, start: offer.slot_start, end: offer.slot_end }, operator });
      await addEvent(db, request.id, 'slot', `Гость выбрал ${slotLabel({ date: offer.slot_date, start: offer.slot_start, end: offer.slot_end })} — можно подтверждать`, operator);
      break;
    }
    case 'payment': {
      if (!REQUEST_PAYMENT_STATES.includes(payload?.state)) fail('Неизвестное состояние оплаты.');
      const state = payload.state;
      const link = text(payload?.link, 400);
      if (state !== 'none' && state !== 'paid' && !link && !request.payment_link) fail('Добавьте ссылку на оплату.');
      const status = state === 'paid' ? 'confirmed' : request.status;
      await setStatus(db, request, status, { payment: state, paymentLink: link || request.payment_link, operator });
      await addEvent(db, request.id, 'payment', `Оплата: ${REQUEST_PAYMENT_LABELS[state]}${link ? ` · ${link}` : ''}`, operator);
      if (state === 'paid') await addEvent(db, request.id, 'status', 'Оплата получена — заявка подтверждена, контакты переданы гостю и объекту', operator);
      break;
    }
    case 'complete': {
      if (request.status !== 'confirmed') fail('Завершить можно только подтверждённую заявку.');
      await setStatus(db, request, 'completed', { operator });
      await addEvent(db, request.id, 'status', 'Занятие прошло — заявка завершена, гостю можно запросить отзыв', operator);
      break;
    }
    case 'cancel': {
      if (request.status === 'cancelled') fail('Заявка уже отменена.');
      const reason = text(payload?.reason, 400);
      if (!reason) fail('Укажите причину отмены — она попадёт в историю.');
      await setStatus(db, request, 'cancelled', { note: reason, operator });
      await withdrawOffers(db, request.id);
      await addEvent(db, request.id, 'status', `Заявка отменена: ${reason}${request.scheduled_date ? ' · слот освобождён' : ''}`, operator);
      break;
    }
    default:
      fail('Неизвестное действие.');
  }

  return getAdminRequest(db, code);
}

async function withdrawOffers(db, requestId) {
  await db.prepare("UPDATE request_slot_offers SET state = 'withdrawn' WHERE request_id = ? AND state = 'offered'").bind(requestId).run();
}

async function conflictsFor(db, request, slot) {
  if (!request.object_slug) return [];
  const { results } = await db.prepare(`
    SELECT request_code, contact_name, scheduled_start, scheduled_end FROM requests
    WHERE category = ? AND object_slug = ? AND id != ? AND scheduled_date = ? AND status IN (${BLOCKING_LIST})
  `).bind(request.category, request.object_slug, request.id, slot.date).all();
  return results.filter((item) => slotsOverlap(
    { date: slot.date, start: slot.start, end: slot.end ?? addHours(slot.start, 2) },
    { date: slot.date, start: item.scheduled_start, end: item.scheduled_end },
  ));
}

export { RequestActionError };
