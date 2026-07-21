import { AdditionalDetails } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Additional Details', component: AdditionalDetails, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'AdditionalDetails' }) } };
export const Default = { args: { items: [{ label: 'Meeting point', value: 'New Gudauri gondola' }, { label: 'Cancellation', value: '24 hours' }, { label: 'Minimum age', value: '7 years' }] } };
