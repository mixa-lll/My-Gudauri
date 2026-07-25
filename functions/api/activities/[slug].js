import { apiError, json } from '../../_lib/http';
import { getActivity } from '../../_lib/activities';

export async function onRequestGet({ env, params }) {
  try {
    const activity = await getActivity(env.DB, params.slug);
    return activity ? json({ data: activity }) : apiError('Activity not found', 404);
  } catch (error) {
    console.error('Failed to get activity', error);
    return apiError('Unable to load activity');
  }
}
