/**
 * Single source of truth for how a booking total is calculated.
 *
 * The rule everywhere on the site is “the more you take, the cheaper the unit”.
 * Two shapes of parameter produce that:
 *
 *   multiply  — units the base rate is charged for (hours, days, nights).
 *               Each tier gives a DISCOUNT on the units at or beyond `from`.
 *   surcharge — units that ride along with the first one (extra students,
 *               extra guests). The first unit is included in the base rate;
 *               each further unit ADDS a percentage of it.
 *
 * Both ladders are marginal, like a progressive tax: a tier applies only to the
 * units inside it, never retroactively to the ones below. That is what keeps the
 * total monotonic — 4 hours can never come out cheaper than 3 — while the
 * average unit price still falls with every step. A “apply the tier percentage
 * to the whole basket” model cannot promise that, which is why it is not used.
 *
 * A pricing policy (owned by the booking flow) decides WHICH fields participate
 * and in which mode. The CMS owns only the ladders, per object. Adding a
 * category therefore means adding a policy entry here — the engine, the editor
 * and the price breakdown need no changes.
 */

export const PRICING_MODES = Object.freeze({ MULTIPLY: 'multiply', SURCHARGE: 'surcharge' });

/** A discount can never take more than this; a surcharge can never add more. */
export const MAX_DISCOUNT_PERCENT = 90;
export const MAX_SURCHARGE_PERCENT = 300;

/** Surcharge ladders start at the second unit — the first one is the base rate. */
const FIRST_UNIT = { [PRICING_MODES.MULTIPLY]: 1, [PRICING_MODES.SURCHARGE]: 2 };

const dimension = (field, mode, tiers = []) => Object.freeze({ field, mode, tiers: Object.freeze(tiers) });

/**
 * Ladders shipped with the platform. They are defaults, not floors: an object
 * that stores its own ladder for a dimension replaces this one entirely.
 *
 * Only the instructor policies ship a populated ladder for now. Every other
 * category declares its dimensions with an empty ladder, which prices exactly
 * like a flat rate until an operator fills the tiers in.
 */
const INSTRUCTOR_HOUR_TIERS = [{ from: 1, percent: 0 }, { from: 4, percent: 8 }, { from: 8, percent: 15 }];
const INSTRUCTOR_STUDENT_TIERS = [{ from: 2, percent: 35 }, { from: 3, percent: 25 }, { from: 5, percent: 15 }];

export const PRICING_POLICIES = Object.freeze({
  'instructor-hourly-v1': Object.freeze({
    roundTo: 5,
    dimensions: Object.freeze([
      dimension('duration', PRICING_MODES.MULTIPLY, INSTRUCTOR_HOUR_TIERS),
      dimension('participants', PRICING_MODES.SURCHARGE, INSTRUCTOR_STUDENT_TIERS),
    ]),
  }),
  // The operator-match flow sells the same lesson, so it prices on the same
  // ladders — only the hours arrive from the selected slots instead of a field.
  'operator-match-v1': Object.freeze({
    roundTo: 5,
    dimensions: Object.freeze([
      dimension('duration', PRICING_MODES.MULTIPLY, INSTRUCTOR_HOUR_TIERS),
      dimension('participants', PRICING_MODES.SURCHARGE, INSTRUCTOR_STUDENT_TIERS),
    ]),
  }),
  'activity-per-person-v1': Object.freeze({ roundTo: 1, dimensions: Object.freeze([dimension('participants', PRICING_MODES.MULTIPLY)]) }),
  'rental-daily-v1': Object.freeze({ roundTo: 1, dimensions: Object.freeze([dimension('days', PRICING_MODES.MULTIPLY)]) }),
  'stay-nightly-v1': Object.freeze({
    roundTo: 1,
    dimensions: Object.freeze([dimension('nights', PRICING_MODES.MULTIPLY), dimension('guests', PRICING_MODES.SURCHARGE)]),
  }),
  'transfer-fixed-v1': Object.freeze({ roundTo: 1, dimensions: Object.freeze([]) }),
  'request-only-v1': Object.freeze({ roundTo: 1, dimensions: Object.freeze([]) }),
});

const EMPTY_POLICY = Object.freeze({ roundTo: 1, dimensions: Object.freeze([]) });

/**
 * The policy a collection prices on. The CMS and the API need this without
 * importing the booking flow registry, which is client-side feature code.
 */
