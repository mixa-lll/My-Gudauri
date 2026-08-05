import { useEffect } from 'react';
import { Badge, Button } from '../../../components';
import { CMS_STATUS_LABELS, CmsAdminRail } from './CmsEditorParts';
import './CmsCollectionList.scss';

const statusTone = { published: 'success', draft: 'warning', archived: 'neutral' };

function UpdatedAt({ value }) {
  if (!value) return '—';
  const date = new Date(`${value}Z`);
  const difference = Math.max(0, Date.now() - date.getTime());
  const days = Math.floor(difference / 86_400_000);
  if (!days) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 7) return `${days} дн`;
  return new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' }).format(date);
}

function SelectFilter({ label, value, options, onChange }) {
  return <label className="cms-collection-list__filter"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="all">Все</option>{options.map((option) => <option value={option.value ?? option} key={option.value ?? option}>{option.label ?? option}</option>)}</select></label>;
}

const TRANSFER_BODY_LABELS = { sedan: 'Седан', hatchback: 'Хэтчбек', suv: '4×4', minivan: 'Минивэн', minibus: 'Микроавтобус' };

const badges = (items) => items?.length ? <span className="cms-collection-list__badges">{items.map((item) => <Badge key={item} size="sm">{item}</Badge>)}</span> : '—';
const rating = (item) => item.rating ? <span className="cms-collection-list__rating"><span aria-hidden="true">★</span> {Number(item.rating).toFixed(1)}</span> : '—';

/**
 * Column sets per collection. A new object type adds one entry here and reuses
 * the whole shell — search, filters, status, row menu and empty state.
 */
export const CMS_COLLECTIONS = {
  instructors: {
    title: 'Инструкторы',
    createLabel: '+ Новый инструктор',
    publicPath: 'instructors',
    columns: [
      { key: 'disciplines', label: 'Дисциплины', render: (item) => badges(item.disciplines) },
      { key: 'languages', label: 'Язык', render: (item) => item.languages?.join(' ') || '—' },
      { key: 'experience', label: 'Стаж', render: (item) => item.experienceYears ? `${item.experienceYears} лет` : '—' },
      { key: 'rating', label: 'Рейтинг', render: rating },
    ],
  },
  activities: {
    title: 'Активности',
    createLabel: '+ Новая активность',
    publicPath: 'activities',
    columns: [
      { key: 'category', label: 'Категория', render: (item) => item.category || '—' },
      { key: 'tags', label: 'Теги', render: (item) => badges(item.tags) },
      { key: 'price', label: 'Цена', render: (item) => Number(item.price_amount) > 0 ? `${Math.round(item.price_amount)} ${item.currency ?? ''}`.trim() : '—' },
      { key: 'rating', label: 'Рейтинг', render: rating },
    ],
  },
  transfers: {
    title: 'Трансферы',
    createLabel: '+ Новая машина',
    publicPath: 'transfers',
    columns: [
      { key: 'vehicle', label: 'Машина', render: (item) => [TRANSFER_BODY_LABELS[item.body_type] ?? item.class_name, item.seats ? `${item.seats} мест` : null].filter(Boolean).join(' · ') || '—' },
      { key: 'routes', label: 'Маршруты', render: (item) => item.offers_count ? badges((item.routes ?? []).slice(0, 3).concat(item.offers_count > 3 ? [`+${item.offers_count - 3}`] : [])) : '—' },
      { key: 'price', label: 'Цена от', render: (item) => Number(item.price_from) > 0 ? `от ${Math.round(item.price_from)} ${item.currency ?? ''}`.trim() : '—' },
      { key: 'rating', label: 'Рейтинг', render: rating },
    ],
  },
};

