import { useState } from 'react';
import { Badge, Button, Checkbox, FormField, Input, Select, Textarea } from '../../../components';
import './CmsInstructorEditor.scss';

const disciplineOptions = [
  { value: 'snowboard', label: 'Сноуборд' },
  { value: 'ski', label: 'Лыжи' },
];

const languageOptions = [
  { value: 'Ge', label: 'Ge' },
  { value: 'En', label: 'En' },
  { value: 'Ru', label: 'Ru' },
];

const statusLabels = {
  draft: 'Черновик',
  published: 'Опубликован',
  archived: 'В архиве',
};

function SectionHeading({ number, title, description }) {
  return <div className="cms-instructor-editor__section-heading"><span>{number}</span><div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div></div>;
}

function ChoiceGroup({ label, options, value = [], onChange, required = false }) {
  const toggle = (option) => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  return <fieldset className="cms-instructor-editor__choice-group"><legend>{label}{required ? <span aria-hidden="true"> *</span> : null}</legend><div>{options.map((option) => <Checkbox label={option.label} checked={value.includes(option.value)} onChange={() => toggle(option.value)} key={option.value} />)}</div></fieldset>;
}

function ListEditor({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const next = draft.trim();
    if (!next || value.includes(next)) return;
    onChange([...value, next]);
    setDraft('');
  };
  return <div className="cms-instructor-editor__list-editor">
    <span>{label}</span>
    <div className="cms-instructor-editor__chips">{value.map((item) => <Badge size="sm" key={item}>{item}<button type="button" aria-label={`Удалить ${item}`} onClick={() => onChange(value.filter((valueItem) => valueItem !== item))}>×</button></Badge>)}</div>
    <div className="cms-instructor-editor__inline-add"><Input value={draft} placeholder={placeholder} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); add(); } }} /><Button variant="secondary" size="md" onClick={add}>Добавить</Button></div>
  </div>;
}

