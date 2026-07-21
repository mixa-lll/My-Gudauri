import {
  ListingCard,
  ListingCardAction,
  ListingCardPill,
  ListingCardPrice,
  ListingCardRating
} from '../ListingCard/ListingCard';

export function DestinationCard({ item, section, featured = false, className = '' }) {
  const isInstructor = section === 'instructors';
  const instructorFocus = item.cardFocus || item.tags?.filter((tag) => !/private|intermediate|advanced/i.test(tag)).slice(0, 2).join(' · ') || item.description;

  return (
    <ListingCard
      variant={isInstructor ? 'instructor' : featured ? 'featured' : 'default'}
      className={className}
      to={`/${section}/${item.slug}`}
      image={item.image}
      imageAlt={isInstructor ? `${item.name}, instructor in Gudauri` : item.name}
      title={item.name}
      titleMeta={isInstructor && item.certificate ? <span className="listing-card__verified" title={item.certificate}>Verified</span> : null}
      description={isInstructor ? instructorFocus : item.description}
      mediaTop={isInstructor ? item.languages.map((language) => (
        <ListingCardPill key={language.code} title={language.name}>{language.code}</ListingCardPill>
      )) : <ListingCardPill>{item.category}</ListingCardPill>}
      mediaBottom={isInstructor ? item.sports.map((sport) => (
        <ListingCardPill icon={sport.icon} key={sport.slug}>{sport.name}</ListingCardPill>
      )) : item.tags.slice(0, 3).map((tag) => <ListingCardPill key={tag}>{tag}</ListingCardPill>)}
      footer={
        isInstructor ? (
          <>
            <ListingCardRating
              rating={item.rating.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              reviews={`${item.experienceYears || 1}+ years`}
            />
            <ListingCardAction>View profile</ListingCardAction>
          </>
        ) : <>
          <ListingCardRating rating={item.rating} reviews={item.reviews} />
          <ListingCardPrice price={item.price} suffix={item.priceSuffix} />
        </>
      }
    />
  );
}
