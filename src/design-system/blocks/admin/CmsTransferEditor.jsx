import { useMemo, useState } from 'react';
import { FormField, Input, Select } from '../../../components';
import { AUTOFILLED_FIELDS, TRANSFER_DEFAULTS, listAutofilledFields, resolveTransfer, validateTransfer } from '../../../shared/transferDefaults';
import { AutoField, CmsEditorShell, FactsEditor, FieldGroup, GalleryEditor, ListEditor, isBlank } from './CmsEditorParts';
import { MediaUploadField } from './MediaUploadField';

const AUTOFILLED_TOTAL = AUTOFILLED_FIELDS.length;

/** Every route runs Gudauri ↔ city, so the city is the catalog grouping. */
const cityOptions = [
  { value: '', label: 'Не выбран' },
  { value: 'tbilisi', label: 'Тбилиси' },
  { value: 'kutaisi', label: 'Кутаиси' },
  { value: 'batumi', label: 'Батуми' },
  { value: 'kazbegi', label: 'Казбеги' },
  { value: 'vladikavkaz', label: 'Владикавказ' },
  { value: 'other', label: 'Другое' },
];

const pickupOptions = [
  { value: '', label: 'Не указан' },
  { value: 'airport', label: 'Из аэропорта' },
  { value: 'city', label: 'Из города' },
  { value: 'door', label: 'От двери' },
];

/**
 * Transfer create and edit screen.
 *
 * Built on the shared editor shell, with groups mapped to the object page. The
 * only transfer-specific input is the vehicle group — the rest are the shared
 * blocks every collection uses.
 */
