import { ListingCard, ListingCardAction, ListingCardPill, ListingCardPrice } from '../design-system';
import { getDestination } from '../data/destinations';
import { defineComposition } from '../design-system/architecture/registry';

const activity = getDestination('activities').items[0];

export default {
  title: 'Components/Listing Cards/States',
  component: ListingCard,
  tags: ['autodocs'],
  parameters: { composition: defineComposition({ root: 'ListingCardFrame' }) }
};

export const MissingMedia = { render: () => <div className="sb-canvas sb-card-preview"><ListingCard to="/missing" title="Offer without published photography" placeholderLabel="Photography coming soon" description="A consistent branded placeholder preserves the same card geometry." footer={<ListingCardAction />} /></div> };
export const LongContent = { render: () => <div className="sb-canvas sb-card-preview"><ListingCard to="/long" image={activity.image} imageAlt="Gudauri" title="A deliberately long listing title that wraps across several lines" description="Long descriptions remain readable and demonstrate the controlled two-line excerpt used for less predictable CMS content." mediaTop={<ListingCardPill>A long but valid category label</ListingCardPill>} footer={<ListingCardPrice price="1,250 GEL" suffix="per private group" />} /></div> };
export const BrokenMediaFallback = { render: () => <div className="sb-canvas sb-card-preview"><ListingCard to="/broken" image="/assets/does-not-exist.jpg" imageAlt="Unavailable media" title="Media fallback after an image error" description="The same placeholder is used when a published image cannot load." footer={<ListingCardAction />} /></div> };
