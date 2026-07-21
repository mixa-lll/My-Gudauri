import { MediaPlaceholder } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Components/Media Placeholder',
  component: MediaPlaceholder,
  parameters: { composition: defineComposition({ root: 'MediaPlaceholder' }) },
  args: { label: 'Gudauri mountain view', compact: false }
};

export default meta;
export const Playground = { render: (args) => <div className="sb-canvas" style={{ height: 460 }}><MediaPlaceholder {...args} /></div> };

export const ToneVariants = {
  render: () => <div className="sb-canvas sb-grid sb-grid--cards">{['Ski school', 'Mountain transfer', 'Local restaurant', 'Gudauri chalet'].map((label) => <div style={{ height: 300 }} key={label}><MediaPlaceholder label={label} /></div>)}</div>
};

export const Compact = {
  render: () => <div className="sb-canvas sb-grid">{['Instructor', 'Activity', 'Apartment'].map((label) => <div style={{ height: 180 }} key={label}><MediaPlaceholder compact label={label} /></div>)}</div>
};
