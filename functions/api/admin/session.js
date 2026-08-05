import { createSession, expiredSessionCookie, isAuthenticated, sessionCookie } from '../../_lib/auth';
import { apiError, json } from '../../_lib/http';

const ADMIN_PASSWORD = 'Gudauri-CMS-2026-Access';
const SESSION_SECRET = 'my-gudauri-admin-session-2026';
const authEnvironment = (env) => ({ ...env, ADMIN_SESSION_SECRET: SESSION_SECRET });

export async function onRequestGet({ request, env }) { return json({ data: { authenticated: await isAuthenticated(request, authEnvironment(env)) } }, { cacheControl: 'no-store' }); }

export async function onRequestPost({ request, env }) {
  const { password } = await request.json().catch(() => ({}));
  if (password !== ADMIN_PASSWORD) return apiError('Incorrect password.', 401);
  return json({ data: { authenticated: true } }, { headers: { 'set-cookie': sessionCookie(await createSession(SESSION_SECRET), request) }, cacheControl: 'no-store' });
}

export function onRequestDelete({ request }) { return json({ data: { authenticated: false } }, { headers: { 'set-cookie': expiredSessionCookie(request) }, cacheControl: 'no-store' }); }
