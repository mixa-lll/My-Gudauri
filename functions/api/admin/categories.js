import { isAuthenticated } from '../../_lib/auth';
import { apiError, json } from '../../_lib/http';

export async function onRequestGet({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY sort_order, name').all();
  return json({ data: results }, { cacheControl: 'no-store' });
}
export async function onRequestPut({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const categories = await request.json().catch(() => null);
  if (!Array.isArray(categories)) return apiError('Invalid categories payload.', 400);
  await env.DB.batch(categories.map((category, index) => env.DB.prepare('UPDATE categories SET is_enabled = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(category.is_enabled ? 1 : 0, index, category.id)));
  return onRequestGet({ request, env });
}
