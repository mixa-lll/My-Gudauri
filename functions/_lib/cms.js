/**
 * Operations every CMS collection needs: unique page addresses, automatic
 * catalog order and orphaned-file cleanup.
 *
 * Adding a collection means adding one line to MEDIA_REFERENCES and calling
 * these helpers from its save function — nothing here is object-specific.
 */

import { toSlug } from '../../src/shared/slug.js';
import { deleteMediaByUrl, mediaKeyFromUrl } from './media.js';

/** Every column across the CMS that can hold an uploaded file URL. */
const MEDIA_REFERENCES = [
  { table: 'instructors', columns: ['card_image_url', 'hero_image_url', 'booking_avatar_url'] },
  { table: 'instructor_media', columns: ['url'] },
  { table: 'activities', columns: ['card_image_url', 'hero_image_url'] },
  { table: 'activity_media', columns: ['url'] },
  { table: 'transfers', columns: ['card_image_url', 'hero_image_url'] },
  { table: 'transfer_media', columns: ['url'] },
];

/**
 * Slug conflicts are resolved silently while the slug is derived from the
 * object's name, and reported as a field error when the operator typed one on
 * purpose — a silent rename of a hand-written address would be surprising.
 */
export async function resolveUniqueSlug(db, { table, requested, fallback, currentId, conflictMessage }) {
  const typed = toSlug(requested);
  const base = typed || toSlug(fallback) || 'item';
  const { results } = await db.prepare(`SELECT slug FROM ${table} WHERE (slug = ? OR slug LIKE ?) AND id IS NOT ?`).bind(base, `${base}-%`, currentId ?? null).all();
  const taken = new Set(results.map((item) => item.slug));
  if (!taken.has(base)) return base;
  if (typed) throw new Error(conflictMessage(base));
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

/** New objects go to the end of the catalog unless the operator says otherwise. */
export async function nextSortOrder(db, table) {
  const row = await db.prepare(`SELECT MAX(sort_order) AS value FROM ${table}`).first();
  return Math.round(Number(row?.value ?? 0)) + 10;
}

/**
 * Delete uploaded files nothing points at any more.
 *
 * Duplicated objects share their source's file URLs, so every candidate is
 * re-checked against all collections first — otherwise deleting a copy would
 * break the original's photo.
 */
export async function collectMediaGarbage(db, bucket, candidates) {
  if (!bucket) return;
  const owned = [...new Set(candidates)].filter((url) => mediaKeyFromUrl(url));
  for (const url of owned) {
    const clauses = MEDIA_REFERENCES.map(({ table, columns }) => `SELECT 1 AS hit FROM ${table} WHERE ${columns.map((column) => `${column} = ?1`).join(' OR ')}`);
    const referenced = await db.prepare(`${clauses.join(' UNION ALL ')} LIMIT 1`).bind(url).first();
    if (!referenced) await deleteMediaByUrl(bucket, url);
  }
}
