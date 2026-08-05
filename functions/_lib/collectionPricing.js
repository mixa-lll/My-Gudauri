import {
  CATEGORY_PRICED_COLLECTIONS,
  flattenPricingTiers,
  groupPricingTiers,
  resolveCollectionPricing,
  validateCollectionPricing,
} from '../../src/shared/pricing.js';

/**
 * Category-level pricing storage.
 *
 * One row per collection plus its ladder steps. Every collection reads and
 * writes through here, so adding volume pricing to activities or stays needs no
 * new table and no new endpoint — only an entry in CATEGORY_PRICED_COLLECTIONS.
 */

export function isCategoryPriced(collection) {
  return CATEGORY_PRICED_COLLECTIONS.includes(collection);
}

/**
 * Settings for one collection, with platform defaults filled in.
 * A collection with no row yet resolves to the defaults rather than to zero, so
 * the catalog is quotable from the first request.
 */
export async function getCollectionPricing(db, collection) {
  const [row, tiers] = await db.batch([
    db.prepare('SELECT currency, base_rate, min_units, max_units, units_step, default_units, default_group, round_to FROM collection_pricing WHERE collection = ?').bind(collection),
    db.prepare('SELECT dimension, from_units, percent FROM collection_price_tiers WHERE collection = ? ORDER BY dimension, from_units').bind(collection),
  ]);
  const stored = row.results[0];
  return resolveCollectionPricing(collection, {
    currency: stored?.currency,
    baseRate: stored?.base_rate,
    minUnits: stored?.min_units,
    maxUnits: stored?.max_units,
    unitsStep: stored?.units_step,
    defaultUnits: stored?.default_units,
    defaultGroup: stored?.default_group,
    roundTo: stored?.round_to,
    tiers: groupPricingTiers(tiers.results),
  });
}

/**
 * Replace a collection's settings. Validation runs against the raw payload so
 * the operator hears about a zero tariff instead of silently getting a default.
 */
export async function saveCollectionPricing(db, collection, payload) {
  const errors = validateCollectionPricing(collection, payload);
  const firstError = Object.values(errors)[0];
  if (firstError) throw new Error(firstError);

  const settings = resolveCollectionPricing(collection, payload);
  const statements = [
    db.prepare(`
      INSERT INTO collection_pricing (collection, currency, base_rate, min_units, max_units, units_step, default_units, default_group, round_to, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(collection) DO UPDATE SET
        currency = excluded.currency, base_rate = excluded.base_rate,
        min_units = excluded.min_units, max_units = excluded.max_units, units_step = excluded.units_step,
        default_units = excluded.default_units, default_group = excluded.default_group,
        round_to = excluded.round_to, updated_at = CURRENT_TIMESTAMP
    `).bind(
      collection,
      settings.currency,
      settings.baseRate,
      settings.minUnits,
      settings.maxUnits,
      settings.unitsStep,
      settings.defaultUnits,
      settings.defaultGroup,
      settings.roundTo,
    ),
    db.prepare('DELETE FROM collection_price_tiers WHERE collection = ?').bind(collection),
  ];
  for (const tier of flattenPricingTiers(settings.policyKey, payload?.tiers)) {
    statements.push(db.prepare('INSERT INTO collection_price_tiers (collection, dimension, from_units, percent, sort_order) VALUES (?, ?, ?, ?, ?)')
      .bind(collection, tier.dimension, tier.from, tier.percent, tier.sort_order));
  }
  await db.batch(statements);
  return getCollectionPricing(db, collection);
}
