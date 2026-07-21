import { ReviewsSection } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Reviews Section', component: ReviewsSection, parameters: { composition: defineComposition({ root: 'ReviewsSection' }) } };
export const Default = { args: { rating: { value: '4.9', label: '38 reviews' }, reviews: [{ author: 'Anna', text: 'Clear, patient and perfectly paced.', meta: 'February 2026' }, { author: 'Sam', text: 'A confident first day on skis.', meta: 'January 2026' }] } };
