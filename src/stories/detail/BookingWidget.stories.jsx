import { BookingWidget } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Booking Widget', component: BookingWidget, tags: ['autodocs'], decorators: [(Story) => <div style={{ minHeight: 900, maxWidth: 380, marginInline: 'auto' }}><Story /></div>], parameters: { composition: defineComposition({ root: 'BookingWidget' }) } };
export const Instructor = { args: { category: 'instructor', price: 120, availability: 'Available this week' } };
export const Activity = { args: { category: 'activity', price: 380 } };
export const Rental = { args: { category: 'rental', price: 70 } };
export const Transfer = { args: { category: 'transfer', price: 180 } };
export const Stay = { args: { category: 'stay', price: 240 } };
