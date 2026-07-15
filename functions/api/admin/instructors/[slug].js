import { getAdminInstructor, saveInstructor } from '../../../_lib/admin';
import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const item = await getAdminInstructor(env.DB, params.slug);
  return item ? json({ data: item }, { cacheControl: 'no-store' }) : apiError('Instructor not found', 404);
}
export async function onRequestPut({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try { const item = await saveInstructor(env.DB, await request.json(), params.slug); return item ? json({ data: item }, { cacheControl: 'no-store' }) : apiError('Instructor not found', 404); } catch (error) { return apiError(error.message, 400); }
}
export async function onRequestDelete({ request, env, params }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const result = await env.DB.prepare('DELETE FROM instructors WHERE slug = ?').bind(params.slug).run();
  return result.meta.changes ? json({ data: { deleted: true } }, { cacheControl: 'no-store' }) : apiError('Instructor not found', 404);
}
