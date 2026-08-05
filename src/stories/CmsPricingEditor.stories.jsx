import { useState } from 'react';
import { CmsPricingEditor, pricingPreviewRange } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

function PricingHarness({ policyKey = 'instructor-hourly-v1', basePrice = 345, initial = {}, initialRoundTo = 5, previewRanges }) {
  const [tiers, setTiers] = useState(initial);
  const [roundTo, setRoundTo] = useState(initialRoundTo);
  return <div style={{ maxWidth: 760, padding: 24 }}>
    <CmsPricingEditor
      policyKey={policyKey}
      basePrice={basePrice}
      roundTo={roundTo}
      value={tiers}
      onChange={setTiers}
      onRoundToChange={setRoundTo}
      previewRanges={previewRanges}
    />
  </div>;
}

export default {
  title: 'Blocks/Admin/CMS Pricing Editor',
  component: CmsPricingEditor,
  tags: ['autodocs'],
  parameters: {
    composition: defineComposition({ root: 'CmsPricingEditor', children: ['Button', 'FormField', 'Input'] }),
    docs: {
      description: {
        component: [
          'Volume pricing for one object. The pricing policy decides which parameters exist and whether each one discounts (hours, days, nights) or surcharges (extra guests); the operator only sets thresholds and percentages.',
          'Both ladders are marginal — a tier applies to the units inside it, never to the ones below — so a longer or larger booking always costs more in total and less per unit. The preview tables price every step live.',
        ].join('\n\n'),
      },
    },
  },
};

/** Nothing configured yet: the platform ladders are shown as the editable value. */
export const InstructorLesson = {
  name: 'Instructor Lesson',
  render: () => <PricingHarness previewRanges={{ duration: pricingPreviewRange(2, 12, 2), participants: pricingPreviewRange(1, 6, 1) }} />,
};

/** A steeper ladder for an instructor who wants full-day lessons to stand out. */
export const SteepVolumeDiscount = {
  name: 'Steep Volume Discount',
  render: () => <PricingHarness
    initial={{ duration: [{ from: 1, percent: 0 }, { from: 3, percent: 12 }, { from: 6, percent: 22 }, { from: 10, percent: 30 }], participants: [{ from: 2, percent: 30 }, { from: 4, percent: 15 }] }}
    previewRanges={{ duration: pricingPreviewRange(2, 12, 2), participants: pricingPreviewRange(1, 6, 1) }}
  />,
};

/** Every percentage at zero — a flat hourly rate with no group surcharge. */
export const FlatRate = {
  name: 'Flat Rate',
  render: () => <PricingHarness
    initial={{ duration: [{ from: 1, percent: 0 }], participants: [{ from: 2, percent: 0 }] }}
    previewRanges={{ duration: pricingPreviewRange(2, 12, 2), participants: pricingPreviewRange(1, 6, 1) }}
  />,
};

/** A raising surcharge ladder makes a group cost more per head — the editor says so. */
export const InvalidLadder = {
  name: 'Invalid Ladder',
  render: () => <PricingHarness
    initial={{ duration: [{ from: 1, percent: 0 }, { from: 4, percent: 15 }, { from: 8, percent: 5 }], participants: [{ from: 2, percent: 20 }, { from: 4, percent: 45 }] }}
    previewRanges={{ duration: pricingPreviewRange(2, 12, 2), participants: pricingPreviewRange(1, 6, 1) }}
  />,
};

/** Transfers price per vehicle, so the same editor reports that there is nothing to ladder. */
export const FixedPriceCategory = {
  name: 'Fixed Price Category',
  render: () => <PricingHarness policyKey="transfer-fixed-v1" basePrice={180} />,
};
