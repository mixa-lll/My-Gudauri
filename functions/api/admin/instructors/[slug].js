import { getAdminInstructor, saveInstructor } from '../../../_lib/admin';
import { collectMediaGarbage } from '../../../_lib/cms';
import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const item = await getAdminInstructor(env.DB, params.slug);
  return item ? json({ data: item }, { cacheControl: 'no-store' }) : apiError('Instructor not found', 404);
}
export async function onRequestPut({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try { const item = await saveInstructor(env.DB, await request.json(), params.slug, { bucket: env.MEDIA }); return item ? json({ data: item }, { cacheControl: 'no-store' }) : apiError('Instructor not found', 404); } catch (error) { return apiError(error.message, 400); }
}
export async function onRequestDelete({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  // Read the file list before the cascade removes the rows that reference it.
  const doomed = await getAdminInstructor(env.DB, params.slug);
  const result = await env.DB.prepare('DELETE FROM instructors WHERE slug = ?').bind(params.slug).run();
  if (!result.meta.changes) return apiError('Instructor not found', 404);
  await collectMediaGarbage(env.DB, env.MEDIA, [doomed?.card_image_url, doomed?.hero_image_url, doomed?.booking_avatar_url, ...(doomed?.media ?? []).map((item) => item.url)].filter(Boolean));
  return json({ data: { deleted: true } }, { cacheControl: 'no-store' });
}
