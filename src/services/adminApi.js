async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { accept: 'application/json', ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || 'Request failed.');
  return payload.data;
}

export const getAdminSession = () => request('/api/admin/session');
export const login = (password) => request('/api/admin/session', { method: 'POST', body: JSON.stringify({ password }) });
export const logout = () => request('/api/admin/session', { method: 'DELETE' });
export const getAdminInstructors = () => request('/api/admin/instructors');
export const getAdminInstructor = (slug) => request(`/api/admin/instructors/${encodeURIComponent(slug)}`);
export const createInstructor = (data) => request('/api/admin/instructors', { method: 'POST', body: JSON.stringify(data) });
export const updateInstructor = (slug, data) => request(`/api/admin/instructors/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInstructor = (slug) => request(`/api/admin/instructors/${encodeURIComponent(slug)}`, { method: 'DELETE' });
export const getCategories = () => request('/api/admin/categories');
export const updateCategories = (categories) => request('/api/admin/categories', { method: 'PUT', body: JSON.stringify(categories) });
