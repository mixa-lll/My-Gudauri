import { InstructorBookingSteps } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default {
  title: 'Blocks/Detail/Instructor/Booking Steps',
  component: InstructorBookingSteps,
  tags: ['autodocs'],
  parameters: {
    composition: defineComposition({ root: 'InstructorBookingSteps' }),
    docs: { description: { component: 'Category-owned static booking explanation. It is rendered by InstructorObjectPattern and is not populated from an individual instructor record.' } },
  },
};

export const Default = {};
