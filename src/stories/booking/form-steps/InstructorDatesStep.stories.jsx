import { InstructorDatesStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, STORY_OBJECTS, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Selected Instructor Dates & Time',
  description: 'Required multi-day calendar and per-day time slots for a selected instructor.',
  category: 'instructors',
  stepId: 'instructor-dates',
  object: STORY_OBJECTS.instructor,
  basePrice: 345,
  answers: {
    duration: 4,
    participants: 2,
    dateRange: { start: '2026-12-14', end: '2026-12-16' },
    timeSlotsByDate: { '2026-12-14': ['morning'], '2026-12-15': ['midday'] },
  },
};

export default {
  title: 'Blocks/Booking/Form Steps/Selected Instructor Dates & Time',
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
