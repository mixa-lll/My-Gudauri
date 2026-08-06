import { isAuthenticated } from '../../../_lib/auth';
import { apiError, json } from '../../../_lib/http';
import { listAdminRequests } from '../../../_lib/requests';

/**
 * The whole queue in one response. Status, category and search are applied in
 * the admin UI, so the chip counts always describe the same set of rows the
 * table is filtering — the list never disagrees with its own summary.
 */
export async function onRequestGet({ request, env }) {
  if (!await isAuthenticated(request, env)) return apiError('Unauthorized', 401);
  return json({ data: await listAdminRequests(env.DB) }, { cacheControl: 'no-store' });
}
