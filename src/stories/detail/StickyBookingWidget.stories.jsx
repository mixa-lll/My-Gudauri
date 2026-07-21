import { StickyBookingWidget } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Sticky Booking Widget', component: StickyBookingWidget, decorators: [(Story) => <div style={{ minHeight: 420, display: 'grid', alignItems: 'end' }}><Story /></div>], parameters: { composition: defineComposition({ root: 'StickyBookingWidget' }) } };
export const Default = { args: { price: '240 GEL', suffix: '2 hours', availability: 'Available this week' } };
