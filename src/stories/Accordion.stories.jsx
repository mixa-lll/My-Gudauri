import { Accordion, AccordionItem } from '../design-system';
import { FAQ_ITEMS } from '../data/faqItems';
import { defineComposition } from '../design-system/architecture/registry';

export default { title: 'Components/Accordion', component: Accordion, tags: ['autodocs'], args: { items: FAQ_ITEMS.slice(0, 3), initialOpen: 0 }, parameters: { composition: defineComposition({ root: 'Accordion' }) } };
export const Default = {};
export const Collapsed = { args: { initialOpen: null } };
export const Item = { parameters: { composition: defineComposition({ root: 'AccordionItem' }) }, render: () => <AccordionItem id="standalone" question="Can I book online?" answer="Yes, after availability is confirmed." open onToggle={() => {}} /> };
export const LongContent = { args: { initialOpen: 0, items: [{ question: 'Can I change or cancel a request after the booking manager confirms availability?', answer: 'Yes. Contact the booking manager as early as possible. The exact cancellation terms depend on the selected service and are confirmed before payment.' }, ...FAQ_ITEMS.slice(1, 3)] } };
