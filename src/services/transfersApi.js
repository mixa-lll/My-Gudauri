async function request(path) {
  const response = await fetch(path, { headers: { accept: 'application/json' } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || 'Не удалось загрузить трансферы.');
  return payload.data;
}

export const getTransfers = () => request('/api/transfers');
export const getTransfer = (slug) => request(`/api/transfers/${encodeURIComponent(slug)}`);
