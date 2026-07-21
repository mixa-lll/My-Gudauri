import { FaqAccordion } from '../design-system';
import { FAQ_ITEMS } from '../data/faqItems';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Blocks/Catalog/FAQ Section',
  component: FaqAccordion,
  args: { items: FAQ_ITEMS, initialOpen: 0, kicker: 'Frequently asked questions', title: 'FAQ' },
  parameters: { composition: defineComposition({ root: 'FAQSection' }) }
};

export default meta;
export const FirstItemOpen = { render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const AllClosed = { args: { initialOpen: null }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const CustomHeading = { args: { kicker: 'Before you book', title: 'Useful answers' }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
export const Empty = { args: { items: [] }, render: (args) => <div className="sb-canvas"><FaqAccordion {...args} /></div> };
