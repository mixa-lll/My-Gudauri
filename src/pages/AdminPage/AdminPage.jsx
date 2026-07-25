import { useEffect, useMemo, useState } from 'react';
import {
  createActivity,
  createInstructor,
  deleteActivity,
  deleteInstructor,
  duplicateInstructor,
  getAdminActivities,
  getAdminActivity,
  getAdminInstructors,
  getAdminInstructor,
  getAdminSession,
  login,
  logout,
  updateActivity,
  updateInstructor,
} from '../../services/adminApi';
import { CmsCollectionList, CmsInstructorEditor } from '../../design-system';
import './AdminPage.scss';

const emptyInstructor = { slug: '', status: 'draft', display_name: '', role: 'Instructor', card_description: '', tagline: '', intro: '', card_image_url: '', hero_image_url: '', hero_image_alt: '', booking_avatar_url: '', gender: '', experience_years: 0, rating: 5, review_count: 0, availability_label: '', certificate_label: '', hourly_rate_gel: 345, min_hours: 2, max_hours: 12, hours_step: 2, min_people: 1, max_people: 10, default_hours: 2, default_people: 1, sort_order: 100, disciplines: [], languages: [], about: [], tags: [], certifications: [], media: [], reviewsList: [] };
const emptyActivity = { slug: '', status: 'draft', name: '', category: '', description: '', card_image_url: '', hero_image_url: '', hero_image_alt: '', price_amount: 0, currency: 'GEL', price_suffix: 'per guest', rating: 5, review_count: 0, catalog_group: 'other', skill_level: '', duration_group: '', format: '', sort_order: 100, tags: [], facts: [{ label: 'Difficulty', value: '1' }, { label: 'Duration', value: '1 hour' }, { label: 'Highest point', value: '0 m' }, { label: 'Elevation change', value: '0 m' }], included: [], excluded: [], equipment: [], schedule: [], media: [], reviewsList: [] };
function ArrayField({ label, value = [], onChange, placeholder }) {
  const update = (index, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? next : item));
  return <label className="admin-field admin-field--wide"><span>{label}</span><div className="admin-list-input">{value.map((item, index) => <div key={`${item}-${index}`}><input value={item} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} /><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}<button type="button" className="admin-add-inline" onClick={() => onChange([...value, ''])}>Add</button></div></label>;
}

function JsonField({ label, value, onChange, hint }) {
  const [error, setError] = useState('');
  const [raw, setRaw] = useState(JSON.stringify(value || [], null, 2));
  useEffect(() => { setRaw(JSON.stringify(value || [], null, 2)); }, [value]);
  return <label className="admin-field admin-field--wide"><span>{label}</span><small>{hint}</small><textarea value={raw} onChange={(event) => { const nextRaw = event.target.value; setRaw(nextRaw); try { const next = JSON.parse(nextRaw); if (!Array.isArray(next)) throw new Error(); onChange(next); setError(''); } catch { setError('Use a valid JSON array.'); } }} />{error && <small className="admin-json-error">{error}</small>}</label>;
}

