import { ListingCardAction, ListingCardPrice, ListingCardRating, StarRating } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Components/Listing Cards/Elements',
  component: ListingCardRating,
  tags: ['autodocs']
};

export const Rating = { parameters: { composition: defineComposition({ root: 'Rating' }) }, render: () => <div className="sb-canvas sb-row"><ListingCardRating rating="4.9" reviews="38 reviews" /><ListingCardRating rating="5.0" reviews="8+ years" /><StarRating value="3.6" /></div> };
export const Price = { parameters: { composition: defineComposition({ root: 'Price' }) }, render: () => <div className="sb-canvas sb-row"><ListingCardPrice price="240 GEL" suffix="per guest" /><ListingCardPrice price="1,250 GEL" suffix="per private group" /></div> };
export const Action = { parameters: { composition: defineComposition({ root: 'ListingCardFrame' }) }, render: () => <div className="sb-canvas sb-card-preview"><ListingCardAction>View details</ListingCardAction></div> };
