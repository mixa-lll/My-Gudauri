import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, FormField, Input, Textarea } from '../../../components';
import {
  PAYMENT_WINDOW_HOURS,
  REQUEST_CATEGORY_LABELS,
  REQUEST_PAYMENT_LABELS,
  REQUEST_STATUS_HINTS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONES,
  REQUEST_STATUS_TRANSITIONS,
  formatRequestAmount,
  formatRequestDate,
  formatRequestSchedule,
  requestTimeSlot,
} from '../../../shared/requests';
import { CmsAdminRail } from './CmsEditorParts';
import './CmsRequestCard.scss';

/**
 * One request, end to end: what is booked, who the guest is, what is paid, what
 * has already happened — and, in the same view, whether the object is actually
 * free at that time.
 *
 * The availability panel is the point of the screen. A confirmed request is a
 * busy slot, so the queue itself answers “can I say yes?” without a second
 * calendar to keep in sync, and every action here writes its own history entry.
 */

const PUBLIC_PATHS = { instructors: 'instructors', activities: 'activities', transfers: 'transfers' };
const PAYMENT_STEPS = [
  { state: 'link_created', label: 'Ссылка' },
  { state: 'link_sent', label: 'Отправлена' },
  { state: 'paid', label: 'Оплачена' },
];
const PAYMENT_STEP_INDEX = { none: 0, link_created: 1, link_sent: 2, paid: 3 };
const CHANNELS = ['Telegram', 'WhatsApp', 'Viber', 'E-mail', 'SMS'];

const digits = (value) => String(value ?? '').replace(/\D/g, '');

function messengerHref(request) {
  const phone = digits(request.contact_phone);
  if (!phone) return request.contact_email ? `mailto:${request.contact_email}` : null;
  if (request.messenger === 'WhatsApp') return `https://wa.me/${phone}`;
  if (request.messenger === 'Telegram') return `https://t.me/+${phone}`;
  if (request.messenger === 'Viber') return `viber://chat?number=%2B${phone}`;
  return `tel:+${phone}`;
}

function eventTime(value) {
  if (!value) return '';
  const date = new Date(`${value}Z`);
  const time = new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(date);
  const sameDay = new Date().toDateString() === date.toDateString();
  return sameDay ? time : `${new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' }).format(date)} ${time}`;
}

const humanKey = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());

/** Instructor requests have a known shape, so they get a real read-out. */
function instructorFacts(details) {
  const slots = Object.entries(details.sessionSlots ?? {})
    .filter(([, ids]) => Array.isArray(ids) && ids.length)
    .map(([date, ids]) => `${formatRequestDate(date)}: ${ids.map((id) => requestTimeSlot(id)?.label ?? id).join(', ')}`);
  return [
    { label: 'Выбранные слоты', value: slots.length ? slots.join(' · ') : '' },
    { label: 'Диапазон дат', value: [details.dateRangeStart, details.dateRangeEnd].filter(Boolean).join(' – ') },
    { label: 'Дисциплины', value: (details.activities ?? []).join(', ') || details.discipline },
    { label: 'Уровень', value: details.skillLevel },
    { label: 'Язык занятия', value: (details.languages ?? []).join(', ') || details.lessonLanguage },
    { label: 'Компания', value: details.companyType },
    { label: 'Состав', value: [details.adultsCount ? `${details.adultsCount} взр.` : '', details.childrenCount ? `${details.childrenCount} дет.` : ''].filter(Boolean).join(' · ') },
    { label: 'Темп', value: details.pace },
    { label: 'Бюджет', value: details.budget },
  ].filter((fact) => fact.value);
}

/** Any other category still shows what the guest answered, key by key. */
function genericFacts(details) {
  const answers = details.answers ?? details;
  return Object.entries(answers)
    .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value) && String(value).trim() !== '')
    .filter(([key]) => !['contactName', 'contactPhone', 'contactEmail', 'messenger', 'comment', 'notes'].includes(key))
    .slice(0, 14)
    .map(([key, value]) => ({ label: humanKey(key), value: typeof value === 'boolean' ? (value ? 'да' : 'нет') : String(value) }));
}

function Panel({ title, action, children, className }) {
  return <section className={`cms-request-card__panel${className ? ` ${className}` : ''}`}>
    <header><h2>{title}</h2>{action}</header>
    {children}
  </section>;
}