export const COLLECTION_PRICING_POLICIES = Object.freeze({
  instructors: 'instructor-hourly-v1',
  activities: 'activity-per-person-v1',
  transfers: 'transfer-fixed-v1',
  rental: 'rental-daily-v1',
  stays: 'stay-nightly-v1',
});

export function getPricingPolicy(policyKey) {
  return PRICING_POLICIES[policyKey] ?? EMPTY_POLICY;
}

/**
 * Collections whose rate, bookable range and ladders belong to the category
 * rather than to each object. An instructor does not set their own tariff —
 * every coach works on one official rate, so a price change is one edit.
 *
 * Collections outside this list price per object (a transfer costs what that
 * vehicle costs) and keep their amount in the card.
 */
export const CATEGORY_PRICED_COLLECTIONS = Object.freeze(['instructors']);

/** Category settings applied when a collection has no stored row yet. */
export const COLLECTION_PRICING_DEFAULTS = Object.freeze({
  instructors: Object.freeze({ currency: 'GEL', baseRate: 345, minUnits: 2, maxUnits: 12, unitsStep: 2, defaultUnits: 8, defaultGroup: 2, roundTo: 5 }),
});

const FALLBACK_COLLECTION_PRICING = Object.freeze({ currency: 'GEL', baseRate: 0, minUnits: 1, maxUnits: 1, unitsStep: 1, defaultUnits: 1, defaultGroup: 1, roundTo: 1 });

/**
 * Dimension labels for the CMS, which is Russian-only — the public site
 * translates its own through the booking flow definitions.
 * `one/few/many` are the Russian plural forms; `per` is the “за …” form.
 */
export const PRICING_FIELD_LABELS = Object.freeze({
  duration: { one: 'час', few: 'часа', many: 'часов', per: 'час', unit: 'ч' },
  participants: { one: 'гость', few: 'гостя', many: 'гостей', per: 'гостя', unit: 'чел.' },
  days: { one: 'день', few: 'дня', many: 'дней', per: 'день', unit: 'дн.' },
  nights: { one: 'ночь', few: 'ночи', many: 'ночей', per: 'ночь', unit: 'ноч.' },
  guests: { one: 'гость', few: 'гостя', many: 'гостей', per: 'гостя', unit: 'чел.' },
});

const finite = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Turn whatever the CMS or the database hands over into a sorted, deduplicated,
 * in-range ladder. Never throws: a broken row is dropped, not fatal, because a
 * price must still be quotable.
 */
export function normalizeTiers(tiers, mode = PRICING_MODES.MULTIPLY) {
  const maxPercent = mode === PRICING_MODES.SURCHARGE ? MAX_SURCHARGE_PERCENT : MAX_DISCOUNT_PERCENT;
  const firstUnit = FIRST_UNIT[mode] ?? 1;
  const byFrom = new Map();
  for (const tier of Array.isArray(tiers) ? tiers : []) {
    const from = finite(tier?.from ?? tier?.from_units);
    const percent = finite(tier?.percent);
    if (from === null || percent === null) continue;
    // A later row for the same threshold wins, so an operator editing a row
    // into a duplicate sees their newest value rather than a stale one.
    byFrom.set(Math.max(firstUnit, Math.round(from)), clamp(percent, 0, maxPercent));
  }
  return [...byFrom.entries()].sort(([a], [b]) => a - b).map(([from, percent]) => ({ from, percent }));
}

/** The percentage that applies to a single unit at position `index`. */
function percentAt(tiers, index) {
  let percent = 0;
  for (const tier of tiers) {
    if (tier.from > index) break;
    percent = tier.percent;
  }
  return percent;
}

function unitsFor(mode, value) {
  const units = finite(value);
  if (units === null || units < 0) return mode === PRICING_MODES.SURCHARGE ? 1 : 0;
  return Math.round(units);
}

/**
 * How much of the base rate a dimension is worth.
 * multiply → the discounted unit count; surcharge → a factor at or above 1.
 */
function dimensionFactor(mode, units, tiers) {
  if (mode === PRICING_MODES.SURCHARGE) {
    let factor = 1;
    for (let index = 2; index <= units; index += 1) factor += percentAt(tiers, index) / 100;
    return factor;
  }
  let factor = 0;
  for (let index = 1; index <= units; index += 1) factor += 1 - percentAt(tiers, index) / 100;
  return factor;
}

function roundTotal(amount, step) {
  const grid = Math.max(1, Math.round(finite(step) ?? 1));
  return Math.round(amount / grid) * grid;
}

