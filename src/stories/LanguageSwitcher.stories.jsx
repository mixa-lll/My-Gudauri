import { FlagIcon, LanguageSwitcher } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Components/Language Switcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'LanguageSwitcher' }) },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bar', 'stacked'] },
  },
};

export const Bar = { args: { variant: 'bar' } };

export const Stacked = {
  args: { variant: 'stacked' },
  render: (args) => (
    <div className="sb-canvas" style={{ maxWidth: '320px' }}>
      <LanguageSwitcher {...args} />
    </div>
  ),
};

export const Flags = {
  parameters: { composition: defineComposition({ root: 'FlagIcon' }) },
  render: () => (
    <div className="sb-canvas sb-row">
      <FlagIcon country="gb" size="xs" />
      <FlagIcon country="ru" size="sm" />
      <FlagIcon country="ge" size="md" />
      <FlagIcon country="gb" size="lg" />
    </div>
  ),
};
