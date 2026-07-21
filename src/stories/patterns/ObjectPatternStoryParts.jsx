import { BookingSteps, BookingWidget, FaqAccordion, ObjectDescription, ObjectMainTags, ObjectRelatedListings, ObjectReviews } from '../../design-system';

const facts = [{ label: 'Duration', value: '2–6 hours' }, { label: 'Languages', value: 'EN · RU · KA' }, { label: 'Group', value: '1–6 guests' }, { label: 'Season', value: 'All winter' }];
const reviews = [{ author: 'Anna', text: 'Clear, patient and perfectly paced.', meta: 'February 2026', verified: true }, { author: 'Sam', text: 'A confident first day on skis.', meta: 'January 2026' }];
const steps = [{ title: 'Send your request', description: 'Choose the primary details and leave your contact.' }, { title: 'We confirm availability', description: 'A local manager checks the object and final price.' }, { title: 'Receive a secure payment link', description: 'Payment happens only after the details are confirmed.' }];
const faq = [{ question: 'Is the price final?', answer: 'The widget shows an estimate. We confirm the final total before payment.' }, { question: 'Can I change my request?', answer: 'Yes. Reply to the manager before the booking is confirmed.' }];
const related = [{ slug: 'snow-day', title: 'Guided snow day', category: 'Activity', rating: 4.8, reviews: 12, price: '380 GEL', tags: ['Private'] }, { slug: 'first-turns', title: 'First turns in Gudauri', category: 'Lesson', rating: 4.9, reviews: 22, price: '240 GEL', tags: ['Beginner'] }];

export function objectPatternProps(category) {
  return {
    mainTags: <ObjectMainTags items={facts} />,
    objectDescription: <ObjectDescription tags={['Private', 'Beginner friendly', 'Equipment advice', 'English']}><p>This common content column uses the same heading anatomy and readable measure on every object page.</p><p>Only data and registered category sections change.</p></ObjectDescription>,
    reviews: <ObjectReviews rating={{ value: 4.9, label: '38 reviews' }} reviews={reviews} />,
    bookingSteps: <BookingSteps context="object" items={steps} />,
    relatedListings: <ObjectRelatedListings items={[...related, { ...related[0], slug: 'snow-evening', title: 'Evening snow tour' }]} />,
    faqSection: <FaqAccordion title="Common questions" kicker="Good to know" items={faq} />,
    bookingWidget: <BookingWidget category={category} price={category === 'rental' ? 70 : category === 'stay' ? 240 : 120} availability="Available this week" />,
    additionalSections: category === 'instructor' ? [{ type: 'certifications', items: ['Verified instructor', 'First aid'] }] : category === 'activity' ? [{ type: 'routeProgram', items: [{ title: 'Meet', description: 'Confirm equipment and conditions.' }, { title: 'Go', description: 'Follow the agreed route.' }] }] : [],
  };
}
