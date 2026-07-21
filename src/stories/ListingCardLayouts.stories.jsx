import { ActivityCard, ListingCardGrid } from '../design-system';
import { getDestination } from '../data/destinations';
import { defineComposition } from '../design-system/architecture/registry';

const activities = getDestination('activities').items.slice(0, 4);
const cards = (count) => activities.slice(0, count).map((item) => <ActivityCard item={item} key={item.slug} />);

export default {
  title: 'Components/Listing Cards/Layouts',
  component: ListingCardGrid,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'ListingCardGrid' }) }
};

export const TwoColumns = { render: () => <div className="sb-canvas"><ListingCardGrid columns={2}>{cards(2)}</ListingCardGrid></div> };
export const ThreeColumns = { render: () => <div className="sb-canvas"><ListingCardGrid columns={3}>{cards(3)}</ListingCardGrid></div> };
export const FourColumns = { render: () => <div className="sb-canvas"><ListingCardGrid columns={4}>{cards(4)}</ListingCardGrid></div> };
export const ResponsiveAuto = { render: () => <div className="sb-canvas"><ListingCardGrid columns="auto">{cards(4)}</ListingCardGrid></div> };
