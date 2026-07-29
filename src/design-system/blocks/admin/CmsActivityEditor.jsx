import { useMemo, useState } from 'react';
import { Button, FormField, Input, Select } from '../../../components';
import { ACTIVITY_DEFAULTS, AUTOFILLED_FIELDS, listAutofilledFields, resolveActivity, validateActivity } from '../../../shared/activityDefaults';
import { AutoField, CmsEditorShell, FactsEditor, FieldGroup, GalleryEditor, ListEditor, Repeater, isBlank } from './CmsEditorParts';
import { MediaUploadField } from './MediaUploadField';
import './CmsActivityEditor.scss';

const AUTOFILLED_TOTAL = AUTOFILLED_FIELDS.length;

/**
 * Activity create and edit screen.
 *
 * Groups follow the object page block by block, and every group that fills a
 * shared block uses the shared input from CmsEditorParts. Only the schedule,
 * included services and equipment groups are activity-specific — exactly the
 * blocks that are unique to this category on the public page.
 */
export function CmsActivityEditor({
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
  counts,
  busy = false,
  dirty = false,
}) {
  const [submitted, setSubmitted] = useState(null);
  const field = (name, next) => onChange({ ...value, [name]: next });
  const input = (name) => (event) => field(name, event.target.value);
  const status = value.status ?? 'draft';
  const isPublished = status === 'published';

  const auto = useMemo(() => resolveActivity(value), [value]);
  const autofilled = useMemo(() => listAutofilledFields(value), [value]);
  const visibleErrors = submitted ? validateActivity(value, { publishing: submitted === 'publish' || isPublished }) : {};

  const submit = (action) => {
    setSubmitted(action);
    if (Object.keys(validateActivity(value, { publishing: action === 'publish' || isPublished })).length) return;
    if (action === 'publish') onPublish(); else onSave();
  };

  return <CmsEditorShell
    collection="activities"
    counts={counts}
    onNavigate={onNavigate}
    onSignOut={onSignOut}
    onBack={onBack}
    backLabel="Активности"
    objectLabel="Активность"
    title={value.name}
    fallbackTitle="Новая активность"
    publicPath={`/activities/${auto.slug || '…'}`}
    note={autofilled.length
      ? `Обязательное поле одно — название. ${autofilled.length} из ${AUTOFILLED_TOTAL} остальных полей заполним автоматически — дописать их можно позже.`
      : 'Все поля заполнены вручную — автоподстановка не понадобится.'}
    meter={{ filled: AUTOFILLED_TOTAL - autofilled.length, total: AUTOFILLED_TOTAL }}
    previewImage={value.card_image_url}
    placeholderKind="activity"
    status={status}
    dirty={dirty}
    busy={busy}
    errors={Object.entries(visibleErrors).map(([name, message]) => ({ id: name, message }))}
    onSubmit={submit}
    onDelete={onDelete}
    canDelete={Boolean(value.id)}
  >
    <FieldGroup
      feeds="ListingCard"
      title="Карточка"
      description="Что видно в каталоге до перехода на страницу. Обязательно только название."
    >
      <MediaUploadField
        label="Главное фото"
        hint="Перетащите фото или выберите файл. Пусто — в каталоге покажем фирменную заглушку."
        placeholderKind="activity"
        placeholderLabel={value.name}
        value={value.card_image_url}
        onChange={(next) => field('card_image_url', next)}
        onUpload={onUploadMedia}
        onRemove={onDeleteMedia}
      />
      <FormField label="Название" required error={visibleErrors.name} hint="Так активность называется на сайте и в заявках."><Input value={value.name ?? ''} placeholder="Snowmobile tour" onChange={input('name')} /></FormField>
      <AutoField label="Категория" auto={auto.category} value={value.category} onChange={input('category')} />
      <ListEditor label="Теги" value={value.tags} placeholder="Transfer" hint="Короткие метки на карточке и в описании." onChange={(next) => field('tags', next)} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectHero"
      title="Шапка страницы"
      description="Обложка и вводный текст в верхней части страницы активности."
    >
      <MediaUploadField label="Обложка" shape="landscape" placeholderKind="activity" placeholderLabel={value.name} hint="Пусто — возьмём главное фото." value={value.hero_image_url} onChange={(next) => field('hero_image_url', next)} onUpload={onUploadMedia} onRemove={onDeleteMedia} />
      <AutoField label="Описание обложки (alt)" auto={auto.hero_image_alt} value={value.hero_image_alt} onChange={input('hero_image_alt')} />
      <AutoField label="Описание" auto={auto.description} value={value.description} onChange={input('description')} multiline rows={4} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectMainTags"
      title="Главные факты"
      description="Три значения в строке под шапкой: длительность, сложность, высота и подобное."
      collapsible
      badge={value.facts?.length || null}
    >
      <FactsEditor value={value.facts} onChange={(next) => field('facts', next)} hint="Пусто — блок на странице не показываем." />
    </FieldGroup>

    <FieldGroup
      feeds="ActivitySchedule"
      title="Расписание"
      description="Программа по времени. Уникальный блок активностей — у инструкторов его нет."
      collapsible
      badge={value.schedule?.length || null}
    >
      <Repeater
        className="cms-activity-editor__schedule-row"
        value={value.schedule}
        onChange={(next) => field('schedule', next)}
        addLabel="+ Добавить пункт"
        blank={{ time: '', title: '', description: '' }}
        renderRow={({ item, index, update, remove }) => <>
          <FormField label="Время"><Input value={item.time ?? ''} placeholder="10:00" onChange={(event) => update({ time: event.target.value })} /></FormField>
          <FormField label="Заголовок"><Input value={item.title ?? ''} placeholder="Meeting point" onChange={(event) => update({ title: event.target.value })} /></FormField>
          <FormField label="Описание"><Input value={item.description ?? ''} placeholder="Необязательно" onChange={(event) => update({ description: event.target.value })} /></FormField>
          <Button iconOnly variant="ghost" aria-label={`Удалить пункт ${item.title || index + 1}`} onClick={remove}>×</Button>
        </>}
      />
    </FieldGroup>

    <FieldGroup
      feeds="IncludedServices"
      title="Что входит"
      description="Два списка на странице: включено и не включено в цену."
      collapsible
      badge={(value.included?.length ?? 0) + (value.excluded?.length ?? 0) || null}
    >
      <ListEditor label="Входит в цену" value={value.included} placeholder="Local guide" onChange={(next) => field('included', next)} />
      <ListEditor label="Не входит" value={value.excluded} placeholder="Personal insurance" onChange={(next) => field('excluded', next)} />
    </FieldGroup>

    <FieldGroup
      feeds="EquipmentList"
      title="Что взять с собой"
      description="Список снаряжения и одежды для гостя."
      collapsible
      badge={value.equipment?.length || null}
    >
      <ListEditor label="Взять с собой" value={value.equipment} placeholder="Warm waterproof layers" onChange={(next) => field('equipment', next)} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectMediaGallery"
      title="Галерея"
      description="Фото и видео в галерее страницы."
      collapsible
      badge={value.media?.length || null}
    >
      <GalleryEditor value={value.media} previewLabel={value.name} placeholderKind="activity" altPlaceholder="Вид с маршрута" onChange={(next) => field('media', next)} onUploadMedia={onUploadMedia} onDeleteMedia={onDeleteMedia} />
    </FieldGroup>

    <FieldGroup
      feeds="BookingConfigurator"
      title="Цена"
      description="Цена показывается на карточке и в форме заявки. Для публикации нужна цена больше нуля."
    >
      <div className="cms-editor__grid">
        <FormField label="Цена" required error={visibleErrors.price_amount}><Input type="number" min="0" step="0.01" value={value.price_amount ?? ''} placeholder="0" onChange={input('price_amount')} /></FormField>
        <FormField label="Валюта"><Input value={value.currency ?? ''} placeholder={ACTIVITY_DEFAULTS.currency} onChange={input('currency')} /></FormField>
        <AutoField label="Единица" auto={auto.price_suffix} value={value.price_suffix} onChange={input('price_suffix')} />
      </div>
    </FieldGroup>

    <FieldGroup collapsible title="Фильтры каталога" description="Определяют, в какую группу и под какие фильтры попадёт активность.">
      <div className="cms-editor__grid">
        <AutoField label="Группа каталога" auto={auto.catalog_group} value={value.catalog_group} onChange={input('catalog_group')} />
        <FormField label="Уровень"><Input value={value.skill_level ?? ''} placeholder="beginner" onChange={input('skill_level')} /></FormField>
        <FormField label="Длительность"><Input value={value.duration_group ?? ''} placeholder="half-day" onChange={input('duration_group')} /></FormField>
        <FormField label="Формат"><Input value={value.format ?? ''} placeholder="group" onChange={input('format')} /></FormField>
      </div>
    </FieldGroup>

    <FieldGroup collapsible title="Служебные поля" description="Адрес страницы и порядок в каталоге. Обычно их менять не нужно.">
      <AutoField label="Адрес страницы" auto={auto.slug} value={value.slug} error={visibleErrors.slug} onChange={input('slug')} hint="Латиница, цифры и дефисы. Название на кириллице переводится автоматически." />
      <div className="cms-editor__two-columns">
        <FormField label="Статус"><Select value={status} onChange={input('status')}><option value="draft">Черновик</option><option value="published">Опубликован</option><option value="archived">В архиве</option></Select></FormField>
        <FormField label="Порядок в каталоге" hint={isBlank(value.sort_order) ? 'Пусто — поставим в конец списка.' : undefined}><Input type="number" value={value.sort_order ?? ''} placeholder="авто" onChange={input('sort_order')} /></FormField>
      </div>
    </FieldGroup>
  </CmsEditorShell>;
}
