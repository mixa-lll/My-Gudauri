import { InstructorDatesStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Matching Dates & Time',
  description: 'Date range and optional time preferences for operator-assisted instructor matching.',
  category: 'instructor-match-v1',
  stepId: 'instructor-match-dates',
  object: null,
  basePrice: 345,
  answers: {
    dateRange: { start: '2026-12-14', end: '2026-12-16' },
    timeSlotsByDate: { '2026-12-14': ['morning'], '2026-12-15': ['midday'] },
  },
};

export default {
  title: 'Blocks/Booking/Form Steps/Matching Dates & Time',
  component: InstructorDatesStep,
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
