import { useState } from 'react';
import { CmsRouteSettings } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const routes = [
  { id: 1, origin_name: 'Tbilisi', city: 'tbilisi', zone_type: 'City & airport', duration_label: '~2 hours', distance_km: 120, road_notice: 'Journey time can change with traffic and winter road conditions.', published: true, offers_count: 4, sort_order: 10 },
  { id: 2, origin_name: 'Kutaisi Airport', city: 'kutaisi', zone_type: 'Airport', duration_label: '~4.5 hours', distance_km: 310, road_notice: 'A comfort stop can be arranged on this long route.', published: true, offers_count: 2, sort_order: 20 },
  { id: 3, origin_name: 'Kazbegi', city: 'kazbegi', zone_type: 'City', duration_label: '~1 hour', distance_km: 35, road_notice: 'Cross Pass access depends on current winter road conditions.', published: true, offers_count: 2, sort_order: 30 },
  { id: 4, origin_name: 'Vladikavkaz', city: 'vladikavkaz', zone_type: 'Border / airport', duration_label: '3–6 hours', distance_km: 80, road_notice: 'Travel time depends on border queues and documents.', published: false, offers_count: 0, sort_order: 40 },
];

function SettingsHarness({ initial = routes, busy = false, dirty = false }) {
  const [value, setValue] = useState(initial);
  return <CmsRouteSettings
    value={value}
    onChange={setValue}
    onSave={() => {}}
    onBack={() => {}}
    onNavigate={() => {}}
    onSignOut={() => {}}
    counts={{ instructors: 8, activities: 9, transfers: 5 }}
    busy={busy}
    dirty={dirty}
  />;
}

export default {
  title: 'Blocks/Admin/CMS Route Settings',
  component: CmsRouteSettings,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'CmsRouteSettings', children: ['Button', 'ChoiceControls', 'FormField', 'Input'] }) },
};

/** Direction info blocks: every card of a direction shows these values. */
export const Directions = { render: () => <SettingsHarness /> };

export const Empty = { render: () => <SettingsHarness initial={[]} /> };

export const UnsavedChanges = { name: 'Unsaved Changes', render: () => <SettingsHarness dirty /> };