function CertificationsEditor({ value = [], onChange }) {
  const update = (index, key, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  return <div className="cms-instructor-editor__repeaters">{value.map((item, index) => <div className="cms-instructor-editor__certificate" key={`${item.title}-${index}`}>
    <span className="cms-instructor-editor__file-icon" aria-hidden="true">▤</span>
    <FormField label="Название" required><Input value={item.title ?? ''} onChange={(event) => update(index, 'title', event.target.value)} /></FormField>
    <FormField label="Уровень / год"><Input value={item.level ?? ''} onChange={(event) => update(index, 'level', event.target.value)} /></FormField>
    <FormField label="Ссылка на файл"><Input value={item.file_url ?? item.fileUrl ?? ''} placeholder="/assets/certificates/file.jpg или https://…" onChange={(event) => update(index, 'file_url', event.target.value)} /></FormField>
    <Button iconOnly variant="ghost" aria-label={`Удалить сертификат ${item.title || index + 1}`} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</Button>
  </div>)}<Button className="cms-instructor-editor__dashed-action" variant="secondary" onClick={() => onChange([...value, { title: '', level: '', file_url: '' }])}>+ Добавить сертификат</Button></div>;
}

function MediaEditor({ value = [], onChange }) {
  const update = (index, key, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  return <div className="cms-instructor-editor__repeaters">{value.map((item, index) => <div className="cms-instructor-editor__media-row" key={`${item.url}-${index}`}>
    <FormField label="Тип"><Select value={item.type ?? 'image'} onChange={(event) => update(index, 'type', event.target.value)}><option value="image">Фото</option><option value="video">Видео</option></Select></FormField>
    <FormField label="URL" required><Input value={item.url ?? ''} placeholder="/assets/media/photo.jpg или https://…" onChange={(event) => update(index, 'url', event.target.value)} /></FormField>
    <FormField label="Описание"><Input value={item.alt ?? ''} onChange={(event) => update(index, 'alt', event.target.value)} /></FormField>
    <Checkbox label="Главное" checked={Boolean(item.featured)} onChange={(event) => update(index, 'featured', event.target.checked)} />
    <Button iconOnly variant="ghost" aria-label={`Удалить медиа ${index + 1}`} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</Button>
  </div>)}<Button className="cms-instructor-editor__dashed-action" variant="secondary" onClick={() => onChange([...value, { type: 'image', url: '', alt: '', featured: false }])}>+ Добавить медиа</Button></div>;
}

function AdminRail({ count = 0, onBack, onSignOut }) {
  return <aside className="cms-instructor-editor__rail">
    <div className="cms-instructor-editor__brand"><span>My</span> Gudauri</div>
    <p className="cms-instructor-editor__eyebrow">Управление</p>
    <span className="cms-instructor-editor__nav-parent">Контент</span>
    <div className="cms-instructor-editor__nav-children">
      <button className="is-active" type="button" onClick={onBack}><span>Инструкторы</span><small>{count}</small></button>
      <span>Активности</span><span>Прокат</span><span>Трансфер</span><span>Туры</span><span>Места</span>
    </div>
    <nav className="cms-instructor-editor__secondary-nav" aria-label="Разделы админки"><span>Заявки</span><span>Отзывы</span><span>Настройки</span></nav>
    <div className="cms-instructor-editor__operator"><span aria-hidden="true">А</span><div><strong>Оператор</strong><small>admin</small></div><Button variant="ghost" onClick={onSignOut}>Выйти</Button></div>
  </aside>;
}

export function CmsInstructorEditor({ value, onChange, onSave, onPublish, onDelete, onBack, onSignOut, instructorCount = 0, busy = false }) {
  const field = (name, next) => onChange({ ...value, [name]: next });
  const aboutText = (value.about ?? []).join('\n\n');
  const status = value.status ?? 'draft';
  const isPublished = status === 'published';
  const formId = 'cms-instructor-editor-form';

  return <section className="cms-instructor-editor" aria-label={value.id ? `Редактор инструктора ${value.display_name}` : 'Новый инструктор'}>
    <AdminRail count={instructorCount} onBack={onBack} onSignOut={onSignOut} />
    <form id={formId} className="cms-instructor-editor__main" onSubmit={(event) => { event.preventDefault(); const action = event.nativeEvent.submitter?.value; if (action === 'publish') onPublish(); else onSave(); }}>
      <header className="cms-instructor-editor__header">
        <button className="cms-instructor-editor__breadcrumb" type="button" onClick={onBack}>Инструкторы</button><span aria-hidden="true">/</span><strong>{value.display_name || 'Новый инструктор'}</strong>
        <Badge tone={isPublished ? 'success' : status === 'archived' ? 'neutral' : 'warning'} size="sm">{statusLabels[status]}</Badge>
        <div className="cms-instructor-editor__header-actions"><Button variant="secondary" type="submit" value="save" loading={busy} loadingLabel="Сохранение">Сохранить</Button><Button variant="accent" type="submit" value="publish" loading={busy} loadingLabel="Публикация">{isPublished ? 'Обновить публикацию' : 'Опубликовать'}</Button></div>
      </header>

      <div className="cms-instructor-editor__content">
        <div className="cms-instructor-editor__category"><span>Категория</span><Badge>Инструктор</Badge></div>

        <section className="cms-instructor-editor__card">
          <SectionHeading number="1" title="Шапка профиля" description="Основные данные карточки и страницы инструктора." />
          <div className="cms-instructor-editor__hero-fields">
            <div className="cms-instructor-editor__photo-field">
              <span>Главное фото *</span>
              <div>{value.card_image_url ? <img src={value.card_image_url} alt="" /> : <span aria-hidden="true">↑<small>Добавьте URL</small></span>}</div>
              <Input value={value.card_image_url ?? ''} placeholder="/assets/instructors/photo.jpg" onChange={(event) => field('card_image_url', event.target.value)} required />
            </div>
            <div className="cms-instructor-editor__field-stack">
              <FormField label="Имя" required><Input value={value.display_name ?? ''} onChange={(event) => field('display_name', event.target.value)} /></FormField>
              <FormField label="Slug" hint="Используется в адресе страницы"><Input value={value.slug ?? ''} placeholder="mikhail-andreev" onChange={(event) => field('slug', event.target.value)} /></FormField>
              <ChoiceGroup label="Дисциплины" required options={disciplineOptions} value={value.disciplines} onChange={(next) => field('disciplines', next)} />
            </div>
          </div>
          <FormField label="Описание карточки" required hint="Короткий текст в каталоге"><Input value={value.card_description ?? ''} onChange={(event) => field('card_description', event.target.value)} /></FormField>
          <FormField label="Заголовок профиля" required><Input value={value.tagline ?? ''} onChange={(event) => field('tagline', event.target.value)} /></FormField>
          <FormField label="Короткое интро" required><Textarea value={value.intro ?? ''} onChange={(event) => field('intro', event.target.value)} /></FormField>
          <div className="cms-instructor-editor__two-columns">
            <FormField label="Статус доступности"><Input value={value.availability_label ?? ''} placeholder="Свободен на этой неделе" onChange={(event) => field('availability_label', event.target.value)} /></FormField>
            <FormField label="Роль"><Input value={value.role ?? ''} onChange={(event) => field('role', event.target.value)} /></FormField>
          </div>
        </section>

        <section className="cms-instructor-editor__card">
          <SectionHeading number="2" title="Главные теги" description="Данные, которые помогают фильтровать и сравнивать инструкторов." />
          <div className="cms-instructor-editor__two-columns">
            <ChoiceGroup label="Языки" required options={languageOptions} value={value.languages} onChange={(next) => field('languages', next)} />
            <FormField label="Стаж, лет" required><Input type="number" min="0" value={value.experience_years ?? 0} onChange={(event) => field('experience_years', event.target.value)} /></FormField>
            <FormField label="Сертификация"><Input value={value.certificate_label ?? ''} placeholder="Проверенный инструктор" onChange={(event) => field('certificate_label', event.target.value)} /></FormField>
            <FormField label="Пол"><Select value={value.gender ?? ''} onChange={(event) => field('gender', event.target.value)}><option value="">Не указан</option><option value="male">Мужской</option><option value="female">Женский</option></Select></FormField>
          </div>
        </section>

        <section className="cms-instructor-editor__card">
          <SectionHeading number="3" title="Об инструкторе" description="Каждый абзац сохраняется отдельным блоком на странице." />
          <FormField label="Текст профиля" required hint="Разделяйте абзацы пустой строкой"><Textarea className="cms-instructor-editor__about" value={aboutText} onChange={(event) => field('about', event.target.value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean))} /></FormField>
        </section>

        <section className="cms-instructor-editor__card">
          <SectionHeading number="4" title="Дополнительные теги" description="Например: новички, дети, карвинг, фрирайд." />
          <ListEditor label="Теги" value={value.tags} placeholder="Новый тег" onChange={(next) => field('tags', next)} />
        </section>

        <section className="cms-instructor-editor__card">
          <SectionHeading number="5" title="Сертификаты" description="Динамический список сертификатов инструктора." />
          <CertificationsEditor value={value.certifications} onChange={(next) => field('certifications', next)} />
        </section>

        <section className="cms-instructor-editor__card">
          <SectionHeading number="6" title="Изображения и бронирование" description="Данные страницы профиля и ограничения формы бронирования." />
          <div className="cms-instructor-editor__two-columns">
            <FormField label="Hero image URL" required><Input value={value.hero_image_url ?? ''} placeholder="/assets/instructors/hero.jpg или https://…" onChange={(event) => field('hero_image_url', event.target.value)} /></FormField>
            <FormField label="Hero image alt" required><Input value={value.hero_image_alt ?? ''} onChange={(event) => field('hero_image_alt', event.target.value)} /></FormField>
            <FormField label="Booking avatar URL" required><Input value={value.booking_avatar_url ?? ''} placeholder="/assets/instructors/avatar.jpg или https://…" onChange={(event) => field('booking_avatar_url', event.target.value)} /></FormField>
            <FormField label="Тариф, GEL/час"><Input type="number" min="0" value={value.hourly_rate_gel ?? 345} onChange={(event) => field('hourly_rate_gel', event.target.value)} /></FormField>
            <FormField label="Мин. часов"><Input type="number" min="1" value={value.min_hours ?? 1} onChange={(event) => field('min_hours', event.target.value)} /></FormField>
            <FormField label="Макс. часов"><Input type="number" min="1" value={value.max_hours ?? 12} onChange={(event) => field('max_hours', event.target.value)} /></FormField>
            <FormField label="Шаг часов"><Input type="number" min="1" value={value.hours_step ?? 1} onChange={(event) => field('hours_step', event.target.value)} /></FormField>
            <FormField label="Мин. гостей"><Input type="number" min="1" value={value.min_people ?? 1} onChange={(event) => field('min_people', event.target.value)} /></FormField>
            <FormField label="Макс. гостей"><Input type="number" min="1" value={value.max_people ?? 10} onChange={(event) => field('max_people', event.target.value)} /></FormField>
            <FormField label="Часов по умолчанию"><Input type="number" min="1" value={value.default_hours ?? 2} onChange={(event) => field('default_hours', event.target.value)} /></FormField>
            <FormField label="Гостей по умолчанию"><Input type="number" min="1" value={value.default_people ?? 1} onChange={(event) => field('default_people', event.target.value)} /></FormField>
            <FormField label="Порядок в каталоге"><Input type="number" value={value.sort_order ?? 100} onChange={(event) => field('sort_order', event.target.value)} /></FormField>
          </div>
          <MediaEditor value={value.media} onChange={(next) => field('media', next)} />
        </section>

        <div className="cms-instructor-editor__footer-actions"><Button variant="secondary" type="submit" value="save" loading={busy}>{isPublished ? 'Сохранить изменения' : 'Сохранить черновик'}</Button><Button variant="accent" type="submit" value="publish" loading={busy}>{isPublished ? 'Обновить публикацию' : 'Опубликовать'}</Button>{value.id ? <Button variant="destructive" onClick={onDelete} disabled={busy}>Удалить</Button> : null}</div>
      </div>
    </form>
  </section>;
}
