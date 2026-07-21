import { ListingCard, ListingCardAction, ListingCardPill, ListingCardPrice, ListingCardRating } from '../design-system';
import { getDestination } from '../data/destinations';
import { defineComposition } from '../design-system/architecture/registry';

const activity = getDestination('activities').items[0];

function CardExample({ layout = 'vertical' }) {
  return <ListingCard to={`/activities/${activity.slug}`} layout={layout} image={activity.image} imageAlt={activity.name} mediaTop={<ListingCardPill>{activity.category}</ListingCardPill>} mediaBottom={activity.tags.map((tag) => <ListingCardPill key={tag}>{tag}</ListingCardPill>)} title={activity.name} description={activity.description} footer={<><ListingCardRating rating={activity.rating} reviews={activity.reviews} /><ListingCardPrice price={activity.price} suffix={activity.priceSuffix} /></>} />;
}

export default {
  title: 'Components/Listing Cards/Foundation',
  component: ListingCard,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'ListingCardFrame' }) }
};

export const Vertical = { render: () => <div className="sb-canvas sb-card-preview"><CardExample /></div> };
export const Horizontal = { render: () => <div className="sb-canvas"><CardExample layout="horizontal" /></div> };
export const Featured = { render: () => <div className="sb-canvas"><CardExample layout="featured" /></div> };
