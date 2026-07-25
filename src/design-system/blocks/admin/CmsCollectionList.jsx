import { Badge, Button } from '../../../components';
import './CmsCollectionList.scss';

const statusTone = { published: 'success', draft: 'warning', archived: 'neutral' };
const statusLabel = { published: 'Опубликован', draft: 'Черновик', archived: 'В архиве' };

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

export function CmsCollectionList({
  items = [],
  activeCollection = 'instructors',
  onCollectionChange,
  onCreate,
  onEdit,
  onDuplicate,
  onOpenMenu,
  openMenuId,
  onCloseMenu,
  query,
  onQueryChange,
  discipline,
  onDisciplineChange,
  disciplines = [],
  language,
  onLanguageChange,
  languages = [],
  status,
  onStatusChange,
  onSignOut,
  busy = false,
}) {
  const counts = {
    all: items.length,
    published: items.filter((item) => item.status === 'published').length,
    draft: items.filter((item) => item.status === 'draft').length,
  };

  return <section className="cms-collection-list" aria-label="Управление контентом">
    <aside className="cms-collection-list__rail">
      <div className="cms-collection-list__brand"><span>My</span> Gudauri</div>
      <p className="cms-collection-list__eyebrow">Управление</p>
      <div className="cms-collection-list__nav-group">
        <span className="cms-collection-list__nav-parent">Контент</span>
        <div className="cms-collection-list__nav-children">
          <button className={activeCollection === 'instructors' ? 'is-active' : ''} type="button" onClick={() => onCollectionChange?.('instructors')}><span>Инструкторы</span><small>{counts.all}</small></button>
          <button className={activeCollection === 'activities' ? 'is-active' : ''} type="button" onClick={() => onCollectionChange?.('activities')}><span>Активности</span></button>
          <span>Прокат</span><span>Трансфер</span><span>Туры</span><span>Места</span>
        </div>
      </div>
      <nav className="cms-collection-list__secondary-nav" aria-label="Разделы админки"><span>Заявки</span><span>Отзывы</span><span>Настройки</span></nav>
      <div className="cms-collection-list__operator"><span aria-hidden="true">А</span><div><strong>Оператор</strong><small>admin</small></div><Button variant="ghost" size="md" onClick={onSignOut}>Выйти</Button></div>
    </aside>

    <div className="cms-collection-list__main">
      <header className="cms-collection-list__header">
        <div><h1>Инструкторы</h1><p>{counts.all} объектов · {counts.published} опубликовано · {counts.draft} черновика</p></div>
        <div className="cms-collection-list__header-actions">
          <label className="cms-collection-list__search"><span className="visually-hidden">Поиск по имени</span><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Поиск по имени…" /></label>
          <Button variant="secondary" size="md" disabled>Экспорт</Button>
          <Button variant="accent" size="md" onClick={onCreate}>+ Новый инструктор</Button>
        </div>
      </header>

      <div className="cms-collection-list__toolbar">
        <div className="cms-collection-list__filters">
          <SelectFilter label="Дисциплина" value={discipline} options={disciplines} onChange={onDisciplineChange} />
          <SelectFilter label="Язык" value={language} options={languages} onChange={onLanguageChange} />
          <SelectFilter label="Статус" value={status} options={[{ value: 'published', label: 'Опубликован' }, { value: 'draft', label: 'Черновик' }, { value: 'archived', label: 'В архиве' }]} onChange={onStatusChange} />
        </div>
        <span className="cms-collection-list__sort">Сортировка: по изменению ▾</span>
      </div>

      <div className="cms-collection-list__table-wrap">
        <table className="cms-collection-list__table">
          <thead><tr><th>Имя</th><th>Дисциплины</th><th>Язык</th><th>Стаж</th><th>Рейтинг</th><th>Статус</th><th>Изменён</th><th><span className="visually-hidden">Действия</span></th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id} tabIndex={0} className={openMenuId === item.id ? 'is-menu-open' : ''} onClick={() => onEdit(item.slug)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onEdit(item.slug); } }}>
            <td><span className="cms-collection-list__name">{item.image ? <img src={item.image} alt="" /> : <span className="cms-collection-list__avatar-placeholder" aria-hidden="true">—</span>}<strong>{item.name}</strong></span></td>
            <td><span className="cms-collection-list__badges">{item.disciplines?.map((value) => <Badge key={value} size="sm">{value}</Badge>) || '—'}</span></td>
            <td>{item.languages?.join(' ') || '—'}</td>
            <td>{item.experienceYears ? `${item.experienceYears} лет` : '—'}</td>
            <td>{item.rating ? <span className="cms-collection-list__rating"><span aria-hidden="true">★</span> {Number(item.rating).toFixed(1)}</span> : '—'}</td>
            <td><Badge tone={statusTone[item.status] ?? 'neutral'} size="sm"><span className="cms-collection-list__status-dot" aria-hidden="true" />{statusLabel[item.status] ?? item.status}</Badge></td>
            <td><UpdatedAt value={item.updated_at} /></td>
            <td className="cms-collection-list__menu-cell"><button type="button" className="cms-collection-list__menu-trigger" aria-label={`Действия: ${item.name}`} aria-expanded={openMenuId === item.id} onClick={(event) => { event.stopPropagation(); onOpenMenu(openMenuId === item.id ? null : item.id); }}>⋯</button>{openMenuId === item.id ? <div className="cms-collection-list__menu" onClick={(event) => event.stopPropagation()}><strong>{item.name}</strong><button type="button" onClick={() => onEdit(item.slug)}>Редактировать <kbd>↵</kbd></button><button type="button" disabled={busy} onClick={() => { onCloseMenu?.(); onDuplicate?.(item.slug); }}>Дублировать</button><a href={`/instructors/${item.slug}`} target="_blank" rel="noreferrer">Открыть на сайте ↗</a><button type="button" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/instructors/${item.slug}`); onCloseMenu?.(); }}>Копировать ссылку</button></div> : null}</td>
          </tr>)}</tbody>
        </table>
        {!items.length ? <div className="cms-collection-list__empty" role="status">По этим фильтрам нет инструкторов.</div> : null}
      </div>
    </div>
  </section>;
}
