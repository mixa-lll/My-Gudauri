import { ActivityCard, InstructorCard, RentalCard, StayCard, TransferCard } from '../ListingCard/TypedListingCards';

const DESTINATION_CARDS = {
  activities: ActivityCard,
  instructors: InstructorCard,
  rental: RentalCard,
  stays: StayCard,
  transfers: TransferCard,
  services: ActivityCard,
  places: ActivityCard
};

export function DestinationCard({ item, section, featured = false, className = '', ...cardProps }) {
  const Card = DESTINATION_CARDS[section];
  if (!Card) throw new Error(`DestinationCard: unregistered section “${section}”.`);
  const placeholderKind = section === 'services' ? 'service' : section === 'places' ? 'place' : undefined;
  // Remaining props reach the typed card, so a section can pass its own copy
  // (transfer pickup labels, for example) without a new adapter per category.
  return <Card item={item} basePath={`/${section}`} layout={featured ? 'featured' : 'vertical'} className={className} placeholderKind={placeholderKind} {...cardProps} />;
}
