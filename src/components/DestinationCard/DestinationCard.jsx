import {
  ListingCard,
  ListingCardPill,
  ListingCardPrice,
  ListingCardRating
} from '../ListingCard/ListingCard';

export function DestinationCard({ item, section, featured = false }) {
  return (
    <ListingCard
      variant={featured ? 'featured' : 'default'}
      to={`/${section}/${item.slug}`}
      image={item.image}
      imageAlt={item.name}
      title={item.name}
      description={item.description}
      mediaTop={<ListingCardPill>{item.category}</ListingCardPill>}
      mediaBottom={item.tags.slice(0, 3).map((tag) => <ListingCardPill key={tag}>{tag}</ListingCardPill>)}
      footer={
        <>
          <ListingCardRating rating={item.rating} reviews={item.reviews} />
          <ListingCardPrice price={item.price} suffix={item.priceSuffix} />
        </>
      }
    />
  );
}
