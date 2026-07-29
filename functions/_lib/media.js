/**
 * Collection-agnostic media storage on R2.
 *
 * Every CMS object type stores its files in the same bucket under its own key
 * prefix, and every object type keeps holding a plain URL string in D1. Adding
 * rentals or tours later means adding one entry to MEDIA_COLLECTIONS — no new
 * bucket, no new endpoint, no schema change.
 */

import { toSlug } from '../../src/shared/slug.js';

/** Object types allowed to own uploads. Extend this when a collection ships. */
export const MEDIA_COLLECTIONS = ['instructors', 'activities', 'rentals', 'transfers', 'tours', 'places', 'articles'];

/** Public path prefix served by functions/media/[[path]].js. */
export const MEDIA_ROUTE = '/media/';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const EXTENSION_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

const TYPE_BY_EXTENSION = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
};

export class MediaError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// Operators reference objects by their Russian or Georgian name, so keys are
// transliterated with the same helper the public slugs use.
const segment = (value) => toSlug(value, { maxLength: 60 });

function extensionFor(file) {
  const fromType = EXTENSION_BY_TYPE[String(file?.type ?? '').toLowerCase()];
  if (fromType) return fromType;
  const fromName = String(file?.name ?? '').split('.').pop()?.toLowerCase();
  if (fromName && TYPE_BY_EXTENSION[fromName]) return TYPE_BY_EXTENSION[fromName] === 'image/jpeg' ? 'jpg' : fromName;
  return null;
}

export function buildMediaKey({ collection, reference, extension }) {
  const folder = segment(reference) || 'shared';
  return `${collection}/${folder}/${crypto.randomUUID()}.${extension}`;
}

/** `/media/instructors/nino/abc.jpg` → `instructors/nino/abc.jpg`, otherwise null. */
export function mediaKeyFromUrl(url) {
  const value = String(url ?? '').trim();
  if (!value.startsWith(MEDIA_ROUTE)) return null;
  const key = decodeURIComponent(value.slice(MEDIA_ROUTE.length).split('?')[0]);
  const parts = key.split('/');
  if (!key || parts.some((part) => !part || part === '.' || part === '..')) return null;
  if (!MEDIA_COLLECTIONS.includes(parts[0])) return null;
  return key;
}

export async function storeMedia(bucket, { collection, reference, file }) {
  if (!bucket) throw new MediaError('Хранилище файлов не настроено.', 500);
  if (!MEDIA_COLLECTIONS.includes(collection)) throw new MediaError('Неизвестный раздел для загрузки.', 400);
  if (!file || typeof file.arrayBuffer !== 'function') throw new MediaError('Файл не получен.', 400);
  if (file.size > MAX_UPLOAD_BYTES) throw new MediaError(`Файл больше ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} МБ.`, 413);

  const extension = extensionFor(file);
  if (!extension) throw new MediaError('Поддерживаются только JPG, PNG, WebP, AVIF и GIF.', 415);

  const key = buildMediaKey({ collection, reference, extension });
  const contentType = TYPE_BY_EXTENSION[extension];
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
  });

  return { url: `${MEDIA_ROUTE}${key}`, key, size: file.size, contentType };
}

/** Replacing or clearing a field deletes the old object so the bucket stays tidy. */
export async function deleteMediaByUrl(bucket, url) {
  const key = mediaKeyFromUrl(url);
  if (!bucket || !key) return false;
  await bucket.delete(key);
  return true;
}
