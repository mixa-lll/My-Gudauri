import { isAuthenticated } from '../../../_lib/auth';
import { listAdminInstructors, saveInstructor } from '../../../_lib/admin';
import { apiError, json } from '../../../_lib/http';

export async function onRequestGet({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  return json({ data: await listAdminInstructors(env.DB) }, { cacheControl: 'no-store' });
}
export async function onRequestPost({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try { return json({ data: await saveInstructor(env.DB, await request.json()) }, { status: 201, cacheControl: 'no-store' }); } catch (error) { return apiError(error.message, 400); }
}
