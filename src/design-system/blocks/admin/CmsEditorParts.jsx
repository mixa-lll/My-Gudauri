import { useEffect, useId, useRef, useState } from 'react';
import { Badge, Button, Checkbox, FormField, FormSummary, Input, MediaPlaceholder, Select, Textarea } from '../../../components';
import { PRICING_FIELD_LABELS, PRICING_MODES, resolvePricingRules } from '../../../shared/pricing';
import { cn } from '../../../utils/cn';
import { MediaUploadField } from './MediaUploadField';
import './CmsEditorParts.scss';

/**
 * The parts every CMS editor shares: navigation rail, sticky action header,
 * object summary with an autofill meter, settings-style field groups and the
 * repeatable list controls.
 *
 * A collection-specific editor supplies only its own fields — see
 * CmsInstructorEditor and CmsActivityEditor.
 */

export const CMS_STATUS_LABELS = { draft: 'Черновик', published: 'Опубликован', archived: 'В архиве' };
const STATUS_TONES = { published: 'success', archived: 'neutral', draft: 'warning' };

export const isBlank = (value) => !String(value ?? '').trim();

/**
 * Input groups mirror the object page one-to-one.
 *
 * `shared` blocks appear on every object page, so their input group is written
 * once here and reused by every collection. `unique` blocks belong to a single
 * category, so their input group lives in that collection's editor — the same
 * split Storybook uses for the page blocks themselves.
 */
export const CMS_PAGE_BLOCKS = {
  ListingCard: { label: 'Карточка в каталоге', scope: 'shared' },
  ObjectHero: { label: 'ObjectHero — шапка страницы', scope: 'shared' },
  ObjectMainTags: { label: 'ObjectMainTags — три главных факта', scope: 'shared' },
  ObjectDescription: { label: 'ObjectDescription — описание и теги', scope: 'shared' },
  ObjectMediaGallery: { label: 'ObjectMediaGallery — галерея', scope: 'shared' },
  BookingConfigurator: { label: 'BookingConfigurator — форма заявки', scope: 'shared' },
  InstructorCertifications: { label: 'InstructorCertifications — сертификаты', scope: 'unique' },
  ActivitySchedule: { label: 'ActivitySchedule — расписание', scope: 'unique' },
  IncludedServices: { label: 'IncludedServices — что входит', scope: 'unique' },
  EquipmentList: { label: 'EquipmentList — что взять с собой', scope: 'unique' },
};

/** Left-hand navigation, identical in the list and in every editor. */
export function CmsAdminRail({ active = 'instructors', counts = {}, onNavigate, onSignOut }) {
  const item = (id, label) => <button
    key={id}
    type="button"
    className={active === id ? 'is-active' : ''}
    onClick={() => onNavigate?.(id)}
  ><span>{label}</span>{counts[id] === undefined ? null : <small>{counts[id]}</small>}</button>;

  return <aside className="cms-editor__rail">
    <div className="cms-editor__brand"><span>My</span> Gudauri</div>
    <p className="cms-editor__eyebrow">Управление</p>
    <span className="cms-editor__nav-parent">Контент</span>
    <div className="cms-editor__nav-children">
      {item('instructors', 'Инструкторы')}
      {item('activities', 'Активности')}
      {item('transfers', 'Трансферы')}
      <span>Прокат</span><span>Туры</span><span>Места</span>
    </div>
    <nav className="cms-editor__secondary-nav" aria-label="Разделы админки"><span>Заявки</span><span>Отзывы</span><span>Настройки</span></nav>
    <div className="cms-editor__operator"><span aria-hidden="true">А</span><div><strong>Оператор</strong><small>admin</small></div><Button variant="ghost" onClick={onSignOut}>Выйти</Button></div>
  </aside>;
}

/**
 * One settings section: explanation on the left, fields on the right.
 *
 * `feeds` names the page block this group fills, so an operator can see which
 * part of the public page they are editing.
 */
export function FieldGroup({ title, description, children, collapsible = false, badge, feeds }) {
  const [open, setOpen] = useState(!collapsible);
  const contentId = useId();
  const block = feeds ? CMS_PAGE_BLOCKS[feeds] : null;
  return <section className={cn('cms-editor__group', collapsible && 'is-collapsible', open && 'is-open')}>
    <div className="cms-editor__group-intro">
      {collapsible
        ? <button type="button" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((current) => !current)}>
          <h2>{title}</h2>
          <span className="cms-editor__group-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
        : <h2>{title}</h2>}
      {description ? <p>{description}</p> : null}
      {block ? <span className={cn('cms-editor__group-block', `is-${block.scope}`)}>{block.label}</span> : null}
      {badge ? <span className="cms-editor__group-badge">{badge}</span> : null}
    </div>
    <div className="cms-editor__group-fields" id={contentId} hidden={!open}>{children}</div>
  </section>;
}

