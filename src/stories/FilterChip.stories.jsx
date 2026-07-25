import { useState } from 'react';
import { FilterChip } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Primitives/Filter Chip',
  component: FilterChip,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'FilterChip' }) },
  args: { children: 'Ski lessons', selected: false, size: 'md', tone: 'primary', disabled: false },
  argTypes: { size: { control: 'select', options: ['sm', 'md'] }, tone: { control: 'select', options: ['primary', 'accent'] } },
};

export const Playground = {};

function ChipSelection() {
  const [selected, setSelected] = useState('ski');
  return (
    <div className="sb-row">
      {['ski', 'snowboard', 'freeride'].map((item) => (
        <FilterChip selected={selected === item} onClick={() => setSelected(item)} key={item}>{item}</FilterChip>
      ))}
      <FilterChip disabled>Unavailable</FilterChip>
    </div>
  );
}

export const States = { render: () => <main className="sb-canvas sb-section"><ChipSelection /></main> };

export const Sizes = {
  render: () => <main className="sb-canvas sb-row"><FilterChip size="sm">Compact</FilterChip><FilterChip>Default</FilterChip></main>,
};

export const Accent = { render: () => <main className="sb-canvas sb-row"><FilterChip tone="accent" selected>Selected request option</FilterChip><FilterChip tone="accent">Available option</FilterChip></main> };
