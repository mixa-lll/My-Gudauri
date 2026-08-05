import { isAuthenticated } from '../../../_lib/auth';
import { getCollectionPricing, isCategoryPriced, saveCollectionPricing } from '../../../_lib/collectionPricing';
import { apiError, json } from '../../../_lib/http';

/**
 * Category-level pricing: the tariff, the bookable range and the volume ladders
 * every object in a collection shares. Collections that price per object are
 * rejected rather than silently given an unused row.
 */

function guard(collection) {
  if (!isCategoryPriced(collection)) return apiError(`Категория «${collection}» назначает цену в карточке объекта, а не общей настройкой.`, 404);
  return null;
}

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const blocked = guard(params.collection);
  if (blocked) return blocked;
  return json({ data: await getCollectionPricing(env.DB, params.collection) }, { cacheControl: 'no-store' });
}

export async function onRequestPut({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const blocked = guard(params.collection);
  if (blocked) return blocked;
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return apiError('Invalid pricing payload.', 400);
  try {
    return json({ data: await saveCollectionPricing(env.DB, params.collection, payload) }, { cacheControl: 'no-store' });
  } catch (error) {
    return apiError(error.message, 400);
  }
}
