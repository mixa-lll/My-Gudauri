import { PATTERN_CONTRACTS, TransferObjectPattern, TransferRelatedOffers } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { objectPatternProps } from './ObjectPatternStoryParts';
export default { title: 'Patterns/Object/Transfer', component: TransferObjectPattern, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'TransferObjectPattern' }), docs: { description: { component: `${PATTERN_CONTRACTS.transferObject.task} Sequence: ${PATTERN_CONTRACTS.transferObject.sequence.join(' → ')}.` } } } };
const base = objectPatternProps('transfer');
export const Default = { args: {
  ...base,
  additionalSections: [
    { type: 'transferVehicle', vehicle: { name: 'Comfort minivan', className: 'Minivan', seats: 7, luggage: { large: 7, carryOn: 4 }, skiCapacity: 7, options: ['Winter tyres', 'Climate control'], media: [] } },
    { type: 'transferRoute', title: 'Tbilisi Airport → Gudauri', route: { origin: 'Tbilisi Airport', destination: 'Gudauri', distanceKm: 120, duration: '~2 hours', zoneType: 'Airport' } },
    { type: 'includedServices', kicker: 'One fixed price', title: 'Included in the transfer', includedItems: ['Meet & greet', 'Flight tracking', 'Ski luggage', '60 minutes waiting'], excludedItems: [] },
    { type: 'transferConditions', items: [{ label: 'Waiting', value: '60 minutes after landing' }, { label: 'Stops', value: 'On request' }] },
  ],
  relatedListings: <TransferRelatedOffers sameRoute={[{ slug: 'storybook-suv', name: '4×4 · up to 4 seats', route: 'Gudauri ↔ Tbilisi Airport', price: '220 GEL', tags: ['Winter tyres'] }]} />,
} };
