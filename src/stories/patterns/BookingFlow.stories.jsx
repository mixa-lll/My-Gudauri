import { BookingFlow } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

export default {
  title: 'Patterns/Booking Flow',
  component: BookingFlow,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'BookingFlow' }) },
};

export const Default = {
  render: () => (
    <BookingFlow
      progress={<div className="sb-sample">Step 2 of 4</div>}
      step={<div className="sb-control-cell"><h2>Group details</h2><p>Production forms compose here.</p></div>}
      summary={<div className="sb-control-cell"><h2>Your request</h2><p>12 February · 2 guests</p></div>}
      actions={<div className="sb-row"><button>Back</button><button>Continue</button></div>}
    />
  ),
};