export function CmsTransferEditor({
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

  const auto = useMemo(() => resolveTransfer(value), [value]);
  const autofilled = useMemo(() => listAutofilledFields(value), [value]);
  const visibleErrors = submitted ? validateTransfer(value, { publishing: submitted === 'publish' || isPublished }) : {};

  const submit = (action) => {
    setSubmitted(action);
    if (Object.keys(validateTransfer(value, { publishing: action === 'publish' || isPublished })).length) return;
    if (action === 'publish') onPublish(); else onSave();
  };

  return <CmsEditorShell
    collection="transfers"
    counts={counts}
    onNavigate={onNavigate}
    onSignOut={onSignOut}
    onBack={onBack}
    backLabel="Трансферы"
    objectLabel="Трансфер"
    title={value.name}
    fallbackTitle="Новый трансфер"
    publicPath={`/transfers/${auto.slug || '…'}`}
    note={autofilled.length
      ? `Обязательное поле одно — название. ${autofilled.length} из ${AUTOFILLED_TOTAL} остальных полей заполним автоматически — дописать их можно позже.`
      : 'Все поля заполнены вручную — автоподстановка не понадобится.'}
    meter={{ filled: AUTOFILLED_TOTAL - autofilled.length, total: AUTOFILLED_TOTAL }}
    previewImage={value.card_image_url}
    placeholderKind="transfer"
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
      description="Что видно в каталоге до перехода на страницу. Обязательно только название машины или класса."
    >
      <MediaUploadField
        label="Главное фото"
        hint="Перетащите фото или выберите файл. Пусто — в каталоге покажем фирменную заглушку."
        placeholderKind="transfer"
        placeholderLabel={value.name}
        value={value.card_image_url}
        onChange={(next) => field('card_image_url', next)}
        onUpload={onUploadMedia}
        onRemove={onDeleteMedia}
      />
      <FormField label="Название" required error={visibleErrors.name} hint="Например «Седан · до 3 мест»."><Input value={value.name ?? ''} placeholder="Sedan · up to 3 seats" onChange={input('name')} /></FormField>
      <div className="cms-editor__two-columns">
        <FormField label="Город" required error={visibleErrors.catalog_group} hint="Определяет, в какое направление попадёт маршрут в панели.">
          <Select value={value.catalog_group ?? ''} onChange={input('catalog_group')}>{cityOptions.map((option) => <option value={option.value} key={option.value || 'none'}>{option.label}</option>)}</Select>
        </FormField>
        <AutoField label="Маршрут" auto={auto.category} value={value.category} onChange={input('category')} hint="Подпись на карточке." />
      </div>
      <ListEditor label="Теги" value={value.tags} placeholder="~2 hours" hint="Короткие метки: время в пути, детские кресла, багажник для лыж." onChange={(next) => field('tags', next)} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectHero"
      title="Шапка страницы"
      description="Обложка и вводный текст в верхней части страницы трансфера."
    >
      <MediaUploadField label="Обложка" shape="landscape" placeholderKind="transfer" placeholderLabel={value.name} hint="Пусто — возьмём главное фото." value={value.hero_image_url} onChange={(next) => field('hero_image_url', next)} onUpload={onUploadMedia} onRemove={onDeleteMedia} />
      <AutoField label="Описание обложки (alt)" auto={auto.hero_image_alt} value={value.hero_image_alt} onChange={input('hero_image_alt')} />
      <AutoField label="Описание" auto={auto.description} value={value.description} onChange={input('description')} multiline rows={4} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectMainTags"
      title="Главные факты"
      description="Значения в строке под шапкой: класс, места, время в пути."
      collapsible
      badge={value.facts?.length || null}
    >
      <FactsEditor value={value.facts} onChange={(next) => field('facts', next)} hint="Пусто — блок на странице не показываем." />
    </FieldGroup>

    <FieldGroup
      collapsible
      title="Машина"
      description="Сущность автомобиля переиспользуется на разных маршрутах: характеристики, галерея и отзывы остаются общими."
      badge={[value.vehicle_class, value.seats, value.large_bags, value.ski_capacity].filter(Boolean).length || null}
    >
      <div className="cms-editor__grid">
        <FormField label="Класс"><Input value={value.vehicle_class ?? ''} placeholder="Comfort" onChange={input('vehicle_class')} /></FormField>
        <FormField label="Мест"><Input type="number" min="1" value={value.seats ?? ''} placeholder="3" onChange={input('seats')} /></FormField>
        <FormField label="Больших чемоданов"><Input type="number" min="0" value={value.large_bags ?? ''} placeholder="3" onChange={input('large_bags')} /></FormField>
        <FormField label="Ручной клади"><Input type="number" min="0" value={value.carry_on_bags ?? ''} placeholder="2" onChange={input('carry_on_bags')} /></FormField>
        <FormField label="Комплектов лыж / досок"><Input type="number" min="0" value={value.ski_capacity ?? ''} placeholder="2" onChange={input('ski_capacity')} /></FormField>
      </div>
      <ListEditor label="Опции машины" value={value.vehicle_options} placeholder="Winter tyres" hint="Одинаковы во всех предложениях с этой машиной." onChange={(next) => field('vehicle_options', next)} />
    </FieldGroup>

    <FieldGroup
      collapsible
      title="Маршрут"
      description="Двунаправленный путь переиспользуется с разными машинами; точные адреса гость укажет в заявке."
      badge={[value.duration_label, value.distance_km, value.pickup_type].filter(Boolean).length || null}
    >
      <div className="cms-editor__grid">
        <FormField label="Время в пути"><Input value={value.duration_label ?? ''} placeholder="~2 hours" onChange={input('duration_label')} /></FormField>
        <FormField label="Расстояние, км"><Input type="number" min="1" step="0.1" value={value.distance_km ?? ''} placeholder="120" onChange={input('distance_km')} /></FormField>
        <FormField label="Зона подачи"><Select value={value.pickup_type ?? ''} onChange={input('pickup_type')}>{pickupOptions.map((option) => <option value={option.value} key={option.value || 'none'}>{option.label}</option>)}</Select></FormField>
        <FormField label="Примечание о дороге"><Input value={value.road_notice ?? ''} placeholder="Время зависит от погоды и трафика" onChange={input('road_notice')} /></FormField>
      </div>
    </FieldGroup>

    <FieldGroup
      feeds="TransferConditions"
      title="Условия поездки"
      description="Ожидание, остановки, отмена и особые запросы именно для этого предложения."
      collapsible
      badge={value.conditions?.length || null}
    >
      <FactsEditor value={value.conditions} onChange={(next) => field('conditions', next)} hint="Каждая строка — название условия и его значение." />
    </FieldGroup>

    <FieldGroup
      feeds="IncludedServices"
      title="Что входит"
      description="Список того, что уже включено в цену поездки."
      collapsible
      badge={value.included?.length || null}
    >
      <ListEditor label="Входит в цену" value={value.included} placeholder="Meet & greet" onChange={(next) => field('included', next)} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectMediaGallery"
      title="Галерея"
      description="Фото и видео в галерее страницы."
      collapsible
      badge={value.media?.length || null}
    >
      <GalleryEditor value={value.media} previewLabel={value.name} placeholderKind="transfer" altPlaceholder="Машина на трассе" onChange={(next) => field('media', next)} onUploadMedia={onUploadMedia} onDeleteMedia={onDeleteMedia} />
    </FieldGroup>

    <FieldGroup
      feeds="BookingConfigurator"
      title="Цена"
      description="Цена за машину, а не за пассажира. Для публикации нужна цена больше нуля."
    >
      <div className="cms-editor__grid">
        <FormField label="Цена" required error={visibleErrors.price_amount}><Input type="number" min="0" step="0.01" value={value.price_amount ?? ''} placeholder="0" onChange={input('price_amount')} /></FormField>
        <FormField label="Валюта"><Input value={value.currency ?? ''} placeholder={TRANSFER_DEFAULTS.currency} onChange={input('currency')} /></FormField>
        <AutoField label="Единица" auto={auto.price_suffix} value={value.price_suffix} onChange={input('price_suffix')} />
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
