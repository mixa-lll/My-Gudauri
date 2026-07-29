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
import { uploadMedia } from '../../services/mediaApi';
import { CmsActivityEditor, CmsCollectionList, CmsInstructorEditor } from '../../design-system';
import './AdminPage.scss';

/**
 * Every collection starts empty on purpose: blank fields are filled from the
 * shared `resolve*` helpers on save, and the editor previews those values.
 */
const EMPTY = {
  instructors: { slug: '', status: 'draft', display_name: '', role: '', card_description: '', tagline: '', intro: '', card_image_url: '', hero_image_url: '', hero_image_alt: '', booking_avatar_url: '', gender: '', experience_years: '', rating: 0, review_count: 0, availability_label: '', certificate_label: '', hourly_rate_gel: '', min_hours: '', max_hours: '', hours_step: '', min_people: '', max_people: '', default_hours: '', default_people: '', sort_order: '', disciplines: [], languages: [], about: [], tags: [], certifications: [], media: [], reviewsList: [] },
  activities: { slug: '', status: 'draft', name: '', category: '', description: '', card_image_url: '', hero_image_url: '', hero_image_alt: '', price_amount: '', currency: '', price_suffix: '', rating: 0, review_count: 0, catalog_group: '', skill_level: '', duration_group: '', format: '', sort_order: '', tags: [], facts: [], included: [], excluded: [], equipment: [], schedule: [], media: [], reviewsList: [] },
};

