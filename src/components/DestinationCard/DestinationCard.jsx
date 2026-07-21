import { ActivityCard, InstructorCard, RentalCard, StayCard, TransferCard } from '../ListingCard/TypedListingCards';

const DESTINATION_CARDS = {
  activities: ActivityCard,
  instructors: InstructorCard,
  rental: RentalCard,
  stays: StayCard,
  transfers: TransferCard
};

export function DestinationCard({ item, section, featured = false, className = '' }) {
  const Card = DESTINATION_CARDS[section];
  if (!Card) throw new Error(`DestinationCard: unregistered section “${section}”.`);
  return <Card item={item} layout={featured ? 'featured' : 'vertical'} className={className} />;
}
