import { apiError, json } from '../../_lib/http';
import { listActivities } from '../../_lib/activities';

export async function onRequestGet({ env }) {
  try {
    const activities = await listActivities(env.DB);
    return json({ data: activities, meta: { count: activities.length } });
  } catch (error) {
    console.error('Failed to list activities', error);
    return apiError('Unable to load activities');
  }
}
