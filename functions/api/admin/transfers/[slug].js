import { deleteVehicle, getAdminTransfer, listTransferRoutes, saveTransfer, saveTransferRoutes } from '../../../_lib/transferAdmin';
import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  // Static files should win over this param route; kept as a guard in case the
  // platform ever routes /transfers/routes here.
  if (params.slug === 'routes') return json({ data: await listTransferRoutes(env.DB) }, { cacheControl: 'no-store' });
  const vehicle = await getAdminTransfer(env.DB, params.slug);
  return vehicle ? json({ data: vehicle }, { cacheControl: 'no-store' }) : apiError('Vehicle not found', 404);
}

export async function onRequestPut({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try {
    if (params.slug === 'routes') { const { routes } = await request.json(); return json({ data: await saveTransferRoutes(env.DB, routes) }, { cacheControl: 'no-store' }); } const vehicle = await saveTransfer(env.DB, await request.json(), params.slug, { bucket: env.MEDIA }); return vehicle ? json({ data: vehicle }, { cacheControl: 'no-store' }) : apiError('Vehicle not found', 404); } catch (error) { return apiError(error.message, 400); }
}

export async function onRequestDelete({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  // The vehicle takes its offer cards down with it; media is swept afterwards.
  const deleted = await deleteVehicle(env.DB, params.slug, { bucket: env.MEDIA });
  return deleted ? json({ data: { deleted: true } }, { cacheControl: 'no-store' }) : apiError('Vehicle not found', 404);
}
