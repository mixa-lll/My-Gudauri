import { useMemo, useState } from 'react';
import { Button, FormField, Input } from '../../../components';
import { PRICING_FIELD_LABELS, resolveCollectionPricing, validateCollectionPricing } from '../../../shared/pricing';
import { CmsAdminRail, FieldGroup } from './CmsEditorParts';
import { CmsPricingEditor, pricingPreviewRange } from './CmsPricingEditor';
import './CmsCategorySettings.scss';

/**
 * What a whole category costs, in one place.
 *
 * A tariff, a bookable range and a discount ladder are properties of the
 * category — every instructor works on the same official rate. Editing them per
 * object meant a price change was one forgotten draft away from an inconsistent
 * catalog, so they live here and the object card only shows what it inherits.
 *
 * Collection-agnostic: the pricing policy names the parameters and their mode,
 * so the same screen serves any category that gains volume pricing later.
 */

const COLLECTION_TITLES = {
  instructors: { title: 'Инструкторы', unit: 'Часы урока', rateLabel: 'Тариф, GEL за час' },
  activities: { title: 'Активности', unit: 'Участники', rateLabel: 'Цена, GEL за человека' },
  stays: { title: 'Проживание', unit: 'Ночи', rateLabel: 'Цена, GEL за ночь' },
  rental: { title: 'Прокат', unit: 'Дни', rateLabel: 'Цена, GEL за день' },
};

export function CmsCategorySettings({
  collection = 'instructors',
  value = {},
  onChange,
  onSave,
  onBack,
  onNavigate,
  onSignOut,
  counts,
  objectCount = 0,
  busy = false,
  dirty = false,
}) {
  const [submitted, setSubmitted] = useState(false);
  const copy = COLLECTION_TITLES[collection] ?? { title: collection, unit: 'Единицы', rateLabel: 'Тариф' };
  const field = (name, next) => onChange({ ...value, [name]: next });
  const input = (name) => (event) => field(name, event.target.value);

  const resolved = useMemo(() => resolveCollectionPricing(collection, value), [collection, value]);
  const errors = submitted ? validateCollectionPricing(collection, value) : {};
  const unitLabels = PRICING_FIELD_LABELS[resolved.unitField] ?? { per: 'единицу', unit: 'ед.' };

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateCollectionPricing(collection, value)).length) return;
    onSave();
  };

  return <section className="cms-category-settings" aria-label={`Настройки категории: ${copy.title}`}>
    <CmsAdminRail active={collection} counts={counts} onNavigate={onNavigate} onSignOut={onSignOut} />

    <form className="cms-category-settings__main" onSubmit={submit} noValidate>
      <header className="cms-category-settings__header">
        <button className="cms-category-settings__breadcrumb" type="button" onClick={onBack}>{copy.title}</button>
        <span aria-hidden="true">/</span><strong>Настройки категории</strong>
        {dirty ? <span className="cms-category-settings__dirty">Есть несохранённые правки</span> : null}
        <div className="cms-category-settings__header-actions">
          <Button variant="accent" type="submit" loading={busy} loadingLabel="Сохранение">Сохранить</Button>
        </div>
      </header>

      <div className="cms-category-settings__content">
        <section className="cms-category-settings__summary">
          <span className="cms-category-settings__kicker">Категория</span>
          <h1>{copy.title}</h1>
          <p>
            Эти настройки применяются ко всем объектам категории — сейчас их {objectCount}.
            Изменение тарифа здесь меняет цену везде: в каталоге, на странице объекта и в заявках.
          </p>
        </section>

        <FieldGroup feeds="BookingConfigurator" title="Тариф и диапазон" description="Базовая ставка, из которой считается любая заявка, и границы, в которых гость может выбирать.">
          <div className="cms-editor__grid">
            <FormField label={copy.rateLabel} required error={errors.baseRate}>
              <Input type="number" min="0" value={value.baseRate ?? ''} placeholder={`${resolved.baseRate}`} onChange={input('baseRate')} />
            </FormField>
            <FormField label="Валюта">
              <Input value={value.currency ?? ''} placeholder={resolved.currency} onChange={input('currency')} />
            </FormField>
            <FormField label={`Минимум, ${unitLabels.unit}`}>
              <Input type="number" min="1" value={value.minUnits ?? ''} placeholder={`${resolved.minUnits}`} onChange={input('minUnits')} />
            </FormField>
            <FormField label={`Максимум, ${unitLabels.unit}`} error={errors.maxUnits}>
              <Input type="number" min="1" value={value.maxUnits ?? ''} placeholder={`${resolved.maxUnits}`} onChange={input('maxUnits')} />
            </FormField>
            <FormField label="Шаг" error={errors.unitsStep} hint="На столько меняется значение одним нажатием в форме заявки.">
              <Input type="number" min="1" value={value.unitsStep ?? ''} placeholder={`${resolved.unitsStep}`} onChange={input('unitsStep')} />
            </FormField>
            <FormField label="Значение по умолчанию" hint="С чего открывается форма заявки.">
              <Input type="number" min="1" value={value.defaultUnits ?? ''} placeholder={`${resolved.defaultUnits}`} onChange={input('defaultUnits')} />
            </FormField>
            {resolved.groupField ? <FormField label="Гостей по умолчанию" hint="Ограничивается мин/макс, заданными в карточке объекта.">
              <Input type="number" min="1" value={value.defaultGroup ?? ''} placeholder={`${resolved.defaultGroup}`} onChange={input('defaultGroup')} />
            </FormField> : null}
          </div>
        </FieldGroup>

        <FieldGroup feeds="BookingConfigurator" title="Шкалы цены" description="Насколько дешевеет единица с ростом заказа. Таблицы пересчитываются на лету — это те суммы, которые увидит гость.">
          <CmsPricingEditor
            policyKey={resolved.policyKey}
            basePrice={resolved.baseRate}
            currency={resolved.currency}
            roundTo={value.roundTo}
            value={value.tiers ?? {}}
            onChange={(next) => field('tiers', next)}
            onRoundToChange={(next) => field('roundTo', next)}
            previewRanges={{
              [resolved.unitField]: pricingPreviewRange(resolved.minUnits, resolved.maxUnits, resolved.unitsStep),
              [resolved.groupField]: pricingPreviewRange(1, 6, 1),
            }}
            errors={errors}
          />
        </FieldGroup>

        <div className="cms-category-settings__footer-actions">
          <Button variant="accent" type="submit" loading={busy}>Сохранить настройки</Button>
          <Button variant="secondary" type="button" onClick={onBack} disabled={busy}>Назад к списку</Button>
        </div>
      </div>
    </form>
  </section>;
}
