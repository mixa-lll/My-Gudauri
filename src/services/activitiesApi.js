import { getDestination, getDestinationItem } from '../data/destinations';

export const ACTIVITY_GROUP_LABELS = {
  freeride: 'Freeride',
  'ski-touring': 'Ski touring',
  heliskiing: 'Heliskiing',
  mountaineering: 'Mountaineering',
  freestyle: 'Freestyle',
  'snowmobile-tours': 'Snowmobile tours',
  paragliding: 'Paragliding',
  excursions: 'Excursions',
  'mountain-biking': 'Mountain biking',
  other: 'Other adventures'
};

function withActivityGroupLabel(activity) {
  return { ...activity, catalogGroupLabel: ACTIVITY_GROUP_LABELS[activity.catalogGroup] || activity.catalogGroup || activity.category };
}

async function request(path) {
  const response = await fetch(path, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`API request failed with ${response.status}`);
  return (await response.json()).data;
}

function normalizeFallback(item) {
  if (!item) return null;
  const priceAmount = Number.parseFloat(String(item.price ?? '').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
  return withActivityGroupLabel({
    ...item,
    imageAlt: `${item.name} in Gudauri`,
    heroImage: item.heroImage ?? item.image ?? null,
    heroImageAlt: `${item.name} in Gudauri`,
    priceAmount,
    currency: 'GEL',
    reviewCount: Number.parseInt(String(item.reviews ?? '0'), 10) || 0,
    facts: (item.facts ?? []).map(([label, value]) => ({ label, value })),
    excluded: item.excluded ?? [],
    equipment: item.equipment ?? [],
    schedule: item.schedule ?? [],
    media: item.image ? [{ type: 'image', src: item.image, thumbnail: item.image, alt: `${item.name} in Gudauri`, featured: true }] : []
  });
}

export async function getActivities() {
  try {
    return (await request('/api/activities')).map(withActivityGroupLabel);
  } catch (error) {
    if (import.meta.env.DEV) return (getDestination('activities')?.items ?? []).map(normalizeFallback);
    throw error;
  }
}

export async function getActivity(slug) {
  try {
    return withActivityGroupLabel(await request(`/api/activities/${encodeURIComponent(slug)}`));
  } catch (error) {
    if (import.meta.env.DEV) return normalizeFallback(getDestinationItem('activities', slug));
    if (error.message.includes('404')) return null;
    throw error;
  }
}
