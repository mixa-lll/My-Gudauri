import { InquiryDetailsStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, STORY_OBJECTS, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Category Inquiry Details',
  description: 'Shared inquiry body whose extra fields are supplied by the activity, rental, transfer, stay, service or place contract.',
  category: 'activities',
  stepId: 'activity-details',
  object: STORY_OBJECTS.activity,
  basePrice: 120,
  answers: { participants: 2, duration: 'Half day', date: '2026-12-14', details: 'Morning is preferred.' },
};

export default {
  title: 'Blocks/Booking/Form Steps/Category Inquiry Details',
  component: InquiryDetailsStep,
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
