import { INSTRUCTORS, INSTRUCTOR_DETAILS } from '../data/instructors';

async function request(path) {
  const response = await fetch(path, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`API request failed with ${response.status}`);
  const payload = await response.json();
  return payload.data;
}

export async function getInstructors() {
  try {
    return await request('/api/instructors');
  } catch (error) {
    if (import.meta.env.DEV) return INSTRUCTORS;
    throw error;
  }
}

export async function getInstructor(slug) {
  try {
    return await request(`/api/instructors/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (import.meta.env.DEV) return INSTRUCTOR_DETAILS[slug] ?? null;
    if (error.message.includes('404')) return null;
    throw error;
  }
}