/**
 * An optional field that previews the exact value the API will store when it is
 * left blank, so “skip it” is a visible, safe choice rather than a guess.
 */
export function AutoField({ label, hint, auto, value, onChange, error, multiline = false, rows, ...rest }) {
  const blank = isBlank(value);
  const control = multiline
    ? <Textarea rows={rows} value={value ?? ''} placeholder={auto} onChange={onChange} {...rest} />
    : <Input value={value ?? ''} placeholder={auto} onChange={onChange} {...rest} />;
  return <FormField
    className={cn('cms-editor__auto-field', blank && 'is-auto')}
    label={<>{label}{blank ? <span className="cms-editor__auto-chip">авто</span> : null}</>}
    error={error}
    hint={blank ? (auto ? `Оставите пустым — сохраним «${auto}»` : 'Заполним автоматически, как только появится название.') : hint}
  >{control}</FormField>;
}

export function ChoiceGroup({ label, options, value = [], onChange, required = false, error, hint }) {
  const toggle = (option) => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  return <fieldset className={cn('cms-editor__choice-group', error && 'is-invalid')}>
    <legend>{label}{required ? <span aria-hidden="true"> *</span> : null}</legend>
    <div>{options.map((option) => <Checkbox label={option.label} checked={value.includes(option.value)} onChange={() => toggle(option.value)} key={option.value} />)}</div>
    {error ? <p className="cms-editor__field-error">{error}</p> : hint ? <p className="cms-editor__field-hint">{hint}</p> : null}
  </fieldset>;
}

export function ListEditor({ label, value = [], onChange, placeholder, hint }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const next = draft.trim();
    if (!next || value.includes(next)) return;
    onChange([...value, next]);
    setDraft('');
  };
  return <div className="cms-editor__list-editor">
    <span>{label}</span>
    {hint ? <p className="cms-editor__field-hint">{hint}</p> : null}
    <div className="cms-editor__chips">{value.map((item) => <Badge size="sm" key={item}>{item}<button type="button" aria-label={`Удалить ${item}`} onClick={() => onChange(value.filter((valueItem) => valueItem !== item))}>×</button></Badge>)}</div>
    <div className="cms-editor__inline-add"><Input value={draft} placeholder={placeholder} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); add(); } }} /><Button variant="secondary" size="md" onClick={add}>Добавить</Button></div>
  </div>;
}

/**
 * Paragraphs are stored as an array, but the operator types one plain text.
 * The draft is kept locally so an empty line can be typed before the second
 * paragraph exists.
 */
export function ParagraphEditor({ label, value = [], onChange, auto, hint }) {
  const [draft, setDraft] = useState(() => (value ?? []).join('\n\n'));
  const emitted = useRef(draft);
  useEffect(() => {
    const next = (value ?? []).join('\n\n');
    if (next === emitted.current) return;
    emitted.current = next;
    setDraft(next);
  }, [value]);
  const handleChange = (event) => {
    const next = event.target.value;
    setDraft(next);
    const paragraphs = next.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
    emitted.current = paragraphs.join('\n\n');
    onChange(paragraphs);
  };
  const blank = !draft.trim();
  return <FormField
    className={cn('cms-editor__auto-field', blank && 'is-auto')}
    label={<>{label}{blank ? <span className="cms-editor__auto-chip">авто</span> : null}</>}
    hint={blank ? `Оставите пустым — сохраним «${auto}»` : (hint ?? 'Разделяйте абзацы пустой строкой — каждый станет отдельным блоком.')}
  ><Textarea className="cms-editor__paragraphs" value={draft} placeholder={auto} onChange={handleChange} /></FormField>;
}

/**
 * A read-only block for settings this object inherits from its category.
 *
 * Showing them beats hiding them: an operator still needs to know the price
 * they are selling at, but must not be able to fork it from inside one card.
 * The action is the honest way out — go and change it for everyone.
 */
