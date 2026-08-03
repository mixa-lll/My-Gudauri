import { isAuthenticated } from '../../../_lib/auth';
import { listAdminTransfers, saveTransfer } from '../../../_lib/transferAdmin';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  return json({ data: await listAdminTransfers(env.DB) }, { cacheControl: 'no-store' });
}

export async function onRequestPost({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try { return json({ data: await saveTransfer(env.DB, await request.json(), undefined, { bucket: env.MEDIA }) }, { status: 201, cacheControl: 'no-store' }); } catch (error) { return apiError(error.message, 400); }
}
