import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';
import { applyRequestAction, getAdminRequest } from '../../../_lib/requests';

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const found = await getAdminRequest(env.DB, params.code);
  return found ? json({ data: found }, { cacheControl: 'no-store' }) : apiError('Заявка не найдена.', 404);
}

/**
 * Every operator action posts here — take, status, note, message, confirm,
 * offer, accept-offer, payment, complete, cancel — and gets the refreshed card
 * back, history included, so the screen can never drift from the record.
 */
export async function onRequestPost({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return apiError('Invalid request data.', 400);
  try {
    const updated = await applyRequestAction(env.DB, params.code, payload);
    return updated ? json({ data: updated }, { cacheControl: 'no-store' }) : apiError('Заявка не найдена.', 404);
  } catch (error) {
    if (error?.status) return apiError(error.message, error.status);
    console.error('Failed to apply request action', error);
    return apiError('Не удалось выполнить действие. Попробуйте ещё раз.', 500);
  }
}
