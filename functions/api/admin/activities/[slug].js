import { activityMediaUrls, getAdminActivity, saveActivity } from '../../../_lib/activityAdmin';
import { collectMediaGarbage } from '../../../_lib/cms';
import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const activity = await getAdminActivity(env.DB, params.slug);
  return activity ? json({ data: activity }, { cacheControl: 'no-store' }) : apiError('Activity not found', 404);
}

export async function onRequestPut({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try { const activity = await saveActivity(env.DB, await request.json(), params.slug, { bucket: env.MEDIA }); return activity ? json({ data: activity }, { cacheControl: 'no-store' }) : apiError('Activity not found', 404); } catch (error) { return apiError(error.message, 400); }
}

export async function onRequestDelete({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  // Read the file list before the cascade removes the rows that reference it.
  const doomed = await getAdminActivity(env.DB, params.slug);
  const result = await env.DB.prepare('DELETE FROM activities WHERE slug = ?').bind(params.slug).run();
  if (!result.meta.changes) return apiError('Activity not found', 404);
  await collectMediaGarbage(env.DB, env.MEDIA, activityMediaUrls(doomed));
  return json({ data: { deleted: true } }, { cacheControl: 'no-store' });
}
