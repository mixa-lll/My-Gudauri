import { ObjectRelatedListings } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Related Listings', component: ObjectRelatedListings, tags: ['autodocs'], parameters: { layout: 'padded', composition: defineComposition({ root: 'ObjectRelatedListings' }) } };
export const Default = { args: { items: [{ slug: 'snow-day', title: 'Guided snow day', category: 'Activity', rating: 4.8, reviews: 12, price: '380 GEL', tags: ['Private'] }, { slug: 'first-turns', title: 'First turns', category: 'Lesson', rating: 4.9, reviews: 20, price: '240 GEL', tags: ['Beginner'] }, { slug: 'sunset', title: 'Sunset route', category: 'Activity', rating: 4.7, reviews: 9, price: '320 GEL', tags: ['Private'] }] } };