export function CmsCollectionList({
  items = [],
  activeCollection = 'instructors',
  counts: navCounts,
  onCollectionChange,
  onCreate,
  onOpenSettings,
  onEdit,
  onDuplicate,
  onOpenMenu,
  openMenuId,
  onCloseMenu,
  query,
  onQueryChange,
  filters = [],
  status,
  onStatusChange,
  onSignOut,
  busy = false,
}) {
  const collection = CMS_COLLECTIONS[activeCollection] ?? CMS_COLLECTIONS.instructors;
  const counts = {
    all: items.length,
    published: items.filter((item) => item.status === 'published').length,
    draft: items.filter((item) => item.status === 'draft').length,
  };

  // A row menu that only closes from its own trigger reads as stuck, so it also
  // answers Escape and any pointer press outside the cell.
  useEffect(() => {
    if (openMenuId === null || openMenuId === undefined) return undefined;
    const closeOnOutside = (event) => { if (!event.target.closest?.('.cms-collection-list__menu-cell')) onCloseMenu?.(); };
    const closeOnEscape = (event) => { if (event.key === 'Escape') onCloseMenu?.(); };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [onCloseMenu, openMenuId]);

  return <section className="cms-collection-list" aria-label="Управление контентом">
    <CmsAdminRail active={activeCollection} counts={navCounts} onNavigate={onCollectionChange} onSignOut={onSignOut} />

    <div className="cms-collection-list__main">
      <header className="cms-collection-list__header">
        <div><h1>{collection.title}</h1><p>{counts.all} объектов · {counts.published} опубликовано · {counts.draft} в черновиках</p></div>
        <div className="cms-collection-list__header-actions">
          <label className="cms-collection-list__search"><span className="visually-hidden">Поиск по названию</span><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Поиск по названию…" /></label>
          {onOpenSettings ? <Button variant="secondary" size="md" onClick={onOpenSettings}>⚙ Настройки категории</Button> : null}
          <Button variant="accent" size="md" onClick={onCreate}>{collection.createLabel}</Button>
        </div>
      </header>

      <div className="cms-collection-list__toolbar">
        <div className="cms-collection-list__filters">
          {filters.map((filter) => <SelectFilter key={filter.label} label={filter.label} value={filter.value} options={filter.options} onChange={filter.onChange} />)}
          <SelectFilter label="Статус" value={status} options={[{ value: 'published', label: 'Опубликован' }, { value: 'draft', label: 'Черновик' }, { value: 'archived', label: 'В архиве' }]} onChange={onStatusChange} />
        </div>
        <span className="cms-collection-list__sort">Сортировка: по изменению ▾</span>
      </div>

      <div className="cms-collection-list__table-wrap">
        <table className="cms-collection-list__table">
          <thead><tr><th>Название</th>{collection.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Статус</th><th>Изменён</th><th><span className="visually-hidden">Действия</span></th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id} tabIndex={0} className={openMenuId === item.id ? 'is-menu-open' : ''} onClick={() => onEdit(item.slug)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onEdit(item.slug); } }}>
            <td><span className="cms-collection-list__name">{item.image ? <img src={item.image} alt="" /> : <span className="cms-collection-list__avatar-placeholder" aria-hidden="true">{item.name?.trim().slice(0, 1) || '—'}</span>}<strong>{item.name}</strong></span></td>
            {collection.columns.map((column) => <td key={column.key}>{column.render(item)}</td>)}
            <td><Badge tone={statusTone[item.status] ?? 'neutral'} size="sm"><span className="cms-collection-list__status-dot" aria-hidden="true" />{CMS_STATUS_LABELS[item.status] ?? item.status}</Badge></td>
            <td><UpdatedAt value={item.updated_at} /></td>
            <td className="cms-collection-list__menu-cell"><button type="button" className="cms-collection-list__menu-trigger" aria-label={`Действия: ${item.name}`} aria-expanded={openMenuId === item.id} onClick={(event) => { event.stopPropagation(); onOpenMenu(openMenuId === item.id ? null : item.id); }}>⋯</button>{openMenuId === item.id ? <div className="cms-collection-list__menu" onClick={(event) => event.stopPropagation()}><strong>{item.name}</strong><button type="button" onClick={() => onEdit(item.slug)}>Редактировать <kbd>↵</kbd></button>{onDuplicate ? <button type="button" disabled={busy} onClick={() => { onCloseMenu?.(); onDuplicate(item.slug); }}>Дублировать</button> : null}<a href={`/${collection.publicPath}/${item.slug}`} target="_blank" rel="noreferrer">Открыть на сайте ↗</a><button type="button" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/${collection.publicPath}/${item.slug}`); onCloseMenu?.(); }}>Копировать ссылку</button></div> : null}</td>
          </tr>)}</tbody>
        </table>
        {!items.length ? <div className="cms-collection-list__empty" role="status">По этим фильтрам ничего нет.</div> : null}
      </div>
    </div>
  </section>;
}
