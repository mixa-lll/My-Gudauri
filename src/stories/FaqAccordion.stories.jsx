import { FaqAccordion } from '../design-system';
import { en } from '../i18n/locales/en';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Blocks/Global/FAQ Section',
  component: FaqAccordion,
  tags: ['autodocs'],
  args: { items: en.faq.items, initialOpen: 0, kicker: 'Frequently asked questions', title: 'FAQ' },
  parameters: {
    composition: defineComposition({ root: 'FaqAccordion' }),
    docs: {
      description: {
        component:
          'The standard FAQ block, used on every page that answers questions. The open item is a white card that lifts off the page; closed rows are flat warm-grey blocks with a dark plus, and the open one turns accent with a single bar. Header follows the standard section heading: accent kicker, display title, supporting copy. The dark `object` variant is the only opt-out.'
      }
    }
  }
};

export default meta;
export const FirstItemOpen = { render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const AllClosed = { args: { initialOpen: null }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const CustomHeading = { args: { kicker: 'Before you book', title: 'Useful answers' }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const ObjectDetail = { args: { variant: 'object', kicker: 'Good to know', title: 'Common questions' }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const Empty = { args: { items: [] }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
