import { BackLink, MediaPlaceholder, ObjectHero, ObjectHeroGallery, TransferDirectionSwitch } from '../../design-system';
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
export const WithDetails = { name: 'With Detail Control', args: { ...common, variant: 'split', details: <TransferDirectionSwitch start="Tbilisi Airport" finish="Gudauri" />, media: <MediaPlaceholder label="Transfer vehicle" kind="transfer" /> } };
export const Gallery = {
  args: {
    ...common,
    variant: 'centered',
    mediaVariant: 'gallery',
    badges: [{ label: 'Gudauri ↔ Tbilisi Airport', tone: 'accent' }],
    media: <ObjectHeroGallery
      objectName="Comfort sedan"
      objectLabel="Vehicle photos"
      images={[
        { src: '/assets/design-3/hero-main.png', alt: 'Main transfer vehicle view' },
        { src: '/assets/design-3/media-1.jpg', alt: 'Transfer vehicle in the mountains' },
        { src: '/assets/design-3/media-2.jpg', alt: 'Winter road to Gudauri' },
        { src: '/assets/design-3/media-3.jpg', alt: 'Passenger view in Gudauri' },
      ]}
    />,
  },
};
