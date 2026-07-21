import { BackLink, MediaPlaceholder, ObjectHero } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const common = { breadcrumbs: <BackLink to="/instructors">Back to instructors</BackLink>, title: 'Build confidence on the mountain', description: 'A focused lesson with a verified local instructor.', badges: ['Ski', 'Snowboard'], rating: { value: 4.9, reviewsLabel: '60 reviews', href: '#reviews' } };

export default {
  title: 'Blocks/Detail/Object Hero',
  component: ObjectHero,
  tags: ['autodocs'],
  parameters: {
    composition: defineComposition({ root: 'ObjectHero' }),
    docs: { description: { component: 'Shared object-page hero. Its outer content and media edges inherit the same detail-container lines used by the object pattern below.' } },
  },
};
export const Split = { args: { ...common, variant: 'split', media: <MediaPlaceholder label="Instructor on the mountain" /> } };
export const Centered = { args: { ...common, variant: 'centered', media: <MediaPlaceholder label="Mountain experience" /> } };
export const MediaFirst = { name: 'Media First', args: { ...common, variant: 'media-first', media: <MediaPlaceholder label="Mountain route" /> } };
export const WithoutMedia = { name: 'Without Media', args: { ...common, variant: 'split', media: undefined } };
