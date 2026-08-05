import { useMemo, useState } from 'react';
import { Button, FormField, Input, Select } from '../../../components';
import { AUTOFILLED_FIELDS, INSTRUCTOR_DEFAULTS, listAutofilledFields, resolveInstructor, validateInstructor } from '../../../shared/instructorDefaults';
import { AutoField, ChoiceGroup, CmsEditorShell, FieldGroup, GalleryEditor, InheritedSettings, ListEditor, ParagraphEditor, Repeater, describeCategoryPricing, isBlank } from './CmsEditorParts';
import { MediaUploadField } from './MediaUploadField';
import './CmsInstructorEditor.scss';

const disciplineOptions = [
  { value: 'snowboard', label: 'Сноуборд' },
  { value: 'ski', label: 'Лыжи' },
];

const languageOptions = [
  { value: 'Ge', label: 'Грузинский' },
  { value: 'En', label: 'Английский' },
  { value: 'Ru', label: 'Русский' },
];

const AUTOFILLED_TOTAL = AUTOFILLED_FIELDS.length;

export function CmsInstructorEditor({
  value,
  onChange,
  onSave,
  onPublish,
  onDelete,
  onBack,
  onSignOut,
  onNavigate,
  onUploadMedia,
  onDeleteMedia,
  onOpenCategorySettings,
  categoryPricing,
  counts,
  instructorCount = 0,
  busy = false,
  dirty = false,
}) {
  const [submitted, setSubmitted] = useState(null);
  const field = (name, next) => onChange({ ...value, [name]: next });
  const input = (name) => (event) => field(name, event.target.value);
  const status = value.status ?? 'draft';
  const isPublished = status === 'published';

  const auto = useMemo(() => resolveInstructor(value), [value]);
  const autofilled = useMemo(() => listAutofilledFields(value), [value]);
  const visibleErrors = submitted ? validateInstructor(value, { publishing: submitted === 'publish' || isPublished }) : {};

  // Read-only echo of what this instructor inherits, so an operator can see the
  // price they are selling at without being able to fork it by accident.
  const categorySummary = useMemo(() => describeCategoryPricing(categoryPricing), [categoryPricing]);

  const submit = (action) => {
    setSubmitted(action);
    // Saving an already-published object keeps it live, so it faces the same
    // checks the API applies to a publish.
    if (Object.keys(validateInstructor(value, { publishing: action === 'publish' || isPublished })).length) return;
    if (action === 'publish') onPublish(); else onSave();
  };

  return <CmsEditorShell
    collection="instructors"
    counts={counts ?? { instructors: instructorCount }}
    onNavigate={onNavigate}
    onSignOut={onSignOut}
    onBack={onBack}
    backLabel="Инструкторы"
    objectLabel="Инструктор"
    title={value.display_name}
    fallbackTitle="Новый инструктор"
    publicPath={`/instructors/${auto.slug || '…'}`}
    note={autofilled.length
      ? `Обязательное поле одно — имя. ${autofilled.length} из ${AUTOFILLED_TOTAL} остальных полей заполним автоматически — дописать их можно позже.`
      : 'Все поля заполнены вручную — автоподстановка не понадобится.'}
    meter={{ filled: AUTOFILLED_TOTAL - autofilled.length, total: AUTOFILLED_TOTAL }}
    previewImage={value.card_image_url}
    placeholderKind="instructor"
    status={status}
    dirty={dirty}
    busy={busy}
    errors={Object.entries(visibleErrors).map(([name, message]) => ({ id: name, message }))}
    onSubmit={submit}
    onDelete={onDelete}
    canDelete={Boolean(value.id)}
  >
    <FieldGroup feeds="ListingCard" title="Профиль" description="Единственное обязательное поле — имя. Дисциплины нужны, чтобы опубликовать инструктора и показать его в фильтрах каталога.">
      <MediaUploadField
        label="Главное фото"
        hint="Перетащите фото или выберите файл. Пусто — в каталоге покажем фирменную заглушку."
        placeholderKind="instructor"
        placeholderLabel={value.display_name}
        value={value.card_image_url}
        onChange={(next) => field('card_image_url', next)}
        onUpload={onUploadMedia}
        onRemove={onDeleteMedia}
      />
      <FormField label="Имя" required error={visibleErrors.display_name} hint="Как инструктора зовут на сайте и в заявках."><Input value={value.display_name ?? ''} placeholder="Mikhail Andreev" onChange={input('display_name')} /></FormField>
      <ChoiceGroup label="Дисциплины" required options={disciplineOptions} value={value.disciplines} error={visibleErrors.disciplines} onChange={(next) => field('disciplines', next)} />
      <div className="cms-editor__two-columns">
        <ChoiceGroup label="Языки" options={languageOptions} value={value.languages} hint="Используются в фильтре каталога." onChange={(next) => field('languages', next)} />
        <FormField label="Стаж, лет" hint={isBlank(value.experience_years) ? 'Пусто — покажем «0».' : undefined}><Input type="number" min="0" value={value.experience_years ?? ''} placeholder="0" onChange={input('experience_years')} /></FormField>
      </div>
    </FieldGroup>

    <FieldGroup feeds="ObjectDescription" title="Тексты для сайта" description="Ни одно поле не обязательно: под каждым показано, что уйдёт в базу, если оставить его пустым.">
      <AutoField label="Описание в каталоге" auto={auto.card_description} value={value.card_description} onChange={input('card_description')} />
      <AutoField label="Заголовок профиля" auto={auto.tagline} value={value.tagline} onChange={input('tagline')} />
      <AutoField label="Короткое интро" auto={auto.intro} value={value.intro} onChange={input('intro')} multiline rows={3} />
      <ParagraphEditor label="Текст «Об инструкторе»" value={value.about} auto={auto.intro} onChange={(next) => field('about', next)} />
    </FieldGroup>

    <FieldGroup collapsible feeds="InstructorCertifications" title="Теги и сертификаты" description="Помогают подбору инструктора и блоку сертификатов на странице." badge={(value.tags?.length ?? 0) + (value.certifications?.length ?? 0) || null}>
      <ListEditor label="Теги" value={value.tags} placeholder="Новички" hint="Например: новички, дети, карвинг, фрирайд." onChange={(next) => field('tags', next)} />
      <FormField label="Подпись о сертификации" hint={isBlank(value.certificate_label) ? 'Пусто — плашку на карточке не показываем.' : undefined}><Input value={value.certificate_label ?? ''} placeholder="Verified Instructor" onChange={input('certificate_label')} /></FormField>
      <Repeater
        className="cms-instructor-editor__certificate"
        value={value.certifications}
        onChange={(next) => field('certifications', next)}
        addLabel="+ Добавить сертификат"
        blank={{ title: '', level: '', file_url: '' }}
        renderRow={({ item, index, update, remove }) => <>
          <FormField label="Название" required><Input value={item.title ?? ''} placeholder="ISIA Alpine — Level 2" onChange={(event) => update({ title: event.target.value })} /></FormField>
          <FormField label="Уровень / год"><Input value={item.level ?? ''} placeholder="2019" onChange={(event) => update({ level: event.target.value })} /></FormField>
          <FormField label="Ссылка на файл"><Input value={item.file_url ?? item.fileUrl ?? ''} placeholder="/assets/certificates/file.jpg" onChange={(event) => update({ file_url: event.target.value })} /></FormField>
          <Button iconOnly variant="ghost" aria-label={`Удалить сертификат ${item.title || index + 1}`} onClick={remove}>×</Button>
        </>}
      />
    </FieldGroup>

    <FieldGroup collapsible feeds="ObjectMediaGallery" title="Фото страницы и галерея" description="Если не заполнять, обложка и аватар возьмутся из главного фото, а без него — из заглушки." badge={value.media?.length || null}>
      <div className="cms-editor__two-columns">
        <MediaUploadField label="Обложка страницы" shape="landscape" placeholderKind="instructor" placeholderLabel={value.display_name} hint="Пусто — возьмём главное фото." value={value.hero_image_url} onChange={(next) => field('hero_image_url', next)} onUpload={onUploadMedia} onRemove={onDeleteMedia} />
        <MediaUploadField label="Аватар в бронировании" shape="square" placeholderKind="instructor" placeholderLabel={value.display_name} hint="Пусто — возьмём главное фото." value={value.booking_avatar_url} onChange={(next) => field('booking_avatar_url', next)} onUpload={onUploadMedia} onRemove={onDeleteMedia} />
      </div>
      <AutoField label="Описание обложки (alt)" auto={auto.hero_image_alt} value={value.hero_image_alt} onChange={input('hero_image_alt')} />
      <GalleryEditor value={value.media} previewLabel={value.display_name} placeholderKind="instructor" onChange={(next) => field('media', next)} onUploadMedia={onUploadMedia} onDeleteMedia={onDeleteMedia} />
    </FieldGroup>

    <FieldGroup collapsible feeds="BookingConfigurator" title="Бронирование" description="Личное у инструктора — только размер группы, которую он берёт. Тариф, часы и скидки едины для всей категории.">
      <div className="cms-editor__two-columns">
        <FormField label="Мин. гостей"><Input type="number" min="1" value={value.min_people ?? ''} placeholder={`${INSTRUCTOR_DEFAULTS.min_people}`} onChange={input('min_people')} /></FormField>
        <FormField label="Макс. гостей" error={visibleErrors.max_people}><Input type="number" min="1" value={value.max_people ?? ''} placeholder={`${INSTRUCTOR_DEFAULTS.max_people}`} onChange={input('max_people')} /></FormField>
      </div>
      <InheritedSettings
        title="Из настроек категории «Инструкторы»"
        note="Одинаково у всех инструкторов. Изменение здесь затронет всю категорию."
        items={categorySummary}
        actionLabel="Открыть настройки категории"
        onAction={onOpenCategorySettings}
      />
    </FieldGroup>

    <FieldGroup collapsible title="Служебные поля" description="Адрес страницы, роль и порядок в каталоге. Обычно их менять не нужно.">
      <AutoField label="Адрес страницы" auto={auto.slug} value={value.slug} error={visibleErrors.slug} onChange={input('slug')} hint="Латиница, цифры и дефисы. Имя на кириллице переводится автоматически." />
      <div className="cms-editor__two-columns">
        <FormField label="Роль"><Input value={value.role ?? ''} placeholder={INSTRUCTOR_DEFAULTS.role} onChange={input('role')} /></FormField>
        <FormField label="Пол" hint="Используется в подборе инструктора."><Select value={value.gender ?? ''} onChange={input('gender')}><option value="">Не указан</option><option value="male">Мужской</option><option value="female">Женский</option></Select></FormField>
        <AutoField label="Статус доступности" auto={auto.availability_label} value={value.availability_label} onChange={input('availability_label')} />
        <FormField label="Порядок в каталоге" hint={isBlank(value.sort_order) ? 'Пусто — поставим в конец списка.' : undefined}><Input type="number" value={value.sort_order ?? ''} placeholder="авто" onChange={input('sort_order')} /></FormField>
      </div>
    </FieldGroup>
  </CmsEditorShell>;
}
