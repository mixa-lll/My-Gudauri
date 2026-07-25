import { ContactDetailsStep } from '../../../features/booking';
import { defineComposition } from '../../../design-system/architecture/registry';
import { collapsedStory, expandedStory, STORY_OBJECTS, summaryStory } from './BookingStepStoryHarness';

const config = {
  title: 'Contact Details',
  description: 'Shared contact block with copy and optional fields adapted by the form presentation.',
  category: 'instructors',
  stepId: 'contact-details',
  object: STORY_OBJECTS.instructor,
  basePrice: 345,
  answers: {
    contactName: 'Anna',
    contactPhone: '+995 555 00 00 00',
    contactEmail: 'anna@example.com',
    messenger: 'WhatsApp',
  },
};

export default {
  title: 'Blocks/Booking/Form Steps/Contact Details',
  component: ContactDetailsStep,
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