export function InheritedSettings({ title, note, items = [], actionLabel, onAction }) {
  if (!items.length) return null;
  return <section className="cms-editor__inherited">
    <div className="cms-editor__inherited-head">
      <strong>{title}</strong>
      {note ? <p>{note}</p> : null}
    </div>
    <dl>{items.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    {onAction ? <Button variant="secondary" size="md" onClick={onAction}>{actionLabel} →</Button> : null}
  </section>;
}

const priceFormatter = new Intl.NumberFormat('ru-RU');

/**
 * Category pricing as label/value rows for `InheritedSettings`. Reads the
 * resolved settings the API returns, so the card echoes exactly what the site
 * charges rather than a second interpretation of the same ladders.
 */
export function describeCategoryPricing(pricing) {
  if (!pricing?.policyKey) return [];
  const unit = PRICING_FIELD_LABELS[pricing.unitField];
  const currency = pricing.currency ?? 'GEL';
  const rows = [
    { label: 'Тариф', value: `${priceFormatter.format(Math.round(pricing.baseRate))} ${currency} за ${unit?.per ?? 'единицу'}` },
    { label: 'Диапазон', value: `${pricing.minUnits}–${pricing.maxUnits} ${unit?.unit ?? ''}, шаг ${pricing.unitsStep}`.replace('  ', ' ') },
  ];
  for (const dimension of resolvePricingRules(pricing.policyKey, pricing.rules).dimensions) {
    const steps = dimension.tiers.filter((tier) => tier.percent > 0);
    if (!steps.length) continue;
    const labels = PRICING_FIELD_LABELS[dimension.field];
    const surcharge = dimension.mode === PRICING_MODES.SURCHARGE;
    rows.push({
      label: surcharge ? 'Надбавка за гостя' : 'Скидка за объём',
      value: steps.map((tier) => `${surcharge ? '+' : '−'}${tier.percent}% с ${tier.from} ${labels?.unit ?? ''}`.trim()).join(' · '),
    });
  }
  rows.push({ label: 'Округление итога', value: `до ${pricing.rules?.roundTo ?? 1} ${currency}` });
  return rows;
}

/** Generic repeater: rows of the same shape plus a dashed add action. */
export function Repeater({ value = [], onChange, addLabel, blank, renderRow, className }) {
  const update = (index, patch) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const remove = (index) => onChange(value.filter((_, itemIndex) => itemIndex !== index));
  return <div className="cms-editor__repeaters">
    {value.map((item, index) => <div className={cn('cms-editor__repeater-row', className)} key={`row-${index}`}>
      {renderRow({ item, index, update: (patch) => update(index, patch), remove: () => remove(index) })}
    </div>)}
    <Button className="cms-editor__dashed-action" variant="secondary" onClick={() => onChange([...value, { ...blank }])}>{addLabel}</Button>
  </div>;
}

/** Shared input for ObjectMediaGallery — every collection stores media alike. */
export function GalleryEditor({ value = [], onChange, onUploadMedia, onDeleteMedia, previewLabel, placeholderKind = 'generic', altPlaceholder = 'Что на фото' }) {
  return <Repeater
    className="cms-editor__gallery-row"
    value={value}
    onChange={onChange}
    addLabel="+ Добавить медиа"
    blank={{ type: 'image', url: '', alt: '', featured: false }}
    renderRow={({ item, index, update, remove }) => <>
      <MediaUploadField
        label={`Файл ${index + 1}`}
        shape="square"
        placeholderKind={placeholderKind}
        placeholderLabel={previewLabel}
        value={item.url}
        onChange={(next) => update({ url: next })}
        onUpload={onUploadMedia}
        onRemove={onDeleteMedia}
        hint="Перетащите фото сюда или выберите файл. Для видео вставьте ссылку."
      />
      <div className="cms-editor__gallery-meta">
        <FormField label="Тип"><Select value={item.type ?? 'image'} onChange={(event) => update({ type: event.target.value })}><option value="image">Фото</option><option value="video">Видео</option></Select></FormField>
        <FormField label="Описание"><Input value={item.alt ?? ''} placeholder={altPlaceholder} onChange={(event) => update({ alt: event.target.value })} /></FormField>
        <Button iconOnly variant="ghost" aria-label={`Удалить медиа ${index + 1}`} onClick={remove}>×</Button>
      </div>
    </>}
  />;
}

/** Shared input for ObjectMainTags — label/value pairs shown as the three facts. */
export function FactsEditor({ value = [], onChange, hint }) {
  return <div className="cms-editor__list-editor">
    <span>Главные факты</span>
    {hint ? <p className="cms-editor__field-hint">{hint}</p> : null}
    <Repeater
      className="cms-editor__facts-row"
      value={value}
      onChange={onChange}
      addLabel="+ Добавить факт"
      blank={{ label: '', value: '' }}
      renderRow={({ item, index, update, remove }) => <>
        <FormField label="Название"><Input value={item.label ?? ''} placeholder="Duration" onChange={(event) => update({ label: event.target.value })} /></FormField>
        <FormField label="Значение"><Input value={item.value ?? ''} placeholder="3 hours" onChange={(event) => update({ value: event.target.value })} /></FormField>
        <Button iconOnly variant="ghost" aria-label={`Удалить факт ${item.label || index + 1}`} onClick={remove}>×</Button>
      </>}
    />
  </div>;
}

/**
 * The editor frame. `onSubmit` receives 'save' or 'publish'; validation and
 * persistence stay with the collection-specific editor above it.
 */
export function CmsEditorShell({
  collection,
  counts,
  onNavigate,
  onSignOut,
  onBack,
  backLabel,
  objectLabel,
  title,
  fallbackTitle,
  publicPath,
  note,
  meter,
  previewImage,
  placeholderKind = 'generic',
  status = 'draft',
  dirty = false,
  busy = false,
  errors = [],
  onSubmit,
  onDelete,
  canDelete = false,
  children,
}) {
  const isPublished = status === 'published';
  const submit = (event) => {
    event.preventDefault();
    onSubmit(event.nativeEvent.submitter?.value === 'publish' ? 'publish' : 'save');
  };

  return <section className="cms-editor" aria-label={title ? `Редактор: ${title}` : fallbackTitle}>
    <CmsAdminRail active={collection} counts={counts} onNavigate={onNavigate} onSignOut={onSignOut} />
    <form className="cms-editor__main" onSubmit={submit} noValidate>
      <header className="cms-editor__header">
        <button className="cms-editor__breadcrumb" type="button" onClick={onBack}>{backLabel}</button><span aria-hidden="true">/</span><strong>{title || fallbackTitle}</strong>
        <Badge tone={STATUS_TONES[status] ?? 'neutral'} size="sm">{CMS_STATUS_LABELS[status] ?? status}</Badge>
        {dirty ? <span className="cms-editor__dirty">Есть несохранённые правки</span> : null}
        <div className="cms-editor__header-actions">
          <Button variant="secondary" type="submit" value="save" loading={busy} loadingLabel="Сохранение">Сохранить</Button>
          <Button variant="accent" type="submit" value="publish" loading={busy} loadingLabel="Публикация">{isPublished ? 'Обновить публикацию' : 'Опубликовать'}</Button>
        </div>
      </header>

      <div className="cms-editor__content">
        <section className="cms-editor__summary">
          <div className="cms-editor__summary-media">
            {isBlank(previewImage)
              ? <MediaPlaceholder compact kind={placeholderKind} label={title || fallbackTitle} />
              : <img src={previewImage} alt="" />}
          </div>
          <div className="cms-editor__summary-body">
            <span className="cms-editor__summary-kicker">{objectLabel}</span>
            <h1>{title || fallbackTitle}</h1>
            <p className="cms-editor__summary-url">{publicPath}</p>
            <p className="cms-editor__summary-note">{note}</p>
            <div className="cms-editor__meter" role="img" aria-label={`Заполнено вручную ${meter.filled} из ${meter.total} необязательных полей`}>
              <span style={{ width: `${(meter.filled / meter.total) * 100}%` }} />
            </div>
          </div>
        </section>

        {errors.length ? <FormSummary title="Проверьте форму" errors={errors} /> : null}

        {children}

        <div className="cms-editor__footer-actions">
          <Button variant="secondary" type="submit" value="save" loading={busy}>{isPublished ? 'Сохранить изменения' : 'Сохранить черновик'}</Button>
          <Button variant="accent" type="submit" value="publish" loading={busy}>{isPublished ? 'Обновить публикацию' : 'Опубликовать'}</Button>
          {canDelete ? <Button className="cms-editor__delete" variant="destructive" onClick={onDelete} disabled={busy}>Удалить</Button> : null}
        </div>
      </div>
    </form>
  </section>;
}
