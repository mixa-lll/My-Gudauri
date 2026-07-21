import { Button } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { composition: defineComposition({ root: 'Button' }) },
  args: {
    children: 'Continue',
    variant: 'primary',
    size: 'md'
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'inverse', 'destructive', 'link'] },
    size: { control: 'select', options: ['md', 'lg'] },
    iconLeft: { control: false },
    iconRight: { control: false }
  }
};

export default meta;

export const Playground = {};

export const Variants = {
  render: () => (
    <main className="sb-canvas sb-section">
      <div className="sb-row">
        {['primary', 'secondary', 'ghost', 'destructive', 'link'].map((variant) => <Button variant={variant} key={variant}>{variant}</Button>)}
      </div>
      <div className="sb-inverse-sample"><Button variant="inverse">Inverse on dark</Button></div>
    </main>
  )
};

export const SizesAndIcons = {
  name: 'Sizes and Icons',
  render: () => (
    <main className="sb-canvas sb-row">
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button iconLeft="/assets/design-2/icon-calendar.png">Choose dates</Button>
      <Button variant="secondary" iconRight="/assets/ui-kit/btn-md-arrow-dark.png">View profile</Button>
      <Button iconOnly aria-label="Save">Save</Button>
    </main>
  )
};

export const States = {
  render: () => (
    <main className="sb-canvas sb-section">
      <div className="sb-row"><Button>Ready</Button><Button loading loadingLabel="Submitting">Submit</Button><Button disabled>Disabled</Button></div>
      <Button fullWidth>Full-width action</Button>
    </main>
  )
};
