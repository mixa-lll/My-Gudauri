import { useState } from 'react';
import { Pill } from '../design-system';

const meta = {
  title: 'Deprecated/Pill Compatibility',
  component: Pill,
  args: { children: 'Legacy label', size: 'md', tone: 'light' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['light', 'soft', 'outline', 'glass', 'dark', 'accent'] },
    as: { control: false },
    icon: { control: false }
  }
};

export default meta;
export const Playground = {};

export const AllTonesAndSizes = {
  render: () => (
    <main className="sb-canvas">
      {['sm', 'md', 'lg'].map((size) => (
        <section className="sb-section" key={size}>
          <h2>{size.toUpperCase()}</h2>
          <div className="sb-row">
            {['light', 'soft', 'outline', 'glass', 'dark', 'accent'].map((tone) => <Pill size={size} tone={tone} key={tone}>{tone}</Pill>)}
          </div>
        </section>
      ))}
    </main>
  )
};

export const WithIcon = {
  render: () => <div className="sb-canvas sb-row"><Pill icon="/assets/design-2/icon-ski.png">Ski</Pill><Pill tone="glass" icon="/assets/design-2/icon-snow.png">Snowboard</Pill></div>
};

function InteractivePills() {
  const [selected, setSelected] = useState('Ski');
  return <div className="sb-row">{['Ski', 'Snowboard', 'Freeride'].map((item) => <Pill as="button" type="button" tone={selected === item ? 'dark' : 'light'} aria-pressed={selected === item} onClick={() => setSelected(item)} key={item}>{item}</Pill>)}</div>;
}

export const Interactive = { render: () => <div className="sb-canvas"><InteractivePills /></div> };
