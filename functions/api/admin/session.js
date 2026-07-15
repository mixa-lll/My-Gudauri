import { createSession, expiredSessionCookie, isAuthenticated, sessionCookie } from '../../_lib/auth';
import { apiError, json } from '../../_lib/http';

export async function onRequestGet({ request, env }) { return json({ data: { authenticated: await isAuthenticated(request, env) } }, { cacheControl: 'no-store' }); }

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) return apiError('Admin credentials are not configured.', 503);
  const { password } = await request.json().catch(() => ({}));
  if (password !== env.ADMIN_PASSWORD) return apiError('Incorrect password.', 401);
  return json({ data: { authenticated: true } }, { headers: { 'set-cookie': sessionCookie(await createSession(env.ADMIN_SESSION_SECRET)) }, cacheControl: 'no-store' });
}

export function onRequestDelete() { return json({ data: { authenticated: false } }, { headers: { 'set-cookie': expiredSessionCookie }, cacheControl: 'no-store' }); }
