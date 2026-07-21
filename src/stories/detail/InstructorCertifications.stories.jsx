import { InstructorCertifications } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const certificates = [
  {
    title: 'APUL D Snowboard Instructor Licence',
    level: '50-hour professional qualification · Issued 25 Feb 2025 · Valid until 25 Feb 2028',
    fileUrl: '/assets/design-3/certificates/mikhail-apul-d.jpg',
  },
  {
    title: 'First aid certificate',
    level: 'Mountain first aid and emergency response',
  },
];

export default {
  title: 'Blocks/Detail/Instructor/Certifications',
  component: InstructorCertifications,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'InstructorCertifications' }) },
};

export const WithMedia = { args: { items: certificates } };
export const TextOnlyFallback = { args: { items: [certificates[1]] } };
