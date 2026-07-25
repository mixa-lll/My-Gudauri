import { BookingFlow } from '../../design-system';
import { BookingRequestFlow, createBookingOffer, createInitialBookingAnswers, getBookingFlowDefinition } from '../../features/booking';
import { defineComposition } from '../../design-system/architecture/registry';

export default {
  title: 'Patterns/Booking Flow',
  component: BookingFlow,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'BookingFlow' }) },
};

export const Default = {
  parameters: { docs: { description: { story: 'The desktop request summary remains visible while the independently composed form steps scroll. The shared time-slot picker owns the single visible “Time per day” label.' } } },
  render: () => {
    const definition = getBookingFlowDefinition('instructors');
    const offer = createBookingOffer({ definition, object: { id: 'instructor:storybook', slug: 'mikhail', name: 'Mikhail Andreev', typeLabel: 'Private instructor', image: '/assets/design-3/avatar-booking.jpg' }, basePrice: 345 });
    return <BookingRequestFlow definition={definition} offer={offer} initialAnswers={createInitialBookingAnswers(definition, {
      duration: 4,
      participants: 2,
      dateRange: { start: '2026-12-14', end: '2026-12-16' },
      timeSlotsByDate: {
        '2026-12-14': ['morning'],
        '2026-12-15': ['midday'],
      },
    })} onSubmit={async () => ({ requestCode: 'MG-STORY' })} onBack={() => {}} />;
  },
};

export const InstructorMatching = {
  render: () => {
    const definition = getBookingFlowDefinition('instructor-match-v1');
    const offer = createBookingOffer({ definition, object: null });
    return <BookingRequestFlow definition={definition} offer={offer} initialAnswers={createInitialBookingAnswers(definition, { dateRange: { start: '2026-12-14', end: '2026-12-17' } })} onSubmit={async () => ({ requestCode: 'MG-MATCH' })} onBack={() => {}} />;
  },
};
