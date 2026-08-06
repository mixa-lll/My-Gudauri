import { useState } from 'react';
import { CmsRequestQueue } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const day = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
const ago = (hours) => new Date(Date.now() - hours * 3_600_000).toISOString().replace('T', ' ').slice(0, 19);

const requests = [
  { request_code: 'MG-1047', category: 'instructors', source: 'object_page', source_label: 'со страницы инструктора', object_slug: 'mikhail', object_name: 'Михаил Андреев', object_kicker: 'Инструктор · сноуборд', scheduled_date: day(4), scheduled_start: '10:00', guest_count: 2, amount: 690, currency: 'GEL', contact_name: 'Елена Соколова', status: 'new', payment_state: 'none', created_at: ago(0.2) },
  { request_code: 'MG-1046', category: 'activities', source: 'booking_flow', source_label: 'из формы бронирования', object_slug: 'heli-ski', object_name: 'Хели-ски: Казбек', object_kicker: 'Активность', scheduled_date: day(6), scheduled_start: '08:30', guest_count: 4, amount: 3600, currency: 'GEL', contact_name: 'Марк Штайнер', status: 'new', payment_state: 'none', created_at: ago(1) },
  { request_code: 'MG-1045', category: 'instructors', source: 'object_page', source_label: 'предложено 2 варианта', object_slug: 'oleg', object_name: 'Олег Юнг', object_kicker: 'Инструктор · сноуборд', scheduled_date: day(5), scheduled_start: '10:00', guest_count: 1, amount: 690, currency: 'GEL', contact_name: 'Дмитрий Ким', status: 'waiting_guest', payment_state: 'none', created_at: ago(4) },
  { request_code: 'MG-1044', category: 'activities', source: 'booking_flow', source_label: 'оператор: admin', object_slug: 'paragliding', object_name: 'Полёт на параплане', object_kicker: 'Активность', scheduled_date: day(4), scheduled_start: '12:00', guest_count: 2, amount: 700, currency: 'GEL', contact_name: 'Софи Лоран', status: 'in_progress', payment_state: 'none', created_at: ago(6) },
  { request_code: 'MG-1043', category: 'transfers', source: 'booking_flow', source_label: 'ссылка отправлена', object_slug: 'tbilisi-gudauri', object_name: 'Тбилиси → Гудаури', object_kicker: 'Трансфер', scheduled_date: day(3), scheduled_start: '16:00', guest_count: 3, amount: 260, currency: 'GEL', contact_name: 'Анна Кобахидзе', status: 'waiting_payment', payment_state: 'link_sent', created_at: ago(26) },
  { request_code: 'MG-1042', category: 'instructors', source: 'object_page', source_label: 'оплачено онлайн', object_slug: 'nino', object_name: 'Нино Барамидзе', object_kicker: 'Инструктор · лыжи', scheduled_date: day(2), scheduled_start: '10:00', guest_count: 2, amount: 690, currency: 'GEL', contact_name: 'Гига Церетели', status: 'confirmed', payment_state: 'paid', created_at: ago(30) },
  { request_code: 'MG-1041', category: 'instructors', source: 'object_page', source_label: 'отзыв запрошен', object_slug: 'tamara', object_name: 'Тамара Лежава', object_kicker: 'Инструктор · лыжи', scheduled_date: day(-3), scheduled_start: '14:00', guest_count: 1, amount: 690, currency: 'GEL', contact_name: 'Ольга Мороз', status: 'completed', payment_state: 'paid', created_at: ago(72) },
  { request_code: 'MG-1040', category: 'activities', source: 'booking_flow', source_label: 'гость не ответил за 24 ч', object_slug: 'kazbegi', object_name: 'Экскурсия в Казбеги', object_kicker: 'Тур', scheduled_date: day(-4), guest_count: 5, amount: 900, currency: 'GEL', contact_name: 'Пётр Волков', status: 'cancelled', payment_state: 'none', created_at: ago(96) },
];

const counts = { instructors: 3, activities: 2, transfers: 4, requests: requests.length, requestsNew: 2 };

function QueueHarness({ items = requests }) {
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  return <CmsRequestQueue
    items={items}
    counts={counts}
    status={status}
    onStatusChange={setStatus}
    category={category}
    onCategoryChange={setCategory}
    query={query}
    onQueryChange={setQuery}
    onOpen={() => {}}
    onRefresh={() => {}}
    onNavigate={() => {}}
    onSignOut={() => {}}
  />;
}

export default {
  title: 'Blocks/Admin/CMS Request Queue',
  component: CmsRequestQueue,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'CmsRequestQueue', children: ['Badge', 'Button', 'CmsEditorShell'] }) },
};

/** Every category in one queue — new requests keep the top and a warning marker. */
export const Inbox = { render: () => <QueueHarness /> };

/** The chips filter the same rows they count, so a chip never lies about results. */
export const FilteredToNew = { name: 'Filtered To New', render: () => <QueueHarness items={requests.filter((item) => item.status === 'new')} /> };

export const Empty = { render: () => <QueueHarness items={[]} /> };
