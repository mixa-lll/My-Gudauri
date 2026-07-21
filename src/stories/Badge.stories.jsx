import { Badge } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { composition: defineComposition({ root: 'Badge' }) },
  args: { children: 'Verified', size: 'md', tone: 'neutral' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    tone: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'inverse'] },
    mediaOverlay: { control: 'boolean' },
    icon: { control: false },
  },
};

export const Playground = {};

export const Tones = {
  render: () => (
    <main className="sb-canvas sb-section">
      <div className="sb-row">
        {['neutral', 'accent', 'success', 'warning', 'danger', 'inverse'].map((tone) => <Badge tone={tone} key={tone}>{tone}</Badge>)}
      </div>
    </main>
  ),
};

export const WithIcons = {
  name: 'With Icons',
  render: () => (
    <main className="sb-canvas sb-section">
      <p>Icons reinforce recognizable metadata or status. Decorative icons are hidden from assistive technology; the text remains required.</p>
      <div className="sb-row">
        <Badge icon="/assets/design-2/icon-verified.png" tone="success">Verified</Badge>
        <Badge icon="/assets/design-1/icon-ski-pill.png">Ski</Badge>
        <Badge icon="/assets/design-2/icon-snow.png" tone="warning">Snow conditions</Badge>
      </div>
      <div className="sb-media-sample"><Badge icon="/assets/design-1/icon-snowboard-pill.png" mediaOverlay>Snowboard</Badge></div>
    </main>
  ),
};

export const SizesAndMedia = {
  name: 'Sizes and Media Overlay',
  render: () => (
    <main className="sb-canvas sb-section">
      <div className="sb-row"><Badge size="sm">Compact metadata</Badge><Badge>Default metadata</Badge></div>
      <div className="sb-media-sample"><Badge mediaOverlay>Media overlay only</Badge></div>
    </main>
  ),
};
