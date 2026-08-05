import { useMemo } from 'react';
import { Button, FormField, Input } from '../../../components';
import {
  MAX_DISCOUNT_PERCENT,
  MAX_SURCHARGE_PERCENT,
  PRICING_FIELD_LABELS,
  PRICING_MODES,
  calculatePrice,
  resolvePricingRules,
  validatePricingRules,
} from '../../../shared/pricing';
import './CmsPricingEditor.scss';

/**
 * The ladder editor every priced collection shares.
 *
 * It knows nothing about instructors: the pricing policy supplies the
 * dimensions, the collection supplies the base rate and the range to preview.
 * Adding volume pricing to activities or stays means passing a different
 * `policyKey` — no new editor.
 *
 * The preview is the point of the screen. A percentage ladder is hard to reason
 * about in the abstract, so every row is priced out live: what the guest pays,
 * and what one hour or one guest works out to at that step.
 */

const numberFormatter = new Intl.NumberFormat('ru-RU');
const pluralRules = new Intl.PluralRules('ru-RU');

const money = (amount) => numberFormatter.format(Math.round(amount));

function unitLabel(field, units) {
  const labels = PRICING_FIELD_LABELS[field];
  if (!labels) return `${units}`;
  const form = pluralRules.select(units);
  return `${units} ${labels[form === 'one' ? 'one' : form === 'few' ? 'few' : 'many']}`;
}

const MODE_COPY = {
  [PRICING_MODES.MULTIPLY]: {
    title: 'Скидка за объём',
    percentLabel: 'Скидка, %',
    hint: 'Скидка действует только на единицы начиная с порога — как в прогрессивной шкале. Так каждый следующий час дешевле предыдущего, но общая сумма никогда не падает.',
    sign: '−',
  },
  [PRICING_MODES.SURCHARGE]: {
    title: 'Надбавка за каждого следующего',
    percentLabel: 'Надбавка, %',
    hint: 'Первый гость уже включён в тариф. Каждый следующий добавляет процент от тарифа — уменьшайте процент на верхних порогах, чтобы большая группа выходила дешевле в расчёте на человека.',
    sign: '+',
  },
};

const DIMENSION_TITLES = {
  duration: 'Часы',
  participants: 'Гости',
  days: 'Дни',
  nights: 'Ночи',
  guests: 'Гости',
};

function TierRows({ dimension, rows, error, onChange }) {
  const copy = MODE_COPY[dimension.mode];
  const maxPercent = dimension.mode === PRICING_MODES.SURCHARGE ? MAX_SURCHARGE_PERCENT : MAX_DISCOUNT_PERCENT;
  const firstUnit = dimension.mode === PRICING_MODES.SURCHARGE ? 2 : 1;
  const update = (index, patch) => onChange(rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row));
  const remove = (index) => onChange(rows.filter((_, rowIndex) => rowIndex !== index));
  const add = () => onChange([...rows, { from: (rows.at(-1)?.from ?? firstUnit) + 1, percent: rows.at(-1)?.percent ?? 0 }]);

  return <div className="cms-pricing__dimension">
    <div className="cms-pricing__dimension-head">
      <h3>{DIMENSION_TITLES[dimension.field] ?? dimension.field} · {copy.title}</h3>
      <p>{copy.hint}</p>
    </div>
    {error ? <p className="cms-pricing__error" role="alert">{error}</p> : null}
    <div className="cms-pricing__rows">
      {rows.map((row, index) => <div className="cms-pricing__row" key={`tier-${index}`}>
        <FormField label={`От, ${PRICING_FIELD_LABELS[dimension.field]?.unit ?? 'ед.'}`}>
          <Input type="number" min={firstUnit} value={row.from ?? ''} onChange={(event) => update(index, { from: event.target.value })} />
        </FormField>
        <FormField label={copy.percentLabel}>
          <Input type="number" min="0" max={maxPercent} value={row.percent ?? ''} onChange={(event) => update(index, { percent: event.target.value })} />
        </FormField>
        <Button
          className="cms-pricing__remove"
          iconOnly
          variant="ghost"
          aria-label={`Удалить порог от ${row.from ?? index + 1}`}
          disabled={rows.length <= 1}
          onClick={() => remove(index)}
        >×</Button>
      </div>)}
      <Button className="cms-editor__dashed-action" variant="secondary" onClick={add}>+ Добавить порог</Button>
    </div>
  </div>;
}

/** The percentage the ladder applies to the last unit added at this step. */
function marginalPercent(tiers, units) {
  let percent = 0;
  for (const tier of tiers) {
    if (tier.from > units) break;
    percent = tier.percent;
  }
  return percent;
}

