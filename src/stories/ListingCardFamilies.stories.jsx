import { ActivityCard, DestinationCard, EditorialCard, InstructorCard, RentalCard, StayCard, TransferCard } from '../design-system';
import { getDestination } from '../data/destinations';
import { INSTRUCTORS } from '../data/instructors';
import { defineComposition } from '../design-system/architecture/registry';

const destinationItem = (section) => getDestination(section).items[0];
const story = (root, render) => ({ parameters: { composition: defineComposition({ root }) }, render });

export default {
  title: 'Components/Listing Cards/Families',
  component: ActivityCard,
  tags: ['autodocs']
};

export const Activity = story('ActivityCard', () => <div className="sb-canvas sb-card-preview"><ActivityCard item={destinationItem('activities')} /></div>);
export const Instructor = story('InstructorCard', () => <div className="sb-canvas sb-card-preview"><InstructorCard item={INSTRUCTORS[0]} /></div>);
export const Rental = story('RentalCard', () => <div className="sb-canvas sb-card-preview"><RentalCard item={destinationItem('rental')} /></div>);
export const Transfer = story('TransferCard', () => <div className="sb-canvas sb-card-preview"><TransferCard item={destinationItem('transfers')} /></div>);
export const Stay = story('StayCard', () => <div className="sb-canvas sb-card-preview"><StayCard item={destinationItem('stays')} /></div>);
export const Editorial = story('EditorialCard', () => <div className="sb-canvas sb-card-preview"><EditorialCard item={{ slug: 'snow-guide', title: 'How to plan for fresh snow', category: 'Guide', readingTime: '6 min read', excerpt: 'A practical guide to road and mountain conditions.', image: destinationItem('activities').image }} /></div>);
export const DestinationAdapter = story('DestinationCard', () => <div className="sb-canvas sb-card-preview"><DestinationCard item={destinationItem('activities')} section="activities" /></div>);
