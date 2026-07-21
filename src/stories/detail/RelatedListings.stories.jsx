import { RelatedListings } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Related Listings', component: RelatedListings, parameters: { composition: defineComposition({ root: 'RelatedListings' }) } };
export const Default = { args: { items: [{ slug: 'snow-day', title: 'Guided snow day', category: 'Activity', rating: 4.8, reviews: 12, price: '380 GEL', tags: ['Private'] }] } };
