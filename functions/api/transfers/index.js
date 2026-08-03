import { apiError, json } from '../../_lib/http';
import { listTransfers } from '../../_lib/transfers';

export async function onRequestGet({ env }) {
  try {
    const transfers = await listTransfers(env.DB);
    return json({ data: transfers, meta: { count: transfers.length } });
  } catch (error) {
    console.error('Failed to list transfers', error);
    return apiError('Unable to load transfers');
  }
}
