export async function createInstructorRequest(payload) {
  const response = await fetch('/api/instructor-requests', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error?.message || 'Unable to send your request. Please try again.');
  return result?.data;
}
