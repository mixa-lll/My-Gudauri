import { useMemo } from 'react';
import { Badge, Button } from '../../../components';
import {
  REQUEST_CATEGORY_LABELS,
  REQUEST_STATUSES,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONES,
  formatRequestAge,
  formatRequestAmount,
  formatRequestSchedule,
} from '../../../shared/requests';
import { CmsAdminRail } from './CmsEditorParts';
import './CmsRequestQueue.scss';

/**
 * The operator inbox: every category in one queue, unanswered requests first.
 *
 * Filtering happens here rather than in the page, so the status chips and the
 * rows are always counted from the same set — a chip can never promise results
 * the table does not have.
 */

const OPEN_FIRST = ['new', 'in_progress', 'waiting_guest', 'waiting_payment', 'confirmed', 'completed', 'cancelled'];

function StatusChip({ label, count, active, tone = 'neutral', onClick }) {
  return <button type="button" className={`cms-request-queue__chip${active ? ' is-active' : ''} is-${tone}`} aria-pressed={active} onClick={onClick}>
    {label}{count === undefined ? null : <b>{count}</b>}
  </button>;
}

export function CmsRequestQueue({
  items = [],
  counts: navCounts,
  status = 'all',
  onStatusChange,
  category = 'all',
  onCategoryChange,
  query = '',
  onQueryChange,
  onOpen,
  onRefresh,
  onNavigate,
  onSignOut,
  busy = false,
}) {
  const statusCounts = useMemo(() => Object.fromEntries(REQUEST_STATUSES.map((value) => [value, items.filter((item) => item.status === value).length])), [items]);
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => (status === 'all' || item.status === status)
      && (category === 'all' || item.category === category)
      && (!needle || [item.contact_name, item.object_name, item.request_code].some((value) => value?.toLowerCase().includes(needle))));
  }, [category, items, query, status]);

  const lastMonth = items.filter((item) => Date.now() - new Date(`${item.created_at}Z`).getTime() < 30 * 86_400_000).length;

  return <section className="cms-request-queue" aria-label="Заявки">
    <CmsAdminRail active="requests" counts={navCounts} onNavigate={onNavigate} onSignOut={onSignOut} />

    <div className="cms-request-queue__main">
      <header className="cms-request-queue__header">
        <div>
          <h1>Заявки</h1>
          <p>{lastMonth} за 30 дней · {statusCounts.new} новых · {statusCounts.waiting_payment} ждёт оплаты</p>
        </div>
        <label className="cms-request-queue__search">
          <span className="visually-hidden">Поиск по гостю, объекту или номеру заявки</span>
          <span aria-hidden="true">⌕</span>
          <input type="search" value={query} onChange={(event) => onQueryChange?.(event.target.value)} placeholder="Гость, объект, № заявки…" />
        </label>
        {/* A request that arrives while the operator is reading the list has to
            be one click away — the queue does not poll behind their back. */}
        {onRefresh ? <Button variant="secondary" size="md" disabled={busy} onClick={onRefresh}>Обновить</Button> : null}
      </header>

      <div className="cms-request-queue__toolbar">
        <div className="cms-request-queue__chips" role="group" aria-label="Фильтр по статусу">
          <StatusChip label="Все" count={items.length} active={status === 'all'} onClick={() => onStatusChange?.('all')} />
          {OPEN_FIRST.filter((value) => statusCounts[value]).map((value) => <StatusChip
            key={value}
            label={REQUEST_STATUS_LABELS[value]}
            count={statusCounts[value]}
            tone={REQUEST_STATUS_TONES[value]}
            active={status === value}
            onClick={() => onStatusChange?.(value)}
          />)}
        </div>
        <label className="cms-request-queue__filter">
          <span>Категория</span>
          <select value={category} onChange={(event) => onCategoryChange?.(event.target.value)}>
            <option value="all">Все</option>
            {categories.map((value) => <option key={value} value={value}>{REQUEST_CATEGORY_LABELS[value] ?? value}</option>)}
          </select>
        </label>
      </div>

      <div className="cms-request-queue__table-wrap">
        <table className="cms-request-queue__table">
          <thead><tr><th>Гость</th><th>Объект</th><th>Дата занятия</th><th>Гости</th><th>Сумма</th><th>Статус</th><th>Получена</th></tr></thead>
          <tbody>{visible.map((item) => <tr
            key={item.request_code}
            tabIndex={0}
            className={item.status === 'new' ? 'is-new' : undefined}
            onClick={() => onOpen?.(item.request_code)}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen?.(item.request_code); } }}
          >
            <td><span className="cms-request-queue__guest"><strong>{item.contact_name}</strong><small>{item.request_code} · {item.source_label ?? item.source}</small></span></td>
            <td><span className="cms-request-queue__object">
              {item.object_image_url ? <img src={item.object_image_url} alt="" /> : <span className="cms-request-queue__object-placeholder" aria-hidden="true">{item.object_name?.trim().slice(0, 1) || '—'}</span>}
              <span><span>{item.object_name || '—'}</span><small>{item.object_kicker || REQUEST_CATEGORY_LABELS[item.category] || item.category}</small></span>
            </span></td>
            <td>{formatRequestSchedule(item)}</td>
            <td>{item.guest_count}</td>
            <td>{formatRequestAmount(item.amount, item.currency)}</td>
            <td><Badge tone={REQUEST_STATUS_TONES[item.status]} size="sm">{REQUEST_STATUS_LABELS[item.status]}</Badge></td>
            <td className="cms-request-queue__age">{formatRequestAge(item.created_at)}</td>
          </tr>)}</tbody>
        </table>
        {!visible.length ? <div className="cms-request-queue__empty" role="status">
          <p>{items.length ? 'По этим фильтрам заявок нет.' : 'Заявок пока нет — они появятся здесь сразу после отправки формы на сайте.'}</p>
          {items.length && status !== 'all' ? <Button variant="secondary" size="md" disabled={busy} onClick={() => onStatusChange?.('all')}>Показать все</Button> : null}
        </div> : null}
      </div>
    </div>
  </section>;
}
