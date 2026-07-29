import { isAuthenticated } from '../../_lib/auth';
import { MediaError, deleteMediaByUrl, storeMedia } from '../../_lib/media';
import { apiError, json } from '../../_lib/http';

export async function onRequestPost({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  try {
    const form = await request.formData();
    const saved = await storeMedia(env.MEDIA, {
      collection: form.get('collection'),
      reference: form.get('reference'),
      file: form.get('file'),
    });
    return json({ data: saved }, { status: 201, cacheControl: 'no-store' });
  } catch (error) {
    return apiError(error.message, error instanceof MediaError ? error.status : 400);
  }
}

export async function onRequestDelete({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const { url } = await request.json().catch(() => ({}));
  const deleted = await deleteMediaByUrl(env.MEDIA, url);
  return json({ data: { deleted } }, { cacheControl: 'no-store' });
}
