import { BookingConfigurator } from '../../design-system';
import { createBookingOffer, estimateBookingPrice, getBookingFlowDefinition, resolveEntryFields } from '../../features/booking';
import { defineComposition } from '../../design-system/architecture/registry';

function configuratorArgs(category, basePrice, overrides = {}, pricingRules) {
  const definition = getBookingFlowDefinition(category);
  const offer = createBookingOffer({ definition, object: { id: `${definition.category}:storybook`, slug: 'storybook-offer', name: 'Storybook offer' }, basePrice, availability: 'Available this week', pricingRules });
  return {
    title: definition.title,
    priceLabel: definition.priceLabel,
    object: { ...offer.object, typeLabel: category === 'instructors' ? 'Private instructor' : 'Selected offer', image: category === 'instructors' ? '/assets/design-3/avatar-booking.jpg' : undefined },
    fields: resolveEntryFields(definition, offer),
    basePrice,
    availability: offer.availability,
    entryNote: definition.entryNote,
    confirmationText: definition.confirmationText,
    estimate: (answers) => estimateBookingPrice(definition, offer, answers),
    ...overrides,
  };
}

export default {
  title: 'Blocks/Booking/Booking Configurator',
  component: BookingConfigurator,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ minHeight: 760, maxWidth: 380, marginInline: 'auto' }}><Story /></div>],
  parameters: {
    composition: defineComposition({ root: 'BookingConfigurator' }),
    docs: { description: { component: 'Shared object-page request card. On desktop its sticky position preserves the design-system clearance below ObjectStickyNav; on mobile it becomes a bottom action and dialog sheet.' } },
  },
};

export const Instructor = { args: configuratorArgs('instructors', 345) };

/**
 * A full day for a group: the breakdown separates the base rate, the surcharge
 * for extra students and the volume discount, and the note under the total
 * shows what the discounted hour actually costs.
 */
export const VolumePricing = {
  name: 'Volume Pricing',
  args: configuratorArgs('instructors', 345, { defaultValues: { duration: 8, participants: 3 } }),
};

/** An instructor whose CMS ladder is flatter than the platform default. */
export const CustomLadder = {
  name: 'Custom Ladder',
  args: configuratorArgs(
    'instructors',
    345,
    { defaultValues: { duration: 8, participants: 3 } },
    { roundTo: 10, tiers: { duration: [{ from: 1, percent: 0 }, { from: 6, percent: 5 }], participants: [{ from: 2, percent: 50 }, { from: 3, percent: 40 }] } },
  ),
};
export const MobileCollapsed = {
  args: configuratorArgs('instructors', 345),
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  decorators: [(Story) => <div style={{ minHeight: '120vh' }}><Story /></div>],
};
export const Activity = { args: configuratorArgs('activities', 120) };
export const Rental = { args: configuratorArgs('rental', 70) };
export const Transfer = { args: configuratorArgs('transfers', 180) };
export const Stay = { args: configuratorArgs('stays', 240) };
export const OnRequest = { args: configuratorArgs('services', 0, { availability: 'Confirmation required' }) };
export const Disabled = { args: configuratorArgs('instructors', 345, { disabled: true }) };
export const Loading = { args: configuratorArgs('instructors', 345, { loading: true }) };
