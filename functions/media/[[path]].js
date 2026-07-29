import { MEDIA_COLLECTIONS } from '../_lib/media';

/**
 * Public read path for uploaded CMS files. Keys are content-addressed by a
 * UUID, so responses are immutable and safe to cache for a year.
 */
export async function onRequestGet({ env, params, request }) {
  const segments = Array.isArray(params.path) ? params.path : [params.path];
  if (!segments.length || segments.some((part) => !part || part === '.' || part === '..')) return new Response('Not found', { status: 404 });
  if (!MEDIA_COLLECTIONS.includes(segments[0])) return new Response('Not found', { status: 404 });

  const key = segments.map((part) => decodeURIComponent(part)).join('/');
  const object = await env.MEDIA?.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', object.httpMetadata?.cacheControl ?? 'public, max-age=31536000, immutable');

  if (request.headers.get('if-none-match') === object.httpEtag) return new Response(null, { status: 304, headers });
  return new Response(object.body, { headers });
}
