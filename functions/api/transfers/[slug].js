import { apiError, json } from '../../_lib/http';
import { getTransfer } from '../../_lib/transfers';

export async function onRequestGet({ env, params }) {
  try {
    const transfer = await getTransfer(env.DB, params.slug);
    return transfer ? json({ data: transfer }) : apiError('Transfer not found', 404);
  } catch (error) {
    console.error('Failed to load transfer', error);
    return apiError('Unable to load transfer');
  }
}
