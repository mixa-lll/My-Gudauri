import { BookingFormSection, BookingProgress, BookingRequestSummary, Button, FormField, Input } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default { title: 'Blocks/Booking/Flow Parts', tags: ['autodocs'], parameters: { controls: { disable: true } } };

export const Progress = {
  parameters: { composition: defineComposition({ root: 'BookingProgress' }) },
  render: () => <div className="sb-canvas"><BookingProgress currentStep={1} steps={[{ id: 'schedule', label: 'Schedule' }, { id: 'participants', label: 'Participants' }, { id: 'contact', label: 'Contact' }, { id: 'review', label: 'Review' }]} /></div>,
};

export const FormSection = {
  parameters: { composition: defineComposition({ root: 'BookingFormSection' }) },
  render: () => <div className="sb-canvas"><BookingFormSection title="Contact details" description="We use these details only for this request." actions={<><Button variant="secondary">Back</Button><Button>Continue</Button></>}><FormField label="Name" required><Input /></FormField></BookingFormSection></div>,
};

export const Validation = {
  parameters: { composition: defineComposition({ root: 'BookingFormSection' }) },
  render: () => <div className="sb-canvas"><BookingFormSection title="Contact details" error="Add your name and phone."><FormField label="Name" error="Name is required" required><Input /></FormField></BookingFormSection></div>,
};

export const CompletedStep = {
  parameters: { composition: defineComposition({ root: 'BookingFormSection' }) },
  render: () => <div className="sb-canvas"><BookingFormSection compact stepNumber={1} title="When would you like to go?" summary="14–16 December · Morning" onEdit={() => {}} /></div>,
};

export const RequestSummary = {
  parameters: { composition: defineComposition({ root: 'BookingRequestSummary' }) },
  render: () => <div style={{ maxWidth: 407 }}><BookingRequestSummary object={{ name: 'Mikhail Andreev', typeLabel: 'Private instructor', image: '/assets/design-3/avatar-booking.jpg' }} rows={[{ label: 'Date', value: '12 February' }, { label: 'Duration', value: '4 hours' }, { label: 'Participants', value: '2 people' }]} priceLabel="Estimated lesson total" totalLabel="1,380 GEL" note="No payment now. Availability and final details are confirmed before payment." /></div>,
};

export const MatchingRequestSummary = {
  parameters: { composition: defineComposition({ root: 'BookingRequestSummary' }) },
  render: () => <div style={{ maxWidth: 360 }}><BookingRequestSummary rows={[{ label: '14–16 December', value: '8 h', emphasis: true }, { label: 'People', value: 'Family · 3' }, { label: 'Preferences', value: 'Ski · Medium' }]} priceLabel="for 8 hours" totalLabel="2,760 GEL" note="Same official rate for every instructor." /></div>,
};

export const RequestSummaryWithoutImage = {
  parameters: { composition: defineComposition({ root: 'BookingRequestSummary' }) },
  render: () => <div style={{ maxWidth: 407 }}><BookingRequestSummary object={{ name: 'Long instructor name that wraps naturally', typeLabel: 'Private instructor' }} rows={[{ label: 'Time slots', value: '10:00–12:00, 12:30–14:30' }, { label: 'Duration', value: '8 hours' }, { label: 'Participants', value: 'Not selected', muted: true }]} priceLabel="Estimated lesson total" totalLabel="2,760 GEL" note="No payment now. The manager confirms availability before payment." /></div>,
};