function PreviewTable({ dimension, basePrice, currency, policyKey, rules, held, range }) {
  const rows = useMemo(() => range.map((units) => ({
    units,
    quote: calculatePrice({ basePrice, policyKey, rules, quantities: { ...held, [dimension.field]: units } }),
  })), [basePrice, dimension.field, held, policyKey, range, rules]);
  const labels = PRICING_FIELD_LABELS[dimension.field];
  const title = DIMENSION_TITLES[dimension.field] ?? dimension.field;
  const isSurcharge = dimension.mode === PRICING_MODES.SURCHARGE;

  return <table className="cms-pricing__preview">
    <caption>{title} · остальные параметры зафиксированы</caption>
    <thead><tr>
      <th scope="col">{title}</th>
      <th scope="col">Сумма</th>
      <th scope="col">За {labels?.per ?? 'ед.'}</th>
      <th scope="col">{isSurcharge ? 'Надбавка' : 'Выгода'}</th>
    </tr></thead>
    <tbody>{rows.map(({ units, quote }) => {
      const step = isSurcharge && units > 1 ? marginalPercent(dimension.tiers, units) : null;
      return <tr key={units}>
        <th scope="row">{unitLabel(dimension.field, units)}</th>
        <td>{money(quote.total)} {currency}</td>
        <td>{money(units > 0 ? quote.total / units : quote.total)} {currency}</td>
        <td>{isSurcharge
          ? (step === null ? 'в тарифе' : `+${money(step)} %`)
          : (quote.discountAmount >= 1 ? <span className="cms-pricing__saving">−{money(quote.discountAmount)} {currency}</span> : '—')}</td>
      </tr>;
    })}</tbody>
  </table>;
}

/**
 * The unit counts a preview table walks through: the object's own range, capped
 * so the table stays readable, always including the maximum an operator sells.
 */
export function pricingPreviewRange(min, max, step, limit = 6) {
  const safeStep = Math.max(1, Math.round(Number(step) || 1));
  const start = Math.max(1, Math.round(Number(min) || 1));
  const end = Math.max(start, Math.round(Number(max) || start));
  const values = [];
  for (let value = start; value <= end && values.length < limit; value += safeStep) values.push(value);
  if (values.at(-1) !== end && values.length) values[values.length - 1] = end;
  return values;
}

export function CmsPricingEditor({
  policyKey,
  basePrice,
  currency = 'GEL',
  roundTo,
  value = {},
  onChange,
  onRoundToChange,
  previewRanges = {},
  previewHeld = {},
  errors = {},
}) {
  // Ladders the operator has not configured are shown as the platform defaults
  // they already price on — an empty table would misrepresent what is charged.
  const resolved = useMemo(() => resolvePricingRules(policyKey, { roundTo, tiers: value }), [policyKey, roundTo, value]);
  const rules = useMemo(() => ({ roundTo, tiers: Object.fromEntries(resolved.dimensions.map((item) => [item.field, item.tiers])) }), [resolved, roundTo]);
  const liveErrors = useMemo(() => validatePricingRules(policyKey, { tiers: value }), [policyKey, value]);

  if (!resolved.dimensions.length) {
    return <p className="cms-pricing__empty">У этой категории фиксированная цена — шкалы объёма для неё не применяются.</p>;
  }

  // Every other parameter is pinned to one unit, so each table isolates the
  // effect of its own ladder instead of mixing two at once.
  const held = Object.fromEntries(resolved.dimensions.map((item) => [item.field, previewHeld[item.field] ?? 1]));

  return <div className="cms-pricing">
    {resolved.dimensions.map((dimension) => <TierRows
      key={dimension.field}
      dimension={dimension}
      rows={value[dimension.field]?.length ? value[dimension.field] : dimension.tiers}
      error={errors[`price_tiers.${dimension.field}`] ?? liveErrors[dimension.field]}
      onChange={(rows) => onChange({ ...value, [dimension.field]: rows })}
    />)}

    <FormField
      className="cms-pricing__rounding"
      label={`Округление итога, ${currency}`}
      hint="Итог округляется до кратного этому числу — чтобы шкала не выдавала суммы вроде «2 597,85»."
    ><Input type="number" min="1" value={roundTo ?? ''} placeholder={`${resolved.roundTo}`} onChange={(event) => onRoundToChange?.(event.target.value)} /></FormField>

    <div className="cms-pricing__previews">
      {resolved.dimensions.map((dimension) => <PreviewTable
        key={dimension.field}
        dimension={dimension}
        basePrice={basePrice}
        currency={currency}
        policyKey={policyKey}
        rules={rules}
        held={held}
        range={previewRanges[dimension.field] ?? pricingPreviewRange(1, 8, 1)}
      />)}
    </div>
  </div>;
}
