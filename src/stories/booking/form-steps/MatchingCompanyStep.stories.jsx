import { InstructorMatchCompanyStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Matching Company',
  description: 'Operator-match group type, adults, children and instructor language.',
  category: 'instructor-match-v1',
  stepId: 'instructor-match-company',
  object: null,
  basePrice: 345,
  answers: { companyType: 'Family', adultsCount: 2, childrenCount: 1, languages: ['English'] },
};

export default {
  title: 'Blocks/Booking/Form Steps/Matching Company',
  component: InstructorMatchCompanyStep,
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
