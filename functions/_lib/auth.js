const encoder = new TextEncoder();
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const DEFAULT_SESSION_SECRET = 'my-gudauri-admin-session-2026';

function base64UrlEncode(value) {
  const bytes = value instanceof Uint8Array ? value : encoder.encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function key(secret) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(value, secret) {
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(value))));
}

function cookieValue(request, name) {
  return request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export async function createSession(secret) {
  const payload = base64UrlEncode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function isAuthenticated(request) {
  const sessionSecret = DEFAULT_SESSION_SECRET;
  const token = cookieValue(request, 'mg_admin');
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !(await crypto.subtle.verify('HMAC', await key(sessionSecret), base64UrlDecode(signature), encoder.encode(payload)))) return false;
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))).exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function sessionCookie(token) {
  return `mg_admin=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}; Secure`;
}

export const expiredSessionCookie = 'mg_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure';
