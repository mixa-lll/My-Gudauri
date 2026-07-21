import { ActivityCard, DestinationCard, EditorialCard, InstructorCard, ListingCard, ListingCardAction, ListingCardPill, ListingCardPrice, ListingCardRating, RentalCard, TransferCard } from '../design-system';
import { getDestination } from '../data/destinations';
import { INSTRUCTORS } from '../data/instructors';
import { defineComposition } from '../design-system/architecture/registry';

const activity = getDestination('activities').items[0];

export default { title: 'Components/Listing Cards', component: ListingCard, parameters: { composition: defineComposition({ root: 'ListingCardFrame' }) } };

export const Base = {
  render: () => (
    <div className="sb-canvas sb-grid sb-grid--cards">
      <ListingCard
        to="/activities/kazbegi-gergeti"
        image={activity.image}
        imageAlt={activity.name}
        mediaTop={<ListingCardPill>{activity.category}</ListingCardPill>}
        mediaBottom={activity.tags.map((tag) => <ListingCardPill key={tag}>{tag}</ListingCardPill>)}
        title={activity.name}
        description={activity.description}
        footer={<><ListingCardRating rating={activity.rating} reviews={activity.reviews} /><ListingCardPrice price={activity.price} suffix={activity.priceSuffix} /></>}
      />
      <ListingCard to="/example" variant="featured" title="Featured mountain guide" description="A featured card can carry stronger media and a direct action." footer={<ListingCardAction>Read the guide</ListingCardAction>} />
    </div>
  )
};

export const RatingComponent = { parameters: { composition: defineComposition({ root: 'Rating' }) }, render: () => <div className="sb-canvas"><ListingCardRating rating="4.9" reviews="38 reviews" /></div> };
export const PriceComponent = { parameters: { composition: defineComposition({ root: 'Price' }) }, render: () => <div className="sb-canvas"><ListingCardPrice price="240 GEL" suffix="2 hours" /></div> };

export const DestinationVariants = {
  parameters: { composition: defineComposition({ root: 'DestinationCard' }) },
  render: () => <div className="sb-canvas sb-grid sb-grid--cards"><DestinationCard item={activity} section="activities" /><DestinationCard item={getDestination('rental').items[0]} section="rental" featured /><DestinationCard item={getDestination('stays').items[0]} section="stays" /></div>
};

export const InstructorVariants = {
  parameters: { composition: defineComposition({ root: 'InstructorCard' }) },
  render: () => <div className="sb-canvas sb-grid sb-grid--cards">{INSTRUCTORS.slice(0, 3).map((instructor) => <InstructorCard instructor={instructor} key={instructor.slug} />)}</div>
};

export const TypedFamilies = { render: () => <div className="sb-canvas sb-grid sb-grid--cards"><ActivityCard item={{ slug: 'ski-tour', title: 'Ski tour', category: 'Winter', rating: 4.9, reviews: 28, price: '280 GEL', priceSuffix: 'per group', tags: ['6 hours', 'Advanced'] }} /><RentalCard item={{ slug: 'touring-set', title: 'Touring ski set', equipmentType: 'Ski rental', price: '90 GEL', unit: 'per day', availability: 'Available today' }} /><TransferCard item={{ slug: 'airport', title: 'Tbilisi airport transfer', route: 'Tbilisi → Gudauri', duration: '2.5 hours', vehicle: '4×4', price: '220 GEL' }} /><EditorialCard item={{ slug: 'snow-guide', title: 'How to plan for fresh snow', category: 'Guide', readingTime: '6 min read', excerpt: 'A practical guide to road and mountain conditions.' }} /></div> };
TypedFamilies.parameters = { composition: defineComposition({ root: 'ActivityCard' }) };

export const MissingMediaAndLongContent = {
  render: () => <div className="sb-canvas sb-grid sb-grid--cards"><ListingCard to="/missing" title="Offer without published photography" placeholderLabel="Photography coming soon" description="The card falls back to the branded media placeholder when an image is missing." footer={<ListingCardAction />} /><ListingCard to="/long" image={activity.image} imageAlt="Gudauri" title="A deliberately long listing title that wraps across several lines" description="Long descriptions remain readable and reveal how the current component behaves with less controlled CMS content and narrow cards." mediaTop={<ListingCardPill>Long label</ListingCardPill>} footer={<ListingCardPrice price="1,250 GEL" suffix="per private group" />} /></div>
};
