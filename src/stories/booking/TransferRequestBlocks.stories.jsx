import { useState } from 'react';
import { BookingJourneyHeader, BookingOptionCards, BookingPointDetails, BookingRequestSent, Button, Checkbox, FormField, Input } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const DEPARTURE_TILES = [
  { id: 'airport', kind: 'airport', label: 'Airport', hint: 'Flight tracked' },
  { id: 'city', kind: 'city', label: 'City', hint: 'Address or hotel' },
];

const ARRIVAL_TILES = [
  { id: 'hotel', kind: 'hotel', label: 'Hotel or apartment', hint: 'By name' },
  { id: 'spot', kind: 'spot', label: 'Known spot', hint: 'Shop, lift, map point' },
];

const OPTIONS = [
  { slug: 'ski-rack', label: 'Ski or snowboard gear', priceLabel: 'Free', glyph: 'hotel' },
  { slug: 'extra-stop', label: 'Extra stop', priceLabel: 'from 20 GEL', glyph: 'spot' },
  { slug: 'night-pickup', label: 'Night pickup', priceLabel: 'from 50 GEL', glyph: 'hotel' },
  { slug: 'special-item', label: 'Special item', priceLabel: 'Free', glyph: 'spot' },
];

function JourneyHarness({ swappable = true }) {
  const [fromGudauri, setFromGudauri] = useState(false);
  return <BookingJourneyHeader
    fromLabel="Departure point"
    toLabel="Arrival point"
    origin={fromGudauri ? 'Gudauri' : 'Tbilisi'}
    destination={fromGudauri ? 'Tbilisi' : 'Gudauri'}
    hint="Fixed direction from the offer you picked. Use the swap button to reverse it."
    onSwap={swappable ? () => setFromGudauri((current) => !current) : undefined}
  />;
}

function PointHarness() {
  const [kind, setKind] = useState('airport');
  const [detail, setDetail] = useState('TK 382');
  const [later, setLater] = useState(false);
  return <BookingPointDetails
    badge="A"
    title="Departure — Tbilisi"
    question="What kind of place are we picking you up from?"
    options={DEPARTURE_TILES}
    value={kind}
    onChange={setKind}
  >
    <FormField label={kind === 'airport' ? 'Flight number' : 'Address'} hint="So the driver waits if the flight is delayed.">
      <Input value={detail} disabled={later} onChange={(event) => setDetail(event.target.value)} />
    </FormField>
    <Checkbox label="I’ll send the flight number later" checked={later} onChange={(event) => setLater(event.target.checked)} />
  </BookingPointDetails>;
}

function ArrivalHarness() {
  const [kind, setKind] = useState('hotel');
  return <BookingPointDetails badge="B" title="Arrival — Gudauri" question="Where should the driver drop you off?" options={ARRIVAL_TILES} value={kind} onChange={setKind} />;
}

function OptionsHarness() {
  const [value, setValue] = useState({ 'ski-rack': 1 });
  return <BookingOptionCards label="Options — optional" items={OPTIONS} value={value} onChange={setValue} />;
}

export default {
  title: 'Blocks/Booking/Transfer request',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: { description: { component: 'The transfer request asks where and when first, then keeps every address, flight number and add-on optional, because a guest who has not booked a hotel yet must still be able to send a request.' } },
  },
};

const composition = (root) => ({ composition: defineComposition({ root }) });

export const JourneyHeader = { name: 'Journey Header', parameters: composition('BookingJourneyHeader'), render: () => <div className="sb-canvas"><JourneyHarness /></div> };
export const JourneyHeaderFixed = { name: 'Journey Header / One-way', parameters: composition('BookingJourneyHeader'), render: () => <div className="sb-canvas"><JourneyHarness swappable={false} /></div> };
export const PointDetails = { name: 'Point Details', parameters: composition('BookingPointDetails'), render: () => <div className="sb-canvas" style={{ maxWidth: 620 }}><PointHarness /></div> };
export const PointDetailsPlain = { name: 'Point Details / No reveal', parameters: composition('BookingPointDetails'), render: () => <div className="sb-canvas" style={{ maxWidth: 620 }}><ArrivalHarness /></div> };
export const OptionCards = { name: 'Option Cards', parameters: composition('BookingOptionCards'), render: () => <div className="sb-canvas" style={{ maxWidth: 620 }}><OptionsHarness /></div> };
export const RequestSent = {
  name: 'Request Sent',
  parameters: composition('BookingRequestSent'),
  render: () => <div className="sb-canvas" style={{ maxWidth: 620 }}><BookingRequestSent
    title="Your transfer request is sent"
    requestCode="MG-51043"
    referenceLabel="Request ID"
    saveNote="Please save your request ID — useful if you contact support."
    nextTitle="What happens next"
    steps={[
      'The operator checks the vehicle and luggage capacity.',
      'Gets in touch through the messenger you chose.',
      'Confirms the address, time and flight number if they are still blank.',
      'Sends the confirmation and a payment link.',
    ]}
    action={<Button variant="secondary">Back to the offer</Button>}
  /></div>,
};
