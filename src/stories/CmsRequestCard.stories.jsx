import { CmsRequestCard } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';
import { formatRequestDate } from '../shared/requests';

const day = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
const ago = (hours) => new Date(Date.now() - hours * 3_600_000).toISOString().replace('T', ' ').slice(0, 19);

const lessonDay = day(4);

const calendarDay = (date, bookings = []) => ({ date, label: formatRequestDate(date), isRequested: date === lessonDay, bookings });

const base = {
  request_code: 'MG-1047',
  category: 'instructors',
  source: 'object_page',
  source_label: 'со страницы инструктора',
  object_slug: 'mikhail',
  object_name: 'Михаил Андреев',
  object_kicker: 'Инструктор · сноуборд',
  object_image_url: '/assets/design-2/card-mikhail.png',
  scheduled_date: lessonDay,
  scheduled_start: '10:00',
  scheduled_end: '12:00',
  schedule_label: '',
  guest_count: 2,
  amount: 690,
  currency: 'GEL',
  contact_name: 'Елена Соколова',
  contact_phone: '+995 599 123 456',
  contact_email: 'elena.sk@gmail.com',
  messenger: 'Telegram',
  guest_note: 'Первый раз на сноуборде, немного волнуемся. Хотим спокойного инструктора и без спешки.',
  status: 'new',
  payment_state: 'none',
  payment_link: null,
  payment_due_at: null,
  created_at: ago(0.3),
  details: {
    requestType: 'specific_instructor',
    dateRangeStart: lessonDay,
    dateRangeEnd: day(6),
    sessionSlots: { [lessonDay]: ['morning'], [day(5)]: ['midday'] },
    activities: ['Snowboard'],
    languages: ['Russian'],
    skillLevel: 'Beginner',
    companyType: 'Friends',
    adultsCount: 2,
    childrenCount: 0,
  },
  events: [
    { kind: 'created', message: 'Заявка получена — форма на странице инструктора', actor: 'guest', created_at: ago(0.3) },
  ],
  offers: [],
  calendar: {
    days: [calendarDay(day(3)), calendarDay(lessonDay), calendarDay(day(5)), calendarDay(day(6))],
    conflicts: [],
    free: [
      { date: lessonDay, label: formatRequestDate(lessonDay), start: '12:30', end: '14:30' },
      { date: lessonDay, label: formatRequestDate(lessonDay), start: '15:00', end: '17:00' },
      { date: day(5), label: formatRequestDate(day(5)), start: '10:00', end: '12:00' },
    ],
  },
};

const counts = { instructors: 3, activities: 2, transfers: 4, requests: 8, requestsNew: 2 };

const shared = { counts, onAction: () => {}, onBack: () => {}, onNavigate: () => {}, onSignOut: () => {} };

export default {
  title: 'Blocks/Admin/CMS Request Card',
  component: CmsRequestCard,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'CmsRequestCard', children: ['Badge', 'Button', 'FormField', 'Input', 'CmsEditorShell'] }) },
};

/** The slot is free: one action confirms the time and blocks the calendar. */
export const NewRequest = { name: 'New Request', render: () => <CmsRequestCard request={base} {...shared} /> };

/** The slot is taken, so the operator offers free time from the same calendar. */
export const ConflictingSlot = {
  name: 'Conflicting Slot',
  render: () => <CmsRequestCard
    request={{
      ...base,
      status: 'in_progress',
      events: [...base.events, { kind: 'status', message: 'Заявка взята в работу — оператор admin', actor: 'admin', created_at: ago(0.1) }],
      calendar: {
        ...base.calendar,
        days: [calendarDay(day(3)), calendarDay(lessonDay, [{ requestCode: 'MG-1032', guest: 'Дмитрий Ким', start: '10:00', end: '12:00', status: 'confirmed' }]), calendarDay(day(5)), calendarDay(day(6))],
        conflicts: [{ requestCode: 'MG-1032', guest: 'Дмитрий Ким', start: '10:00', end: '12:00' }],
      },
    }}
    {...shared}
  />,
};

/** Time confirmed, slot held: the payment block is the only thing left open. */
export const WaitingPayment = {
  name: 'Waiting Payment',
  render: () => <CmsRequestCard
    request={{
      ...base,
      status: 'waiting_payment',
      payment_state: 'link_sent',
      payment_link: 'https://pay.mygudauri.ge/r/1047',
      payment_due_at: `${day(1)} 14:02:00`,
      events: [
        ...base.events,
        { kind: 'status', message: 'Заявка взята в работу — оператор admin', actor: 'admin', created_at: ago(2) },
        { kind: 'slot', message: `Слот закреплён: ${formatRequestDate(lessonDay)}, 10:00–12:00 — время занято в календаре объекта`, actor: 'admin', created_at: ago(1.5) },
        { kind: 'payment', message: 'Оплата: Отправлена гостю · https://pay.mygudauri.ge/r/1047', actor: 'admin', created_at: ago(1.4) },
      ],
    }}
    {...shared}
  />,
};

/** A manager-match request has no object yet, so there is no calendar to check. */
export const ManagerMatch = {
  name: 'Manager Match',
  render: () => <CmsRequestCard
    request={{
      ...base,
      request_code: 'MG-1039',
      source: 'manager_match',
      source_label: 'подбор менеджером',
      object_slug: null,
      object_name: 'Подбор инструктора',
      object_kicker: 'Подбор · Ski, Freeride',
      object_image_url: null,
      calendar: null,
      details: { ...base.details, requestType: 'manager_match', activities: ['Ski', 'Freeride'], pace: 'Medium', budget: 'Mid-range' },
    }}
    {...shared}
  />,
};