function FactList({ value = [], onChange }) {
  const update = (index, key, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  return <div className="admin-field admin-field--wide"><span>Facts</span><div className="admin-fact-list">{value.map((item, index) => <div key={`${item.label}-${index}`}><input aria-label="Fact label" placeholder="Label" value={item.label ?? ''} onChange={(event) => update(index, 'label', event.target.value)} /><input aria-label="Fact value" placeholder="Value" value={item.value ?? ''} onChange={(event) => update(index, 'value', event.target.value)} /><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}<button type="button" className="admin-add-inline" onClick={() => onChange([...value, { label: '', value: '' }])}>Add fact</button></div></div>;
}

function ScheduleList({ value = [], onChange }) {
  const update = (index, key, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  return <div className="admin-field admin-field--wide"><span>Schedule</span><div className="admin-schedule-list">{value.map((item, index) => <div key={`${item.time}-${item.title}-${index}`}><input aria-label="Schedule time" placeholder="10:00" value={item.time ?? ''} onChange={(event) => update(index, 'time', event.target.value)} /><input aria-label="Schedule title" placeholder="Meeting point" value={item.title ?? ''} onChange={(event) => update(index, 'title', event.target.value)} /><input aria-label="Schedule description" placeholder="Optional description" value={item.description ?? ''} onChange={(event) => update(index, 'description', event.target.value)} /><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}<button type="button" className="admin-add-inline" onClick={() => onChange([...value, { time: '', title: '', description: '' }])}>Add schedule item</button></div></div>;
}

function ActivityEditor({ editor, setEditor, onSave, onDelete, onClose, busy }) {
  const input = (name, label, type = 'text') => <label className="admin-field" key={name}><span>{label}</span>{type === 'textarea' ? <textarea value={editor[name] ?? ''} onChange={(event) => setEditor({ ...editor, [name]: event.target.value })} /> : type === 'select' ? <select value={editor[name] ?? ''} onChange={(event) => setEditor({ ...editor, [name]: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select> : <input type={type} step={name === 'rating' ? '0.1' : undefined} value={editor[name] ?? ''} onChange={(event) => setEditor({ ...editor, [name]: event.target.value })} />}</label>;
  return <section className="admin-editor"><div className="admin-section__title"><div><p className="admin-kicker">Activity editor</p><h2>{editor.id ? editor.name || 'Activity' : 'New activity'}</h2></div><button className="admin-quiet" type="button" onClick={onClose}>Close</button></div><form onSubmit={onSave}><fieldset className="admin-form-group"><legend>Card</legend><div className="admin-form">{input('name', 'Name')}{input('slug', 'Slug')}{input('status', 'Status', 'select')}{input('category', 'Category')}{input('card_image_url', 'Card image URL', 'url')}{input('sort_order', 'Sort order', 'number')}</div></fieldset><fieldset className="admin-form-group"><legend>Page</legend><div className="admin-form">{input('description', 'Description', 'textarea')}{input('hero_image_url', 'Hero image URL', 'url')}{input('hero_image_alt', 'Hero image alt text')}</div></fieldset><fieldset className="admin-form-group"><legend>Price and metrics</legend><div className="admin-form">{input('price_amount', 'Price', 'number')}{input('currency', 'Currency')}{input('price_suffix', 'Price suffix')}{input('rating', 'Rating (0–5)', 'number')}{input('review_count', 'Review count', 'number')}</div></fieldset><fieldset className="admin-form-group"><legend>Catalog filters</legend><div className="admin-form">{input('catalog_group', 'Catalog group')}{input('skill_level', 'Level')}{input('duration_group', 'Duration group')}{input('format', 'Format')}</div></fieldset><fieldset className="admin-form-group"><legend>Content lists</legend><div className="admin-form"><ArrayField label="Tags" value={editor.tags} placeholder="Transfer" onChange={(tags) => setEditor({ ...editor, tags })} /><FactList value={editor.facts} onChange={(facts) => setEditor({ ...editor, facts })} /><ScheduleList value={editor.schedule} onChange={(schedule) => setEditor({ ...editor, schedule })} /><ArrayField label="Included" value={editor.included} placeholder="Local guide" onChange={(included) => setEditor({ ...editor, included })} /><ArrayField label="Not included" value={editor.excluded} placeholder="Personal insurance" onChange={(excluded) => setEditor({ ...editor, excluded })} /><ArrayField label="What to bring" value={editor.equipment} placeholder="Warm waterproof layers" onChange={(equipment) => setEditor({ ...editor, equipment })} /><JsonField label="Gallery media" hint={'Example: [{"type":"image","url":"/assets/photo.jpg","alt":"View","featured":true}]'} value={editor.media} onChange={(media) => setEditor({ ...editor, media })} /><JsonField label="Reviews" hint={'Example: [{"author":"Anna","context":"Ski tour","rating":5,"date":"2026-03-12","body":"Great day.","published":true}]'} value={editor.reviewsList} onChange={(reviewsList) => setEditor({ ...editor, reviewsList })} /></div></fieldset><div className="admin-editor__actions"><button disabled={busy}>{busy ? 'Saving…' : 'Save activity'}</button>{editor.id && <button type="button" className="admin-danger" onClick={onDelete} disabled={busy}>Delete</button>}</div></form></section>;
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(null); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState('instructors'); const [instructors, setInstructors] = useState([]); const [activities, setActivities] = useState([]); const [editor, setEditor] = useState(null); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState(''); const [categoryFilter, setCategoryFilter] = useState('all'); const [statusFilter, setStatusFilter] = useState('all'); const [disciplineFilter, setDisciplineFilter] = useState('all'); const [languageFilter, setLanguageFilter] = useState('all'); const [openMenuId, setOpenMenuId] = useState(null);
  const load = async () => { const [nextInstructors, nextActivities] = await Promise.all([getAdminInstructors(), getAdminActivities()]); setInstructors(nextInstructors); setActivities(nextActivities); };
  useEffect(() => { getAdminSession().then(({ authenticated: allowed }) => { setAuthenticated(allowed); if (allowed) load().catch((error) => setNotice(error.message)); }).catch(() => setAuthenticated(false)); }, []);
  useEffect(() => { setEditor(null); setQuery(''); setCategoryFilter('all'); setStatusFilter('all'); setDisciplineFilter('all'); setLanguageFilter('all'); setOpenMenuId(null); }, [tab]);
  const signIn = async (event) => { event.preventDefault(); setBusy(true); try { await login(password); setAuthenticated(true); setPassword(''); await load(); } catch (error) { setNotice(error.message); } finally { setBusy(false); } };
  const openEditor = async (slug) => { setBusy(true); try { const data = tab === 'activities' ? await getAdminActivity(slug) : await getAdminInstructor(slug); setEditor({ kind: tab, data: { ...data, originalSlug: slug } }); } catch (error) { setNotice(error.message); } finally { setBusy(false); } };
  const save = async (event) => { event.preventDefault(); if (!editor) return; setBusy(true); try { const { kind, data } = editor; const saved = kind === 'activities' ? (data.id ? await updateActivity(data.originalSlug || data.slug, data) : await createActivity(data)) : (data.id ? await updateInstructor(data.originalSlug || data.slug, data) : await createInstructor(data)); setEditor({ kind, data: { ...saved, originalSlug: saved.slug } }); await load(); setNotice('Saved.'); } catch (error) { setNotice(error.message); } finally { setBusy(false); } };
  const persistInstructor = async (status) => {
    if (editor?.kind !== 'instructors') return;
    setBusy(true);
    try {
      const data = { ...editor.data, status };
      const saved = data.id
        ? await updateInstructor(data.originalSlug || data.slug, data)
        : await createInstructor(data);
      setEditor({ kind: 'instructors', data: { ...saved, originalSlug: saved.slug } });
      await load();
      setNotice(status === 'published' ? 'Инструктор опубликован.' : 'Изменения сохранены.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };
  const duplicate = async (slug) => {
    setBusy(true);
    try {
      const copy = await duplicateInstructor(slug);
      await load();
      setEditor({ kind: 'instructors', data: { ...copy, originalSlug: copy.slug } });
      setOpenMenuId(null);
      setNotice('Копия создана как черновик.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => { if (!editor) return; const { kind, data } = editor; const label = kind === 'activities' ? data.name : data.display_name; if (!window.confirm(`Delete ${label}?`)) return; setBusy(true); try { kind === 'activities' ? await deleteActivity(data.originalSlug || data.slug) : await deleteInstructor(data.originalSlug || data.slug); setEditor(null); await load(); setNotice('Deleted.'); } catch (error) { setNotice(error.message); } finally { setBusy(false); } };
  const activeItems = tab === 'activities' ? activities : instructors;
  const categories = useMemo(() => [...new Set(activeItems.map((item) => item.category).filter(Boolean))], [activeItems]);
  const filteredItems = useMemo(() => activeItems.filter((item) => (!query || item.name.toLowerCase().includes(query.toLowerCase())) && (statusFilter === 'all' || item.status === statusFilter) && (categoryFilter === 'all' || item.category === categoryFilter)), [activeItems, categoryFilter, query, statusFilter]);
  const instructorDisciplines = useMemo(() => [...new Set(instructors.flatMap((item) => item.disciplines || []))], [instructors]);
  const instructorLanguages = useMemo(() => [...new Set(instructors.flatMap((item) => item.languages || []))], [instructors]);
  const filteredInstructors = useMemo(() => instructors.filter((item) => (!query || item.name.toLowerCase().includes(query.toLowerCase())) && (statusFilter === 'all' || item.status === statusFilter) && (disciplineFilter === 'all' || item.disciplines?.includes(disciplineFilter)) && (languageFilter === 'all' || item.languages?.includes(languageFilter))), [disciplineFilter, instructors, languageFilter, query, statusFilter]);
  const counts = useMemo(() => ({ all: activeItems.length, published: activeItems.filter((item) => item.status === 'published').length, draft: activeItems.filter((item) => item.status === 'draft').length }), [activeItems]);
  if (authenticated === null) return <main className="admin-shell"><p>Loading admin…</p></main>;
  if (!authenticated) return <main className="admin-login"><form onSubmit={signIn}><p className="admin-kicker">My Gudauri</p><h1>Admin panel</h1><p>Enter the administrator password to manage content.</p><label><span>Password</span><span className="admin-password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /><button className="admin-password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></span></label>{notice && <p className="admin-notice">{notice}</p>}<button disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button></form></main>;
  if (tab === 'instructors') {
    if (editor?.kind === 'instructors') return <main className="admin-cms-shell">
      {notice && <p className="admin-notice admin-notice--cms" role="status">{notice}</p>}
      <CmsInstructorEditor
        value={editor.data}
        onChange={(data) => setEditor({ ...editor, data })}
        onSave={() => persistInstructor(editor.data.status || 'draft')}
        onPublish={() => persistInstructor('published')}
        onDelete={remove}
        onBack={() => setEditor(null)}
        onSignOut={async () => { await logout(); setAuthenticated(false); }}
        instructorCount={instructors.length}
        busy={busy}
      />
    </main>;
    return <main className="admin-cms-shell">{notice && <p className="admin-notice admin-notice--cms" role="status">{notice}</p>}<CmsCollectionList items={filteredInstructors} activeCollection={tab} onCollectionChange={setTab} onCreate={() => setEditor({ kind: 'instructors', data: { ...emptyInstructor } })} onEdit={openEditor} onDuplicate={duplicate} openMenuId={openMenuId} onOpenMenu={setOpenMenuId} onCloseMenu={() => setOpenMenuId(null)} query={query} onQueryChange={setQuery} discipline={disciplineFilter} onDisciplineChange={setDisciplineFilter} disciplines={instructorDisciplines} language={languageFilter} onLanguageChange={setLanguageFilter} languages={instructorLanguages} status={statusFilter} onStatusChange={setStatusFilter} onSignOut={async () => { await logout(); setAuthenticated(false); }} busy={busy} /></main>;
  }
  const label = 'Activities';
  return <main className="admin-shell"><header className="admin-top"><div><p className="admin-kicker">My Gudauri CMS</p><h1>Content management</h1></div><button type="button" className="admin-quiet" onClick={async () => { await logout(); setAuthenticated(false); }}>Sign out</button></header>{notice && <p className="admin-notice" role="status">{notice}</p>}<nav className="admin-tabs" aria-label="Content types"><button className={tab === 'instructors' ? 'is-active' : ''} type="button" onClick={() => setTab('instructors')}>Instructors {instructors.length}</button><button className={tab === 'activities' ? 'is-active' : ''} type="button" onClick={() => setTab('activities')}>Activities {activities.length}</button></nav><section className="admin-section"><div className="admin-section__title"><div><p className="admin-kicker">Cards list</p><h2>{label}</h2><p className="admin-counts">{counts.all} total · {counts.published} published · {counts.draft} drafts</p></div><button type="button" onClick={() => setEditor({ kind: tab, data: tab === 'activities' ? { ...emptyActivity } : { ...emptyInstructor } })}>Add {tab === 'activities' ? 'activity' : 'instructor'}</button></div><div className="admin-filters"><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name…" aria-label={`Search ${label.toLowerCase()}`} />{tab === 'activities' && <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>}<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Preview</th><th>Name</th><th>{tab === 'activities' ? 'Category / tags' : 'Details'}</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.id}><td>{item.image ? <img src={item.image} alt="" /> : <span className="admin-image-placeholder" aria-label="No image">—</span>}</td><td><strong>{item.name}</strong></td><td>{tab === 'activities' ? <span>{item.category}<small>{item.tags?.join(' · ')}</small></span> : item.description}</td><td><span className={`admin-status admin-status--${item.status}`}>{item.status}</span></td><td>{item.updated_at ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(`${item.updated_at}Z`)) : '—'}</td><td><button type="button" className="admin-quiet" onClick={() => openEditor(item.slug)}>Edit</button></td></tr>)}</tbody></table></div>{!filteredItems.length && <p className="admin-empty">No {label.toLowerCase()} match these filters.</p>}</section>{editor?.kind === 'activities' && <ActivityEditor editor={editor.data} setEditor={(data) => setEditor({ ...editor, data })} onSave={save} onDelete={remove} onClose={() => setEditor(null)} busy={busy} />}</main>;
}
