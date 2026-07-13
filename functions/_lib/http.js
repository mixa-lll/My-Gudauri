export function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', init.cacheControl ?? 'public, max-age=60, s-maxage=300');

  return new Response(JSON.stringify(data), { ...init, headers });
}

export function apiError(message, status = 500) {
  return json({ error: { message, status } }, { status, cacheControl: 'no-store' });
}
