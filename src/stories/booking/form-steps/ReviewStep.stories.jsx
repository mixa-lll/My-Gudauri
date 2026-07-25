import { RequestReviewStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, STORY_OBJECTS, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Request Review',
  description: 'Shared final confirmation block. It does not own a separate sticky row because the right block already owns the total.',
  category: 'instructors',
  stepId: 'request-review',
  object: STORY_OBJECTS.instructor,
  basePrice: 345,
  answers: {
    duration: 4,
    participants: 2,
    dateRange: { start: '2026-12-14', end: '2026-12-16' },
    timeSlotsByDate: { '2026-12-14': ['morning'], '2026-12-15': ['midday'] },
    contactName: 'Anna',
    contactPhone: '+995 555 00 00 00',
  },
};

export default {
  title: 'Blocks/Booking/Form Steps/Request Review',
  component: RequestReviewStep,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    composition: defineComposition({ root: 'BookingFormSection' }),
    docs: { description: { component: `${config.description} The production step owns its expanded content, collapsed summary and sticky-summary contribution.` } },
  },
};
export const Expanded = expandedStory(config);
export const Collapsed = collapsedStory(config);
export const StickySummaryRows = summaryStory(config);