/**
 * Merge a policy with the ladders stored for one object.
 *
 * `rules` is `{ roundTo, tiers: { [field]: [{ from, percent }] } }` — the shape
 * the CMS edits, the API returns and the booking draft carries. A dimension
 * with no stored ladder keeps the platform default, so an object saved before
 * pricing existed still quotes the same price as a freshly created one.
 */
export function resolvePricingRules(policyKey, rules) {
  const policy = getPricingPolicy(policyKey);
  const stored = rules?.tiers ?? {};
  return {
    roundTo: Math.max(1, Math.round(finite(rules?.roundTo) ?? policy.roundTo)),
    dimensions: policy.dimensions.map((item) => {
      const override = Array.isArray(stored[item.field]) && stored[item.field].length ? stored[item.field] : item.tiers;
      return { ...item, tiers: normalizeTiers(override, item.mode) };
    }),
  };
}

/**
 * Everything a category decides about price, with defaults filled in.
 *
 * `unitField` / `groupField` name the booking fields the policy prices on, so
 * the settings screen can label “Часы” or “Ночи” without knowing the category.
 * The returned `rules` is exactly what `calculatePrice` expects.
 */
export function resolveCollectionPricing(collection, stored) {
  const policyKey = COLLECTION_PRICING_POLICIES[collection] ?? null;
  const defaults = COLLECTION_PRICING_DEFAULTS[collection] ?? FALLBACK_COLLECTION_PRICING;
  const pick = (value, fallback, min = 1) => Math.max(min, Math.round(finite(value) ?? fallback));
  const dimensions = getPricingPolicy(policyKey).dimensions;

  const minUnits = pick(stored?.minUnits, defaults.minUnits);
  const roundTo = pick(stored?.roundTo, defaults.roundTo);
  const maxUnits = Math.max(minUnits, pick(stored?.maxUnits, defaults.maxUnits));
  // Resolved once and shared: `tiers` is what the settings screen edits and
  // `rules` is what the engine quotes on. Two shapes of the same numbers would
  // be two chances for the preview and the price to disagree.
  const tiers = Object.fromEntries(resolvePricingRules(policyKey, { roundTo, tiers: stored?.tiers ?? {} })
    .dimensions.map((item) => [item.field, item.tiers]));

  return {
    collection,
    policyKey,
    currency: (typeof stored?.currency === 'string' && stored.currency.trim() ? stored.currency : defaults.currency).toUpperCase(),
    baseRate: Math.max(0, finite(stored?.baseRate) ?? defaults.baseRate),
    minUnits,
    maxUnits,
    unitsStep: pick(stored?.unitsStep, defaults.unitsStep),
    // Defaults must sit inside the range the operator actually sells, or the
    // booking card opens on a value its own stepper refuses to keep.
    defaultUnits: Math.min(maxUnits, Math.max(minUnits, pick(stored?.defaultUnits, defaults.defaultUnits))),
    defaultGroup: pick(stored?.defaultGroup, defaults.defaultGroup),
    roundTo,
    unitField: dimensions.find((item) => item.mode === PRICING_MODES.MULTIPLY)?.field ?? null,
    groupField: dimensions.find((item) => item.mode === PRICING_MODES.SURCHARGE)?.field ?? null,
    tiers,
    rules: { roundTo, tiers },
  };
}

export function validateCollectionPricing(collection, stored) {
  const errors = {};
  const policyKey = COLLECTION_PRICING_POLICIES[collection] ?? null;
  if (!(finite(stored?.baseRate) > 0)) errors.baseRate = 'Укажите тариф больше нуля — по нему считается вся категория.';
  const min = finite(stored?.minUnits);
  const max = finite(stored?.maxUnits);
  if (min !== null && max !== null && min > max) errors.maxUnits = 'Максимум не может быть меньше минимума.';
  if (finite(stored?.unitsStep) !== null && finite(stored.unitsStep) < 1) errors.unitsStep = 'Шаг не может быть меньше 1.';
  return { ...errors, ...validatePricingRules(policyKey, { tiers: stored?.tiers ?? {} }) };
}

/**
 * The full quote for one set of answers.
 *
 * The breakdown is additive by construction — `subtotal + group − discount`
 * always equals the unrounded total — so the booking card can show the guest
 * exactly where each number comes from instead of a single opaque figure.
 */