function Facts({ rows }) {
  if (!rows.length) return <p className="cms-request-card__muted">Гость не заполнил дополнительные поля.</p>;
  return <dl className="cms-request-card__facts">{rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>;
}

export function CmsRequestCard({ request, counts: navCounts, onAction, onBack, onNavigate, onSignOut, busy = false }) {
  const [note, setNote] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [offering, setOffering] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [offerMessage, setOfferMessage] = useState('');
  const [channel, setChannel] = useState(request.messenger ?? 'Telegram');
  const [paymentLink, setPaymentLink] = useState(request.payment_link ?? '');

  useEffect(() => { setChannel(request.messenger ?? 'Telegram'); setPaymentLink(request.payment_link ?? ''); }, [request.request_code, request.messenger, request.payment_link]);

  const calendar = request.calendar;
  const conflicts = calendar?.conflicts ?? [];
  const facts = useMemo(() => (request.category === 'instructors' ? instructorFacts(request.details ?? {}) : genericFacts(request.details ?? {})), [request.category, request.details]);
  const transitions = REQUEST_STATUS_TRANSITIONS[request.status] ?? [];
  const paymentStep = PAYMENT_STEP_INDEX[request.payment_state] ?? 0;
  const publicPath = PUBLIC_PATHS[request.category];
  const slotKey = (slot) => `${slot.date}T${slot.start}`;
  const openOffers = (request.offers ?? []).filter((offer) => offer.state === 'offered');

  // Actions are async in the app and synchronous in stories, so the card always
  // waits on a promise and never depends on which one it got.
  const act = (action) => Promise.resolve(onAction?.(action));
  const toggleSlot = (slot) => setSelectedSlots((current) => current.some((item) => slotKey(item) === slotKey(slot))
    ? current.filter((item) => slotKey(item) !== slotKey(slot))
    : [...current, slot].slice(-3));

  const startOffer = () => {
    setOffering(true);
    setSelectedSlots((calendar?.free ?? []).slice(0, 2));
    setOfferMessage(`Здравствуйте, ${request.contact_name}! ${formatRequestSchedule(request)} у объекта «${request.object_name}» уже занято. Свободно другое время — подскажите, какой вариант удобен?`);
  };

  const sendOffer = async () => {
    await act({ action: 'offer', slots: selectedSlots, message: offerMessage, channel });
    setOffering(false);
    setSelectedSlots([]);
  };

  const confirmSlot = () => act({ action: 'confirm', slot: { date: request.scheduled_date, start: request.scheduled_start, end: request.scheduled_end } });

  const contactGuest = () => {
    const href = messengerHref(request);
    if (href) window.open(href, '_blank', 'noopener');
    act({ action: 'message', channel: request.messenger ?? 'сообщение' });
  };

  return <section className="cms-request-card" aria-label={`Заявка ${request.request_code}`}>
    <CmsAdminRail active="requests" counts={navCounts} onNavigate={onNavigate} onSignOut={onSignOut} />

    <div className="cms-request-card__main">
      <header className="cms-request-card__header">
        <button type="button" className="cms-request-card__breadcrumb" onClick={onBack}>Заявки</button>
        <span aria-hidden="true">/</span>
        <strong>{request.request_code} · {request.contact_name}</strong>
        <Badge tone={REQUEST_STATUS_TONES[request.status]} size="sm">{REQUEST_STATUS_LABELS[request.status]}</Badge>
        <div className="cms-request-card__header-actions">
          {request.status === 'new' ? <Button variant="accent" size="md" disabled={busy} onClick={() => act({ action: 'take' })}>Взять в работу</Button> : null}
          <label className="cms-request-card__status-select">
            <span className="visually-hidden">Сменить статус вручную</span>
            <select value="" disabled={busy || !transitions.length} onChange={(event) => event.target.value && act({ action: 'status', status: event.target.value })}>
              <option value="">Статус ▾</option>
              {transitions.map((value) => <option key={value} value={value}>{REQUEST_STATUS_LABELS[value]}</option>)}
            </select>
          </label>
          <Button variant="secondary" size="md" disabled={busy} onClick={contactGuest}>Написать гостю</Button>
          {request.status === 'confirmed' ? <Button variant="secondary" size="md" disabled={busy} onClick={() => act({ action: 'complete' })}>Завершить</Button> : null}
          {request.status === 'cancelled' ? null : <Button variant="ghost" size="md" disabled={busy} onClick={() => setCancelling((current) => !current)}>Отклонить</Button>}
        </div>
      </header>

      <p className="cms-request-card__status-hint">{REQUEST_STATUS_HINTS[request.status]}</p>

      {cancelling ? <form className="cms-request-card__inline-form" onSubmit={(event) => { event.preventDefault(); act({ action: 'cancel', reason }).then(() => { setCancelling(false); setReason(''); }); }}>
        <FormField label="Причина отмены" hint="Попадёт в историю заявки; закреплённый слот сразу освободится.">
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Гость не ответил за 24 часа" required />
        </FormField>
        <div className="cms-request-card__inline-actions">
          <Button type="button" variant="ghost" size="md" onClick={() => setCancelling(false)}>Отмена</Button>
          <Button type="submit" variant="destructive" size="md" disabled={busy || !reason.trim()}>Отклонить заявку</Button>
        </div>
      </form> : null}

      <div className="cms-request-card__layout">
        <div className="cms-request-card__column">
          <Panel title="Что бронируют" action={publicPath && request.object_slug ? <a href={`/${publicPath}/${request.object_slug}`} target="_blank" rel="noreferrer">Открыть карточку ↗</a> : null}>
            <div className="cms-request-card__object">
              {request.object_image_url ? <img src={request.object_image_url} alt="" /> : <span className="cms-request-card__object-placeholder" aria-hidden="true">{request.object_name?.trim().slice(0, 1) || '—'}</span>}
              <div>
                <strong>{request.object_name || 'Объект ещё не выбран'}</strong>
                <small>{request.object_kicker || REQUEST_CATEGORY_LABELS[request.category] || request.category} · {request.source_label ?? request.source}</small>
              </div>
              <span className="cms-request-card__amount">{formatRequestAmount(request.amount, request.currency)}</span>
            </div>
            <dl className="cms-request-card__facts">
              <div><dt>Дата</dt><dd>{formatRequestSchedule(request)}</dd></div>
              <div><dt>Гости</dt><dd>{request.guest_count}</dd></div>
            </dl>
            <Facts rows={facts} />
            {request.guest_note ? <blockquote className="cms-request-card__quote">{request.guest_note}</blockquote> : null}
          </Panel>

          <Panel title="Гость">
            <div className="cms-request-card__guest">
              <strong>{request.contact_name}</strong>
              <p>{[request.contact_phone, request.messenger, request.contact_email].filter(Boolean).join(' · ')}</p>
              <div className="cms-request-card__guest-actions">
                <Button variant="secondary" size="md" disabled={busy} onClick={contactGuest}>{request.messenger ?? 'Написать'}</Button>
                {request.contact_phone ? <a className="cms-request-card__call" href={`tel:+${digits(request.contact_phone)}`}>Позвонить</a> : null}
              </div>
              <p className="cms-request-card__muted">Объект получит контакты гостя только после подтверждения оплаты.</p>
            </div>
          </Panel>

          <Panel title="Оплата" action={<Badge tone={request.payment_state === 'paid' ? 'success' : 'neutral'} size="sm">{REQUEST_PAYMENT_LABELS[request.payment_state]}</Badge>}>
            <ol className="cms-request-card__steps">
              {PAYMENT_STEPS.map((step, index) => <li key={step.state} className={index < paymentStep ? 'is-done' : undefined}>
                <span aria-hidden="true">{index + 1}</span>{step.label}
              </li>)}
            </ol>
            <div className="cms-request-card__payment-row">
              <span>{request.object_name} · {request.guest_count} гост.</span>
              <strong>{formatRequestAmount(request.amount, request.currency)}</strong>
            </div>
            {request.payment_state === 'none' ? <div className="cms-request-card__payment-actions">
              <FormField label="Ссылка на оплату" hint={request.status === 'waiting_payment' ? 'Гостю уйдёт эта ссылка.' : 'Станет активной после подтверждения времени.'}>
                <Input value={paymentLink} onChange={(event) => setPaymentLink(event.target.value)} placeholder="https://pay.mygudauri.ge/r/1047" disabled={request.status !== 'waiting_payment'} />
              </FormField>
              <Button variant="primary" size="md" disabled={busy || request.status !== 'waiting_payment' || !paymentLink.trim()} onClick={() => act({ action: 'payment', state: 'link_created', link: paymentLink })}>Создать ссылку</Button>
            </div> : null}
            {request.payment_state === 'link_created' || request.payment_state === 'link_sent' ? <div className="cms-request-card__payment-actions">
              <p className="cms-request-card__link">{request.payment_link}</p>
              {request.payment_due_at ? <p className="cms-request-card__muted">Без оплаты до {request.payment_due_at} UTC ({PAYMENT_WINDOW_HOURS} ч) слот освобождается.</p> : null}
              <div className="cms-request-card__inline-actions">
                <Button variant="ghost" size="md" onClick={() => navigator.clipboard?.writeText(request.payment_link ?? '')}>Копировать</Button>
                {request.payment_state === 'link_created' ? <Button variant="secondary" size="md" disabled={busy} onClick={() => act({ action: 'payment', state: 'link_sent' })}>Отметить отправку</Button> : null}
                <Button variant="primary" size="md" disabled={busy} onClick={() => act({ action: 'payment', state: 'paid' })}>Оплата получена</Button>
              </div>
            </div> : null}
            {request.payment_state === 'paid' ? <p className="cms-request-card__muted">Оплата подтверждена — контакты переданы гостю и объекту.</p> : null}
          </Panel>

          <Panel title="История">
            <ol className="cms-request-card__timeline">
              {(request.events ?? []).map((event, index) => <li key={`${event.created_at}-${index}`} className={`is-${event.kind}`}>
                <time dateTime={event.created_at}>{eventTime(event.created_at)}</time>
                <span>{event.message}</span>
                <small>{event.actor}</small>
              </li>)}
            </ol>
            <form className="cms-request-card__note" onSubmit={(event) => { event.preventDefault(); act({ action: 'note', message: note }).then(() => setNote('')); }}>
              <FormField label="Заметка оператора" hint="Каждое действие и каждая заметка остаются в истории заявки.">
                <Textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Договорились созвониться вечером" />
              </FormField>
              <Button type="submit" variant="secondary" size="md" disabled={busy || !note.trim()}>Добавить в историю</Button>
            </form>
          </Panel>
        </div>

        <aside className="cms-request-card__aside">
          <Panel title="Проверка доступности" className="cms-request-card__availability">
            {!calendar ? <p className="cms-request-card__muted">
              {request.object_slug ? 'Гость не выбрал конкретный день — уточните дату, чтобы проверить календарь.' : 'Объект ещё не выбран: подберите инструктора, и календарь появится здесь.'}
            </p> : <>
              <p className="cms-request-card__muted">Календарь объекта «{request.object_name}»: подтверждённые заявки занимают время.</p>
              <ul className="cms-request-card__calendar">
                {calendar.days.map((day) => <li key={day.date} className={day.isRequested ? 'is-requested' : undefined}>
                  <span>{day.label}</span>
                  <div>{day.bookings.length
                    ? day.bookings.map((booking) => <span key={booking.requestCode} className="cms-request-card__busy">{booking.start} {booking.guest}</span>)
                    : <span className="cms-request-card__free">свободно</span>}
                  </div>
                </li>)}
              </ul>

              {conflicts.length ? <div className="cms-request-card__notice is-danger" role="status">
                <strong>Запрошенное время занято</strong>
                <p>{conflicts.map((item) => `${item.requestCode} · ${item.guest} · ${item.start}${item.end ? `–${item.end}` : ''}`).join('; ')}</p>
              </div> : <div className="cms-request-card__notice is-success" role="status">
                <strong>Слот {formatRequestSchedule(request)} свободен</strong>
                <p>Подтверждение закрепит время: статус станет «Ждёт оплаты», слот займётся в календаре.</p>
              </div>}

              <div className="cms-request-card__inline-actions">
                <Button variant="primary" size="md" disabled={busy || Boolean(conflicts.length) || ['confirmed', 'completed', 'cancelled', 'waiting_payment'].includes(request.status)} onClick={confirmSlot}>Подтвердить и закрепить слот</Button>
                <Button variant="secondary" size="md" disabled={busy || !calendar.free.length} onClick={startOffer}>Предложить другое время</Button>
              </div>
            </>}

            {openOffers.length ? <div className="cms-request-card__offers">
              <strong>Предложено гостю</strong>
              {openOffers.map((offer) => <div key={offer.id}>
                <span>{formatRequestDate(offer.slot_date)}, {offer.slot_start}{offer.slot_end ? `–${offer.slot_end}` : ''}</span>
                <Button variant="ghost" size="sm" disabled={busy} onClick={() => act({ action: 'accept-offer', offerId: offer.id })}>Гость выбрал</Button>
              </div>)}
            </div> : null}

            {offering ? <form className="cms-request-card__offer-form" onSubmit={(event) => { event.preventDefault(); sendOffer(); }}>
              <fieldset>
                <legend>Свободные слоты — до трёх</legend>
                <div>{(calendar?.free ?? []).map((slot) => <button
                  type="button"
                  key={slotKey(slot)}
                  className={selectedSlots.some((item) => slotKey(item) === slotKey(slot)) ? 'is-selected' : undefined}
                  aria-pressed={selectedSlots.some((item) => slotKey(item) === slotKey(slot))}
                  onClick={() => toggleSlot(slot)}
                >{slot.label}, {slot.start}</button>)}</div>
              </fieldset>
              <FormField label="Сообщение гостю" hint="Отправляете вы сами — CRM записывает предложение и держит слоты 24 часа.">
                <Textarea rows={4} value={offerMessage} onChange={(event) => setOfferMessage(event.target.value)} />
              </FormField>
              <label className="cms-request-card__channel">
                <span>Канал</span>
                <select value={channel} onChange={(event) => setChannel(event.target.value)}>{CHANNELS.map((value) => <option key={value} value={value}>{value}</option>)}</select>
              </label>
              <div className="cms-request-card__inline-actions">
                <Button type="button" variant="ghost" size="md" onClick={() => setOffering(false)}>Отмена</Button>
                <Button type="submit" variant="primary" size="md" disabled={busy || !selectedSlots.length}>Записать предложение</Button>
              </div>
            </form> : null}
          </Panel>
        </aside>
      </div>
    </div>
  </section>;
}
