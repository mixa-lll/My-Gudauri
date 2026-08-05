import { useState } from 'react';
import { VEHICLE_TYPES, VehicleTypeFilter, VehicleTypeIcon, VehicleTypeTag } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const LABELS = { sedan: 'Sedan', hatchback: 'Hatchback', suv: 'SUV 4×4', minivan: 'Minivan', minibus: 'Minibus' };
const OPTIONS = VEHICLE_TYPES.map((type, index) => ({ id: `bodyType:${type}`, type, label: LABELS[type], count: [4, 0, 2, 3, 1][index] }));

function FilterHarness() {
  const [selected, setSelected] = useState(['bodyType:suv']);
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <VehicleTypeFilter label="Vehicle size" options={OPTIONS} selectedValues={selected} onToggle={toggle} />;
}

export default {
  title: 'Components/Vehicle types',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: { description: { component: 'Body type is the dimension a transfer guest judges on sight, so it is drawn rather than described. One shared set at one angle and scale keeps the five sizes comparable wherever they appear.' } },
  },
};

export const Icons = {
  name: 'Icons',
  parameters: { composition: defineComposition({ root: 'VehicleTypeIcon' }) },
  render: () => <div className="sb-canvas sb-row" style={{ alignItems: 'center', gap: 16 }}>{VEHICLE_TYPES.map((type) => <div key={type} style={{ width: 120, textAlign: 'center' }}><VehicleTypeIcon type={type} /><small>{LABELS[type]}</small></div>)}</div>,
};
export const Tags = {
  name: 'Tags',
  parameters: { composition: defineComposition({ root: 'VehicleTypeTag' }) },
  render: () => <div className="sb-canvas sb-row" style={{ flexWrap: 'wrap', gap: 10 }}>{VEHICLE_TYPES.map((type) => <VehicleTypeTag key={type} type={type} label={LABELS[type]} />)}</div>,
};
export const Filter = {
  name: 'Filter',
  parameters: { composition: defineComposition({ root: 'VehicleTypeFilter' }) },
  render: () => <div className="sb-canvas"><FilterHarness /></div>,
};
