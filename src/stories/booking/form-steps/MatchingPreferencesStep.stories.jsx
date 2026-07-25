import { InstructorMatchPreferencesStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Matching Preferences',
  description: 'Category-only preferences used when the operator chooses an instructor.',
  category: 'instructor-match-v1',
  stepId: 'instructor-match-preferences',
  object: null,
  basePrice: 345,
  answers: { activities: ['Ski'], pace: 'Medium', skillLevel: 'Beginner', budget: 'Mid-range' },
};

export default {
  title: 'Blocks/Booking/Form Steps/Matching Preferences',
  component: InstructorMatchPreferencesStep,
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
