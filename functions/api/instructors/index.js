import { apiError, json } from '../../_lib/http';
import { listInstructors } from '../../_lib/instructors';

export async function onRequestGet(context) {
  try {
    const instructors = await listInstructors(context.env.DB);
    return json({ data: instructors, meta: { count: instructors.length } });
  } catch (error) {
    console.error('Failed to list instructors', error);
    return apiError('Unable to load instructors');
  }
}
