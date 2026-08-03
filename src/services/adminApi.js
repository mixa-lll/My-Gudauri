async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { accept: 'application/json', ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    const expired = new Error('Сессия истекла — войдите заново.');
    expired.code = 'unauthorized';
    throw expired;
  }
  if (!response.ok) throw new Error(payload.error?.message || 'Не удалось выполнить запрос.');
  return payload.data;
}

export const getAdminSession = () => request('/api/admin/session');
export const login = (password) => request('/api/admin/session', { method: 'POST', body: JSON.stringify({ password }) });
export const logout = () => request('/api/admin/session', { method: 'DELETE' });
export const getAdminInstructors = () => request('/api/admin/instructors');
export const getAdminInstructor = (slug) => request(`/api/admin/instructors/${encodeURIComponent(slug)}`);
export const createInstructor = (data) => request('/api/admin/instructors', { method: 'POST', body: JSON.stringify(data) });
export const duplicateInstructor = (slug) => request('/api/admin/instructors/duplicate', { method: 'POST', body: JSON.stringify({ slug }) });
export const updateInstructor = (slug, data) => request(`/api/admin/instructors/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInstructor = (slug) => request(`/api/admin/instructors/${encodeURIComponent(slug)}`, { method: 'DELETE' });
export const getAdminActivities = () => request('/api/admin/activities');
export const getAdminActivity = (slug) => request(`/api/admin/activities/${encodeURIComponent(slug)}`);
export const createActivity = (data) => request('/api/admin/activities', { method: 'POST', body: JSON.stringify(data) });
export const updateActivity = (slug, data) => request(`/api/admin/activities/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteActivity = (slug) => request(`/api/admin/activities/${encodeURIComponent(slug)}`, { method: 'DELETE' });
export const getAdminTransfers = () => request('/api/admin/transfers');
export const getAdminTransfer = (slug) => request(`/api/admin/transfers/${encodeURIComponent(slug)}`);
export const createTransfer = (data) => request('/api/admin/transfers', { method: 'POST', body: JSON.stringify(data) });
export const updateTransfer = (slug, data) => request(`/api/admin/transfers/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTransfer = (slug) => request(`/api/admin/transfers/${encodeURIComponent(slug)}`, { method: 'DELETE' });
export const getCategories = () => request('/api/admin/categories');
export const updateCategories = (categories) => request('/api/admin/categories', { method: 'PUT', body: JSON.stringify(categories) });