const TITLE_FIELD = { instructors: 'display_name', activities: 'name' };
const snapshot = (data) => JSON.stringify(data ?? null);

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(null); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState('instructors'); const [instructors, setInstructors] = useState([]); const [activities, setActivities] = useState([]); const [editor, setEditor] = useState(null); const [baseline, setBaseline] = useState(''); const [notice, setNotice] = useState(null); const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState(''); const [statusFilter, setStatusFilter] = useState('all'); const [categoryFilter, setCategoryFilter] = useState('all'); const [disciplineFilter, setDisciplineFilter] = useState('all'); const [languageFilter, setLanguageFilter] = useState('all'); const [openMenuId, setOpenMenuId] = useState(null);

  const report = (text, tone = 'info') => setNotice(text ? { text, tone } : null);
  // An expired session must return to the sign-in screen instead of stranding
  // the operator on an editor that can no longer save.
  const fail = (error) => { if (error?.code === 'unauthorized') { setAuthenticated(false); setEditor(null); } report(error.message, 'danger'); };
  const openEditorWith = (kind, data) => { setEditor({ kind, data }); setBaseline(snapshot(data)); };
  // A response without a `data` array must not take the whole screen down.
  const load = async () => { const [nextInstructors, nextActivities] = await Promise.all([getAdminInstructors(), getAdminActivities()]); setInstructors(Array.isArray(nextInstructors) ? nextInstructors : []); setActivities(Array.isArray(nextActivities) ? nextActivities : []); };

  useEffect(() => { getAdminSession().then(({ authenticated: allowed }) => { setAuthenticated(allowed); if (allowed) load().catch(fail); }).catch(() => setAuthenticated(false)); }, []);
  useEffect(() => { setEditor(null); setQuery(''); setStatusFilter('all'); setCategoryFilter('all'); setDisciplineFilter('all'); setLanguageFilter('all'); setOpenMenuId(null); }, [tab]);
  useEffect(() => { if (notice?.tone !== 'success') return undefined; const timer = setTimeout(() => setNotice(null), 4000); return () => clearTimeout(timer); }, [notice]);

  const dirty = Boolean(editor) && snapshot(editor.data) !== baseline;
  const closeEditor = () => { if (dirty && !window.confirm('В форме есть несохранённые изменения. Закрыть редактор и потерять их?')) return; setEditor(null); setNotice(null); };
  const signOut = async () => { await logout(); setAuthenticated(false); };
  // The collection name is what makes uploads reusable: each editor posts to
  // the same endpoint under its own prefix.
  const uploadFor = (collection) => (file) => uploadMedia({ collection, reference: editor?.data?.slug || editor?.data?.[TITLE_FIELD[collection]], file });

  const signIn = async (event) => { event.preventDefault(); setBusy(true); try { await login(password); setAuthenticated(true); setPassword(''); setNotice(null); await load(); } catch (error) { report(error.message, 'danger'); } finally { setBusy(false); } };
  const openEditor = async (slug) => { setBusy(true); try { const data = tab === 'activities' ? await getAdminActivity(slug) : await getAdminInstructor(slug); openEditorWith(tab, { ...data, originalSlug: slug }); } catch (error) { fail(error); } finally { setBusy(false); } };

  const persist = async (status) => {
    if (!editor) return;
    setBusy(true);
    try {
      const { kind } = editor;
      const data = { ...editor.data, status };
      const create = kind === 'activities' ? createActivity : createInstructor;
      const update = kind === 'activities' ? updateActivity : updateInstructor;
      const saved = data.id ? await update(data.originalSlug || data.slug, data) : await create(data);
      openEditorWith(kind, { ...saved, originalSlug: saved.slug });
      await load();
      report(status === 'published' ? 'Опубликовано.' : 'Черновик сохранён.', 'success');
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async (slug) => {
    setBusy(true);
    try {
      const copy = await duplicateInstructor(slug);
      await load();
      openEditorWith('instructors', { ...copy, originalSlug: copy.slug });
      setOpenMenuId(null);
      report('Копия создана как черновик.', 'success');
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!editor) return;
    const { kind, data } = editor;
    const label = data[TITLE_FIELD[kind]];
    if (!window.confirm(`Удалить «${label}»? Действие нельзя отменить.`)) return;
    setBusy(true);
    try {
      await (kind === 'activities' ? deleteActivity : deleteInstructor)(data.originalSlug || data.slug);
      setEditor(null);
      await load();
      report('Удалено.', 'success');
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const navCounts = { instructors: instructors.length, activities: activities.length };
  const matchesQuery = (item) => !query || item.name.toLowerCase().includes(query.toLowerCase());
  const matchesStatus = (item) => statusFilter === 'all' || item.status === statusFilter;

  const instructorDisciplines = useMemo(() => [...new Set(instructors.flatMap((item) => item.disciplines || []))], [instructors]);
  const instructorLanguages = useMemo(() => [...new Set(instructors.flatMap((item) => item.languages || []))], [instructors]);
  const activityCategories = useMemo(() => [...new Set(activities.map((item) => item.category).filter(Boolean))], [activities]);

  const visibleItems = useMemo(() => tab === 'activities'
    ? activities.filter((item) => matchesQuery(item) && matchesStatus(item) && (categoryFilter === 'all' || item.category === categoryFilter))
    : instructors.filter((item) => matchesQuery(item) && matchesStatus(item) && (disciplineFilter === 'all' || item.disciplines?.includes(disciplineFilter)) && (languageFilter === 'all' || item.languages?.includes(languageFilter))),
  [activities, categoryFilter, disciplineFilter, instructors, languageFilter, query, statusFilter, tab]);

  const filters = tab === 'activities'
    ? [{ label: 'Категория', value: categoryFilter, options: activityCategories, onChange: setCategoryFilter }]
    : [
      { label: 'Дисциплина', value: disciplineFilter, options: instructorDisciplines, onChange: setDisciplineFilter },
      { label: 'Язык', value: languageFilter, options: instructorLanguages, onChange: setLanguageFilter },
    ];

  const toast = notice ? <p className={`admin-notice admin-notice--cms admin-notice--${notice.tone}`} role={notice.tone === 'danger' ? 'alert' : 'status'}>{notice.text}<button type="button" aria-label="Закрыть уведомление" onClick={() => setNotice(null)}>×</button></p> : null;

  if (authenticated === null) return <main className="admin-shell"><p>Загружаем админку…</p></main>;
  if (!authenticated) return <main className="admin-login"><form onSubmit={signIn}><p className="admin-kicker">My Gudauri</p><h1>Админка</h1><p>Введите пароль администратора, чтобы управлять контентом.</p><label><span>Пароль</span><span className="admin-password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /><button className="admin-password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>{showPassword ? 'Скрыть' : 'Показать'}</button></span></label>{notice && <p className={`admin-notice admin-notice--${notice.tone}`} role="alert">{notice.text}</p>}<button disabled={busy}>{busy ? 'Проверяем…' : 'Войти'}</button></form></main>;

  if (editor) {
    const shared = {
      value: editor.data,
      onChange: (data) => setEditor({ ...editor, data }),
      onSave: () => persist(editor.data.status || 'draft'),
      onPublish: () => persist('published'),
      onDelete: remove,
      onBack: closeEditor,
      onSignOut: signOut,
      onNavigate: (collection) => { if (collection !== editor.kind) setTab(collection); else closeEditor(); },
      counts: navCounts,
      dirty,
      busy,
    };
    return <main className="admin-cms-shell">
      {toast}
      {editor.kind === 'activities'
        ? <CmsActivityEditor {...shared} onUploadMedia={uploadFor('activities')} />
        : <CmsInstructorEditor {...shared} onUploadMedia={uploadFor('instructors')} />}
    </main>;
  }

  return <main className="admin-cms-shell">
    {toast}
    <CmsCollectionList
      items={visibleItems}
      activeCollection={tab}
      counts={navCounts}
      onCollectionChange={setTab}
      onCreate={() => openEditorWith(tab, { ...EMPTY[tab] })}
      onEdit={openEditor}
      onDuplicate={tab === 'instructors' ? duplicate : undefined}
      openMenuId={openMenuId}
      onOpenMenu={setOpenMenuId}
      onCloseMenu={() => setOpenMenuId(null)}
      query={query}
      onQueryChange={setQuery}
      filters={filters}
      status={statusFilter}
      onStatusChange={setStatusFilter}
      onSignOut={signOut}
      busy={busy}
    />
  </main>;
}
