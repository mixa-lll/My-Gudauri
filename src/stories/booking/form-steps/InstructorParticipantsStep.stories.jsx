import { InstructorParticipantsStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, STORY_OBJECTS, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Instructor Company',
  description: 'Selected-instructor group composition, adults, children, preferred instructor language and shared skill level.',
  category: 'instructors',
  stepId: 'instructor-participants',
  object: STORY_OBJECTS.instructor,
  basePrice: 345,
  answers: {
    participants: 3,
    companyType: 'Family',
    adultsCount: 2,
    childrenCount: 1,
    languages: ['English'],
    level: 'Intermediate',
  },
};

export default {
  title: 'Blocks/Booking/Form Steps/Instructor Company',
  component: InstructorParticipantsStep,
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
