import { MediaPlaceholder } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Components/Media Placeholder',
  component: MediaPlaceholder,
  parameters: { composition: defineComposition({ root: 'MediaPlaceholder' }) },
  args: { label: 'Gudauri mountain view', kind: 'activity', compact: false }
};

export default meta;
export const Playground = { render: (args) => <div className="sb-canvas" style={{ height: 460 }}><MediaPlaceholder {...args} /></div> };

export const ToneVariants = {
  name: 'Category variants',
  render: () => <div className="sb-canvas sb-grid sb-grid--cards">{[
    ['Instructor lesson', 'instructor'], ['Freeride day', 'activity'], ['Ski set', 'rental'], ['Airport pickup', 'transfer'],
    ['Mountain chalet', 'stay'], ['Photo session', 'service'], ['Local café', 'place'], ['Resort guide', 'editorial']
  ].map(([label, kind]) => <div style={{ height: 300 }} key={kind}><MediaPlaceholder label={label} kind={kind} /></div>)}</div>
};

export const Compact = {
  render: () => <div className="sb-canvas sb-grid">{[['Instructor', 'instructor'], ['Activity', 'activity'], ['Apartment', 'stay']].map(([label, kind]) => <div style={{ height: 180 }} key={kind}><MediaPlaceholder compact label={label} kind={kind} /></div>)}</div>
};