export function calculatePrice({ basePrice, policyKey, rules, quantities = {} }) {
  const policy = resolvePricingRules(policyKey, rules);
  const base = Math.max(0, finite(basePrice) ?? 0);

  let discountedUnits = 1;
  let listUnits = 1;
  let surcharge = 1;
  let primaryUnits = 1;
  let hasMultiply = false;

  const dimensions = policy.dimensions.map((item) => {
    const units = unitsFor(item.mode, quantities[item.field]);
    const factor = dimensionFactor(item.mode, units, item.tiers);
    if (item.mode === PRICING_MODES.SURCHARGE) {
      surcharge *= factor;
    } else {
      discountedUnits *= factor;
      listUnits *= units;
      if (!hasMultiply) primaryUnits = units;
      hasMultiply = true;
    }
    return { field: item.field, mode: item.mode, units, factor, tiers: item.tiers };
  });

  if (!hasMultiply) primaryUnits = 1;

  const subtotal = base * listUnits;
  const listTotal = subtotal * surcharge;
  const exact = base * discountedUnits * surcharge;
  const total = roundTotal(exact, policy.roundTo);
  const groupAmount = listTotal - subtotal;
  const discountAmount = listTotal - exact;

  return {
    total,
    exact,
    /** Base rate × units, before any group surcharge or volume discount. */
    subtotal,
    /** What the same request would cost with every ladder switched off. */
    listTotal,
    groupAmount,
    discountAmount,
    discountPercent: listTotal > 0 ? (discountAmount / listTotal) * 100 : 0,
    units: primaryUnits,
    /**
     * What one discounted unit costs — the base rate at this booking length,
     * with the group surcharge left out. That is the number that shows the
     * ladder working: 345 GEL an hour becomes 325 across a full day.
     */
    unitPrice: primaryUnits > 0 ? (base * discountedUnits) / primaryUnits : base,
    roundTo: policy.roundTo,
    dimensions,
  };
}

/**
 * Operator-facing checks. Normalization already repairs anything it can, so
 * these only cover what an operator has to decide themselves — and the last one
 * guards the promise the whole model makes: a longer or bigger booking must
 * never get proportionally more expensive.
 */
export function validatePricingRules(policyKey, rules) {
  const errors = {};
  for (const item of getPricingPolicy(policyKey).dimensions) {
    const rows = rules?.tiers?.[item.field];
    if (!Array.isArray(rows) || !rows.length) continue;
    const firstUnit = FIRST_UNIT[item.mode] ?? 1;
    const maxPercent = item.mode === PRICING_MODES.SURCHARGE ? MAX_SURCHARGE_PERCENT : MAX_DISCOUNT_PERCENT;
    const seen = new Set();
    let previous = null;
    let message = '';
    for (const row of rows) {
      const from = finite(row?.from);
      const percent = finite(row?.percent);
      if (from === null || percent === null) message ||= 'Заполните порог и процент в каждой строке.';
      else if (from < firstUnit) message ||= `Порог не может быть меньше ${firstUnit}.`;
      else if (percent < 0 || percent > maxPercent) message ||= `Процент должен быть от 0 до ${maxPercent}.`;
      else if (seen.has(from)) message ||= `Порог «от ${from}» указан дважды.`;
      else {
        seen.add(from);
        if (previous !== null && (item.mode === PRICING_MODES.SURCHARGE ? percent > previous : percent < previous)) {
          message ||= item.mode === PRICING_MODES.SURCHARGE
            ? 'Надбавка за каждого следующего гостя не должна расти — иначе группа дорожает вместо того, чтобы дешеветь.'
            : 'Скидка на следующих порогах не должна уменьшаться — иначе бронь длиннее выходит дороже за единицу.';
        }
        previous = percent;
      }
    }
    if (message) errors[item.field] = message;
  }
  return errors;
}

/**
 * Flat `{ dimension, from, percent, sort_order }` rows — the shape the database
 * stores. Only dimensions the policy actually prices on are written, so a
 * renamed or retired field cannot leave orphan rows behind.
 */
export function flattenPricingTiers(policyKey, tiers = {}) {
  return getPricingPolicy(policyKey).dimensions.flatMap((item) => normalizeTiers(tiers?.[item.field], item.mode)
    .map((row, index) => ({ dimension: item.field, from: row.from, percent: row.percent, sort_order: index })));
}

/** Rebuild the `{ [field]: [{ from, percent }] }` map from database rows. */
export function groupPricingTiers(rows = []) {
  const tiers = {};
  for (const row of Array.isArray(rows) ? rows : []) {
    const field = typeof row?.dimension === 'string' ? row.dimension : '';
    if (!field) continue;
    (tiers[field] ??= []).push({ from: Number(row.from ?? row.from_units), percent: Number(row.percent) });
  }
  return tiers;
}
