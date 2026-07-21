import { DetailBookingSteps } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Detail/Booking Steps', component: DetailBookingSteps, parameters: { composition: defineComposition({ root: 'DetailBookingSteps' }) } };
export const Default = { args: { items: [{ title: 'Send dates', description: 'Share preferred days.' }, { title: 'Confirm details', description: 'The operator checks availability.' }, { title: 'Meet your guide', description: 'Receive the meeting point and final instructions.' }] } };
