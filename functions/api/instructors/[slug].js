import { apiError, json } from '../../_lib/http';
import { getInstructor } from '../../_lib/instructors';

export async function onRequestGet(context) {
  try {
    const instructor = await getInstructor(context.env.DB, context.params.slug);
    if (!instructor) return apiError('Instructor not found', 404);
    return json({ data: instructor });
  } catch (error) {
    console.error('Failed to load instructor', error);
    return apiError('Unable to load instructor');
  }
}
