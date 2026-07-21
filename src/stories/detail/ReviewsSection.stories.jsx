import { ObjectReviews, ReviewCard } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const reviews = [{ author: 'Anna', text: 'Clear, patient and perfectly paced.', meta: 'February 2026 · Ski lesson', verified: true }, { author: 'Sam', text: 'A confident first day on skis.', meta: 'January 2026' }, { author: 'Nina', text: 'Thoughtful route choices and very clear communication.', meta: 'March 2026', verified: true }, { author: 'Leo', text: 'Everything was arranged before we arrived.', meta: 'March 2026' }, { author: 'Maya', text: 'A relaxed and memorable mountain day.', meta: 'April 2026', verified: true }];
export default { title: 'Blocks/Detail/Object Reviews', component: ObjectReviews, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectReviews' }) } };
export const Default = { args: { rating: { value: '4.9', label: '38 reviews' }, reviews } };
export const ReviewCardComponent = { name: 'Review Card', parameters: { composition: defineComposition({ root: 'ReviewCard' }) }, render: () => <div style={{ maxWidth: 520 }}><ReviewCard {...reviews[0]} /></div> };
