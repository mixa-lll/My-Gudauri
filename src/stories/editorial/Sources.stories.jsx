import { Sources } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Editorial/Sources', component: Sources, parameters: { composition: defineComposition({ root: 'Sources' }) } };
export const Default = { args: { items: [{ label: 'Georgia road department', href: 'https://example.com/roads' }, { label: 'Mountain safety guidance', href: 'https://example.com/safety' }] } };
