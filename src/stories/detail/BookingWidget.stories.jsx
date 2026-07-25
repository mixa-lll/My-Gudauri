import { BookingWidget } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Booking Widget', component: BookingWidget, tags: ['autodocs'], decorators: [(Story) => <div style={{ minHeight: 900, maxWidth: 380, marginInline: 'auto' }}><Story /></div>], parameters: { composition: defineComposition({ root: 'BookingWidget' }) } };
export const Instructor = { args: { category: 'instructor', price: 120, availability: 'Available this week', object: { name: 'Mikhail Andreev', typeLabel: 'Private instructor', image: '/assets/design-3/avatar-booking.jpg' } } };
export const Activity = { args: { category: 'activity', price: 380, object: { name: 'Gudauri freeride day', typeLabel: 'Activity' } } };
export const Rental = { args: { category: 'rental', price: 70, object: { name: 'Premium ski set', typeLabel: 'Rental' } } };
export const Transfer = { args: { category: 'transfer', price: 180, object: { name: 'Tbilisi to Gudauri', typeLabel: 'Transfer' } } };
export const Stay = { args: { category: 'stay', price: 240, object: { name: 'Mountain View Apartment', typeLabel: 'Stay' } } };
