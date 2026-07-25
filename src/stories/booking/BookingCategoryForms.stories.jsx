import { BookingFlow } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import {
  BookingRequestFlow,
  createBookingOffer,
  createInitialBookingAnswers,
  getBookingFlowDefinition,
} from '../../features/booking';

const OBJECTS = {
  instructors: { id: 'instructor:storybook', slug: 'mikhail', name: 'Mikhail Andreev', typeLabel: 'Private instructor', image: '/assets/design-3/avatar-booking.jpg' },
  activities: { id: 'activity:storybook', slug: 'freeride-day', name: 'Freeride day', typeLabel: 'Mountain activity' },
  rental: { id: 'rental:storybook', slug: 'ski-set', name: 'Premium ski set', typeLabel: 'Equipment rental' },
  transfers: { id: 'transfer:storybook', slug: 'airport-transfer', name: 'Tbilisi airport transfer', typeLabel: 'Private transfer' },
  stays: { id: 'stay:storybook', slug: 'mountain-studio', name: 'Mountain studio', typeLabel: 'Stay' },
};

function CategoryFlow({ category, basePrice, answers = {}, object }) {
  const definition = getBookingFlowDefinition(category);
  const offer = createBookingOffer({ definition, object: object ?? OBJECTS[definition.category], basePrice });
  return <BookingRequestFlow
    definition={definition}
    offer={offer}
    initialAnswers={createInitialBookingAnswers(definition, answers)}
    onSubmit={async () => ({ requestCode: 'MG-STORY' })}
    onBack={() => {}}
  />;
}

export default {
  title: 'Patterns/Booking/Category Forms',
  component: BookingFlow,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    composition: defineComposition({ root: 'BookingFlow' }),
    docs: {
      description: {
        component: 'Category-owned BookingFlow compositions. Every form uses the same shell, summary and contact/review contracts, while its registered flow definition selects the relevant content steps.',
      },
    },
  },
};

export const SelectedInstructor = {
  parameters: { docs: { description: { story: 'Dates & time → Company (group size, language and level) → Contact details → Review. No instructor-matching preferences.' } } },
  render: () => <CategoryFlow
    category="instructors"
    basePrice={345}
    answers={{ duration: 4, participants: 3, companyType: 'Family', adultsCount: 2, childrenCount: 1, languages: ['English'], level: 'Intermediate', dateRange: { start: '2026-12-14', end: '2026-12-16' } }}
  />,
};

export const InstructorMatching = {
  parameters: { docs: { description: { story: 'Dates & time → Company → Matching preferences → Contact details.' } } },
  render: () => <CategoryFlow
    category="instructor-match-v1"
    basePrice={345}
    object={null}
    answers={{ dateRange: { start: '2026-12-14', end: '2026-12-16' } }}
  />,
};

export const Activity = {
  parameters: { docs: { description: { story: 'Activity details → Contact details → Review.' } } },
  render: () => <CategoryFlow category="activities" basePrice={120} answers={{ participants: 2, duration: 'Half day' }} />,
};

export const Rental = {
  parameters: { docs: { description: { story: 'Rental details → Contact details → Review.' } } },
  render: () => <CategoryFlow category="rental" basePrice={70} answers={{ days: 3, equipment: 'Ski set' }} />,
};

export const Transfer = {
  parameters: { docs: { description: { story: 'Transfer details → Contact details → Review.' } } },
  render: () => <CategoryFlow category="transfers" basePrice={180} answers={{ passengers: 3, pickup: 'Tbilisi airport' }} />,
};

export const Stay = {
  parameters: { docs: { description: { story: 'Stay details → Contact details → Review.' } } },
  render: () => <CategoryFlow category="stays" basePrice={240} answers={{ nights: 2, guests: 2 }} />,
};
