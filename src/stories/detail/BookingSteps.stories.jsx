import { BookingSteps } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Shared/Booking Steps', component: BookingSteps, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'BookingSteps' }) } };
const items = [{ title: 'Send dates', description: 'Share preferred days.' }, { title: 'Confirm details', description: 'The operator checks availability.' }, { title: 'Meet your guide', description: 'Receive the meeting point and final instructions.' }];
export const ObjectPage = { args: { context: 'object', items } };
export const CatalogPage = { args: { context: 'catalog', items } };
