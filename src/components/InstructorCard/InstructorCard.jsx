import {
  ListingCard,
  ListingCardPill,
  ListingCardRating
} from '../ListingCard/ListingCard';

export function InstructorCard({ instructor, className = '' }) {
  return (
    <ListingCard
      className={className}
      variant="instructor"
      to={`/instructors/${instructor.slug}`}
      image={instructor.image}
      imageAlt={`${instructor.name}, instructor in Gudauri`}
      title={instructor.name}
      description={instructor.description}
      mediaTop={
        <>
          {instructor.languages.map((language) => (
            <ListingCardPill key={language.code} title={language.name}>
              {language.code}
            </ListingCardPill>
          ))}
        </>
      }
      mediaBottom={
        <>
          {instructor.sports.map((sport) => (
            <ListingCardPill icon={sport.icon} key={sport.slug}>
              {sport.name}
            </ListingCardPill>
          ))}
        </>
      }
      footer={
        <ListingCardRating
          rating={instructor.rating.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          reviews={`${instructor.reviews} reviews`}
        />
      }
    />
  );
}
