import { duplicateInstructor } from '../../../_lib/admin';
import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';

export async function onRequestPost({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  const { slug } = await request.json();
  if (!slug) return apiError('Instructor slug is required', 400);
  try {
    const item = await duplicateInstructor(env.DB, slug);
    return item
      ? json({ data: item }, { status: 201, cacheControl: 'no-store' })
      : apiError('Instructor not found', 404);
  } catch (error) {
    return apiError(error.message, 400);
  }
}
