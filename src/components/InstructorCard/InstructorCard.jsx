import { DestinationCard } from '../DestinationCard/DestinationCard';

export function InstructorCard({ instructor, className = '' }) {
  return <DestinationCard item={instructor} section="instructors" className={className} />;
}
