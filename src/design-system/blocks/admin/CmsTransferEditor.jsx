import { useMemo, useState } from 'react';
import { Button, Checkbox, FormField, Input, Select } from '../../../components';
import {
  AUTOFILLED_FIELDS,
  VEHICLE_BODY_TYPES,
  deriveOfferCard,
  listAutofilledFields,
  normalizeOffers,
  resolveVehicle,
  validateVehicle,
} from '../../../shared/transferDefaults';
import { AutoField, CmsEditorShell, FieldGroup, GalleryEditor, ListEditor, Repeater, isBlank } from './CmsEditorParts';
import { MediaUploadField } from './MediaUploadField';
import './CmsTransferEditor.scss';

const AUTOFILLED_TOTAL = AUTOFILLED_FIELDS.length;

/**
 * Transfer create and edit screen — the unit is a vehicle.
 *
 * The operator describes the car once: photos, seats, luggage, options and the
 * included-services list. Routes come from category settings; attaching one
 * with a price materialises a catalog card in that direction. The repeater row
 * previews the exact card each attachment produces.
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
  onOpenCategorySettings,
  routes = [],
  counts,
  busy = false,
  dirty = false,
}) {
  const [submitted, setSubmitted] = useState(null);
  const field = (name, next) => onChange({ ...value, [name]: next });
  const input = (name) => (event) => field(name, event.target.value);
  const status = value.status ?? 'draft';
  const isPublished = status === 'published';

  const auto = useMemo(() => resolveVehicle(value), [value]);
  const autofilled = useMemo(() => listAutofilledFields(value), [value]);
  const offers = value.offers ?? [];
  const activeOffers = useMemo(() => normalizeOffers(offers).filter((offer) => offer.published), [offers]);
  const routesById = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes]);
  const visibleErrors = submitted ? validateVehicle(value, { publishing: submitted === 'publish' || isPublished }) : {};

  const submit = (action) => {
    setSubmitted(action);
    if (Object.keys(validateVehicle(value, { publishing: action === 'publish' || isPublished })).length) return;
    if (action === 'publish') onPublish(); else onSave();
  };

  /** Routes not yet attached, plus the row's own choice so it stays selectable. */
  const routeOptions = (current) => routes.filter((route) => route.id === current || !offers.some((offer) => Number(offer.route_id) === route.id));

  return <CmsEditorShell
    collection="transfers"
    counts={counts}
    onNavigate={onNavigate}
    onSignOut={onSignOut}
    onBack={onBack}
    backLabel="Трансферы"
    objectLabel="Машина"
    title={value.name}
    fallbackTitle="Новая машина"
    publicPath={activeOffers.length
      ? `Карточек в каталоге: ${activeOffers.length} — по одной на маршрут`
      : 'Карточки появятся после добавления маршрутов с ценой'}
    note={autofilled.length
      ? `Обязательное поле одно — название машины. ${autofilled.length} из ${AUTOFILLED_TOTAL} остальных полей заполним автоматически — дописать их можно позже.`
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
      title="Машина"
      description="Характеристики вводятся один раз и попадают во все карточки этой машины. Обязательно только название."
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
      <FormField label="Название" required error={visibleErrors.name} hint="Марка и модель — так машина называется на карточке."><Input value={value.name ?? ''} placeholder="Toyota Camry" onChange={input('name')} /></FormField>
      <div className="cms-editor__two-columns">
        <FormField label="Тип кузова" error={visibleErrors.body_type} hint="По нему работает фильтр каталога и заглушка фото.">
          <Select value={value.body_type ?? ''} onChange={input('body_type')}>
            <option value="">Не выбран</option>
            {VEHICLE_BODY_TYPES.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </Select>
        </FormField>
        <AutoField label="Класс" auto={auto.class_name} value={value.class_name} onChange={input('class_name')} hint="Свободная подпись: Comfort, Business…" />
      </div>
      <div className="cms-editor__grid">
        <FormField label="Мест" hint={isBlank(value.seats) ? `Пусто — поставим ${auto.seats}.` : undefined}><Input type="number" min="1" value={value.seats ?? ''} placeholder={`${auto.seats}`} onChange={input('seats')} /></FormField>
        <FormField label="Больших чемоданов" hint={isBlank(value.large_bags) ? 'Пусто — по числу мест.' : undefined}><Input type="number" min="0" value={value.large_bags ?? ''} placeholder={`${auto.large_bags}`} onChange={input('large_bags')} /></FormField>
        <FormField label="Ручной клади"><Input type="number" min="0" value={value.carry_on_bags ?? ''} placeholder={`${auto.carry_on_bags}`} onChange={input('carry_on_bags')} /></FormField>
        <FormField label="Комплектов лыж" hint={isBlank(value.ski_capacity) ? 'Пусто — по числу мест.' : undefined}><Input type="number" min="0" value={value.ski_capacity ?? ''} placeholder={`${auto.ski_capacity}`} onChange={input('ski_capacity')} /></FormField>
      </div>
      <ListEditor label="Опции машины" value={value.vehicle_options} placeholder="Winter tyres" hint="Зимняя резина, климат, детское кресло — одинаковы на всех маршрутах." onChange={(next) => field('vehicle_options', next)} />
      <Checkbox label="Гость получает именно эту машину, а не «или аналог»" checked={Boolean(value.exact_vehicle)} onChange={(event) => field('exact_vehicle', event.target.checked)} />
    </FieldGroup>

    <FieldGroup
      feeds="TransferRoutes"
      title="Маршруты и цены"
      description="Каждый маршрут с ценой становится отдельной карточкой в своём направлении каталога. Сами направления — время в пути, заметки о дороге — настраиваются в «Настройках категории»."
    >
      {visibleErrors.offers ? <p className="cms-editor__field-error">{visibleErrors.offers}</p> : null}
      <Repeater
        className="cms-transfer-editor__offer"
        value={offers}
        onChange={(next) => field('offers', next)}
        addLabel="+ Добавить маршрут"
        blank={{ route_id: '', price_amount: '', published: true }}
        renderRow={({ item, index, update, remove }) => {
          const route = routesById.get(Number(item.route_id));
          const card = route ? deriveOfferCard(value, route, { price_amount: Number(item.price_amount) || 0, currency: 'GEL' }) : null;
          return <>
            <div className="cms-transfer-editor__offer-fields">
              <FormField label="Маршрут">
                <Select value={item.route_id ?? ''} onChange={(event) => update({ route_id: event.target.value ? Number(event.target.value) : '' })}>
                  <option value="">Выберите направление</option>
                  {routeOptions(Number(item.route_id)).map((option) => <option value={option.id} key={option.id}>Гудаури ↔ {option.origin_name}{option.duration_label ? ` · ${option.duration_label}` : ''}</option>)}
                </Select>
              </FormField>
              <FormField label="Цена, GEL за машину"><Input type="number" min="0" step="1" value={item.price_amount ?? ''} placeholder="0" onChange={(event) => update({ price_amount: event.target.value })} /></FormField>
              <Checkbox label="Показывать" checked={item.published !== false} onChange={(event) => update({ published: event.target.checked })} />
              <Button iconOnly variant="ghost" aria-label={`Убрать маршрут ${index + 1}`} onClick={remove}>×</Button>
            </div>
            <p className="cms-transfer-editor__offer-preview">
              {card
                ? <>Карточка: <strong>{card.name}</strong> → направление «{route.origin_name}»{Number(item.price_amount) > 0 ? ` · ${Math.round(Number(item.price_amount))} GEL` : ' · цена не указана'}</>
                : 'Выберите направление — покажем, какая карточка появится в каталоге.'}
            </p>
          </>;
        }}
      />
      {onOpenCategorySettings ? <Button variant="secondary" size="md" onClick={onOpenCategorySettings}>⚙ Направления и заметки о дороге</Button> : null}
    </FieldGroup>

    <FieldGroup feeds="ObjectDescription" title="Тексты для сайта" description="Описание машины показывается на каждой её карточке. Пусто — соберём из типа кузова и вместимости.">
      <AutoField label="Описание" auto={auto.description} value={value.description} onChange={input('description')} multiline rows={4} />
    </FieldGroup>

    <FieldGroup
      feeds="IncludedServices"
      title="Что входит"
      description="Список включённого в цену — одинаковый на всех маршрутах этой машины."
      collapsible
      badge={value.included?.length || null}
    >
      <ListEditor label="Входит в цену" value={value.included} placeholder="Meet & greet" onChange={(next) => field('included', next)} />
    </FieldGroup>

    <FieldGroup
      feeds="ObjectMediaGallery"
      title="Фото страницы и галерея"
      description="Обложка и галерея общие для всех карточек машины. Пусто — возьмём главное фото."
      collapsible
      badge={value.media?.length || null}
    >
      <MediaUploadField label="Обложка страницы" shape="landscape" placeholderKind="transfer" placeholderLabel={value.name} hint="Пусто — возьмём главное фото." value={value.hero_image_url} onChange={(next) => field('hero_image_url', next)} onUpload={onUploadMedia} onRemove={onDeleteMedia} />
      <AutoField label="Описание обложки (alt)" auto={auto.hero_image_alt} value={value.hero_image_alt} onChange={input('hero_image_alt')} />
      <GalleryEditor value={value.media} previewLabel={value.name} placeholderKind="transfer" altPlaceholder="Машина на трассе" onChange={(next) => field('media', next)} onUploadMedia={onUploadMedia} onDeleteMedia={onDeleteMedia} />
    </FieldGroup>

    <FieldGroup collapsible title="Служебные поля" description="Адрес машины и порядок в каталоге. Обычно их менять не нужно.">
      <AutoField label="Адрес машины" auto={auto.slug} value={value.slug} error={visibleErrors.slug} onChange={input('slug')} hint="Входит в адреса карточек. Кириллица переводится автоматически." />
      <div className="cms-editor__two-columns">
        <FormField label="Статус"><Select value={status} onChange={input('status')}><option value="draft">Черновик</option><option value="published">Опубликована</option><option value="archived">В архиве</option></Select></FormField>
        <FormField label="Порядок в каталоге" hint={isBlank(value.sort_order) ? 'Пусто — поставим в конец списка.' : undefined}><Input type="number" value={value.sort_order ?? ''} placeholder="авто" onChange={input('sort_order')} /></FormField>
      </div>
    </FieldGroup>
  </CmsEditorShell>;
}
