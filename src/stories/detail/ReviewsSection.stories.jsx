import { ObjectReviews, ReviewCard } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const reviews = [
  { author: 'Anna Petrova', text: 'Clear, patient and perfectly paced. Every explanation was easy to follow and the lesson felt adapted to our confidence on the mountain.', dateLabel: 'February 2026', contextLabel: 'Ski lesson', rating: 5 },
  { author: 'Sam', text: 'A confident first day on skis.', dateLabel: 'January 2026', contextLabel: 'First lesson', rating: 5 },
  { author: 'Nina Volkova', text: 'Thoughtful route choices and very clear communication. We always understood what the next exercise was for, and the instructor adjusted the terrain whenever one of us needed more time. By the end of the morning we could repeat the same turns independently and felt much more comfortable continuing on our own.', dateLabel: 'March 2026', contextLabel: 'Private lesson', rating: 5 },
  { author: 'Leo Martin', text: 'Everything was arranged before we arrived and the meeting point was very easy to find.', dateLabel: 'March 2026', contextLabel: 'Snowboard lesson', rating: 4 },
  { author: 'Maya Chen', text: 'A relaxed and memorable mountain day with practical advice we continued using throughout the trip.', dateLabel: 'April 2026', contextLabel: 'Ski lesson', rating: 5 },
  { author: 'Daniel Moore', text: 'Calm teaching, useful exercises and a good balance between challenge and support.', dateLabel: 'April 2026', contextLabel: 'Technique session', rating: 5 },
];
export default { title: 'Blocks/Detail/Object Reviews', component: ObjectReviews, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'ObjectReviews' }) } };
export const Default = { args: { rating: { value: '4.9', label: '38 reviews' }, reviews } };
export const ReviewCardComponent = { name: 'Review Card', parameters: { composition: defineComposition({ root: 'ReviewCard' }) }, render: () => <div style={{ maxWidth: 520 }}><ReviewCard {...reviews[0]} /></div> };
export const LongReview = { args: { rating: { value: '4.9', label: '6 reviews' }, reviews }, parameters: { docs: { description: { story: 'Long preview text can expand inline; the large action opens the complete scrollable review collection.' } } } };
export const Empty = { args: { rating: { value: '0', label: 'No reviews' }, reviews: [] } };
