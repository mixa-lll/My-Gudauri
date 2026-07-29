/**
 * Uploads for any CMS collection go through one endpoint. Callers pass the
 * collection name, so instructors, activities and future object types share
 * this client unchanged.
 */
async function readPayload(response) {
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    const expired = new Error('Сессия истекла — войдите заново.');
    expired.code = 'unauthorized';
    throw expired;
  }
  if (!response.ok) throw new Error(payload.error?.message || 'Не удалось загрузить файл.');
  return payload.data;
}

export async function uploadMedia({ collection, reference, file }) {
  const body = new FormData();
  body.append('collection', collection);
  if (reference) body.append('reference', reference);
  body.append('file', file);
  // No content-type header: the browser has to set the multipart boundary.
  return readPayload(await fetch('/api/admin/media', { method: 'POST', credentials: 'same-origin', body }));
}

export async function deleteMedia(url) {
  return readPayload(await fetch('/api/admin/media', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url }),
  }));
}
