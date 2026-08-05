import { isAuthenticated } from '../../../_lib/auth';
import { listTransferRoutes, saveTransferRoutes } from '../../../_lib/transferAdmin';
import { apiError, json } from '../../../_lib/http';

// Static segment: Pages routes this file ahead of the [slug].js vehicle route.
export async function onRequestGet({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  return json({ data: await listTransferRoutes(env.DB) }, { cacheControl: 'no-store' });
}

export async function onRequestPut({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try {
    const { routes } = await request.json();
    return json({ data: await saveTransferRoutes(env.DB, routes) }, { cacheControl: 'no-store' });
  } catch (error) {
    return apiError(error.message, 400);
  }
}
