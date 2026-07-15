import { apiError, json } from '../_lib/http';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT slug, name AS title, description, icon_url AS icon, href FROM categories WHERE is_enabled = 1 ORDER BY sort_order, name').all();
    return json({ data: results });
  } catch (error) { return apiError('Unable to load categories'); }
}
