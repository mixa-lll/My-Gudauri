import { getAdminTransfer, saveTransfer, transferMediaUrls } from '../../../_lib/transferAdmin';
import { collectMediaGarbage } from '../../../_lib/cms';
import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const transfer = await getAdminTransfer(env.DB, params.slug);
  return transfer ? json({ data: transfer }, { cacheControl: 'no-store' }) : apiError('Transfer not found', 404);
}

export async function onRequestPut({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try { const transfer = await saveTransfer(env.DB, await request.json(), params.slug, { bucket: env.MEDIA }); return transfer ? json({ data: transfer }, { cacheControl: 'no-store' }) : apiError('Transfer not found', 404); } catch (error) { return apiError(error.message, 400); }
}

export async function onRequestDelete({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  // Read the file list before the cascade removes the rows that reference it.
  const doomed = await getAdminTransfer(env.DB, params.slug);
  const result = await env.DB.prepare('DELETE FROM transfers WHERE slug = ?').bind(params.slug).run();
  if (!result.meta.changes) return apiError('Transfer not found', 404);
  await collectMediaGarbage(env.DB, env.MEDIA, transferMediaUrls(doomed));
  return json({ data: { deleted: true } }, { cacheControl: 'no-store' });
}
