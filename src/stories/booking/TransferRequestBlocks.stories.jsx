import { useState } from 'react';
import { BookingExtrasPicker, BookingJourneyHeader, BookingPickupChoice } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const POINTS = [
  { id: 1, kind: 'airport', label: 'Tbilisi International Airport', hint: 'We track your flight and wait in arrivals.' },
  { id: 2, kind: 'city', label: 'Any address in Tbilisi', hint: 'Hotel, apartment or a street address in the city.' },
  { id: 3, kind: 'custom', label: 'Another meeting point', hint: 'Describe the place and we will agree the exact spot.' },
];

const EXTRAS = [
  { slug: 'child-seat', label: 'Child seat', description: 'Fitted before pickup. Tell us the age in the comment.', maxQuantity: 4, priceLabel: 'Free' },
  { slug: 'ski-rack', label: 'Ski or snowboard rack', description: 'For boards that do not fit inside.', maxQuantity: 1, priceLabel: 'Free' },
  { slug: 'extra-stop', label: 'Extra stop on the way', description: 'A shop, a viewpoint or a second address.', maxQuantity: 3, priceLabel: 'Free' },
];

function JourneyHarness({ swappable = true }) {
  const [fromGudauri, setFromGudauri] = useState(false);
  return <BookingJourneyHeader
    origin={fromGudauri ? 'Gudauri' : 'Tbilisi'}
    destination={fromGudauri ? 'Tbilisi' : 'Gudauri'}
    meta="~2 hours"
    note="One price in both directions — and the same from the airport or the city."
    onSwap={swappable ? () => setFromGudauri((current) => !current) : undefined}
  />;
}

function PickupHarness() {
  const [value, setValue] = useState(1);
  return <BookingPickupChoice label="Where should we pick you up in Tbilisi?" options={POINTS} value={value} onChange={setValue} />;
}

function ExtrasHarness() {
  const [value, setValue] = useState({ 'child-seat': 1 });
  return <BookingExtrasPicker label="Extras" description="All extras are free — tell us in advance." items={EXTRAS} value={value} onChange={setValue} />;
}

export default {
  title: 'Blocks/Booking/Transfer request',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: { description: { component: 'A transfer route runs both ways at one price and can start at an airport, a city address or an agreed spot. These blocks make direction and meeting point properties of the request instead of separate offers.' } },
  },
};

const composition = (root) => ({ composition: defineComposition({ root }) });

export const JourneyHeader = { name: 'Journey Header', parameters: composition('BookingJourneyHeader'), render: () => <div className="sb-canvas"><JourneyHarness /></div> };
export const JourneyHeaderFixed = { name: 'Journey Header / One-way', parameters: composition('BookingJourneyHeader'), render: () => <div className="sb-canvas"><JourneyHarness swappable={false} /></div> };
export const PickupChoice = { name: 'Pickup Choice', parameters: composition('BookingPickupChoice'), render: () => <div className="sb-canvas" style={{ maxWidth: 560 }}><PickupHarness /></div> };
export const ExtrasPicker = { name: 'Extras Picker', parameters: composition('BookingExtrasPicker'), render: () => <div className="sb-canvas" style={{ maxWidth: 560 }}><ExtrasHarness /></div> };
