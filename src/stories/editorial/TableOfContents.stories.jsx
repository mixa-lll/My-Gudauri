import { TableOfContents } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Table of Contents', component: TableOfContents, parameters: { composition: defineComposition({ root: 'TableOfContents' }) } };
export const Default = { args: { items: [{ id: 'arrival', label: 'Arrival' }, { id: 'weather', label: 'Weather' }, { id: 'mountain', label: 'On the mountain' }] } };
