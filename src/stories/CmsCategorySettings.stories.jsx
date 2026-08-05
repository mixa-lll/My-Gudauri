import { useState } from 'react';
import { CmsCategorySettings } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const TIERS = {
  duration: [{ from: 1, percent: 0 }, { from: 4, percent: 8 }, { from: 8, percent: 15 }],
  participants: [{ from: 2, percent: 35 }, { from: 3, percent: 25 }, { from: 5, percent: 15 }],
};

/** Matches the payload `/api/admin/pricing/instructors` returns. */
const instructorsPricing = {
  collection: 'instructors',
  policyKey: 'instructor-hourly-v1',
  currency: 'GEL',
  baseRate: 345,
  minUnits: 2,
  maxUnits: 12,
  unitsStep: 2,
  defaultUnits: 8,
  defaultGroup: 2,
  roundTo: 5,
  unitField: 'duration',
  groupField: 'participants',
  tiers: TIERS,
  rules: { roundTo: 5, tiers: TIERS },
};

function SettingsHarness({ initial = instructorsPricing, busy = false, dirty = false }) {
  const [value, setValue] = useState(initial);
  return <CmsCategorySettings
    collection="instructors"
    value={value}
    onChange={setValue}
    onSave={() => {}}
    onBack={() => {}}
    onNavigate={() => {}}
    onSignOut={() => {}}
    counts={{ instructors: 12, activities: 8, transfers: 12 }}
    objectCount={12}
    busy={busy}
    dirty={dirty}
  />;
}

export default {
  title: 'Blocks/Admin/CMS Category Settings',
  component: CmsCategorySettings,
  tags: ['autodocs'],
  parameters: {
    composition: defineComposition({ root: 'CmsCategorySettings', children: ['Button', 'FormField', 'Input', 'CmsPricingEditor'] }),
    docs: {
      description: {
        component: [
          'The price of a whole category in one screen. A tariff, a bookable range and a discount ladder belong to the category, not to one object: every instructor works on the same official rate, so editing it per card meant a price change was one forgotten draft away from an inconsistent catalog.',
          'Reached from the “⚙ Настройки категории” action on the collection list. Object cards keep only what genuinely differs between them and show the rest read-only.',
        ].join('\n\n'),
      },
    },
  },
};

export const Instructors = { render: () => <SettingsHarness /> };

/** A category that has never been configured falls back to the platform defaults. */
export const Unconfigured = { render: () => <SettingsHarness initial={{ ...instructorsPricing, baseRate: '', minUnits: '', maxUnits: '', unitsStep: '', defaultUnits: '', defaultGroup: '', roundTo: '', tiers: {} }} /> };

export const UnsavedChanges = { name: 'Unsaved Changes', render: () => <SettingsHarness dirty /> };

export const Saving = { render: () => <SettingsHarness busy /> };
