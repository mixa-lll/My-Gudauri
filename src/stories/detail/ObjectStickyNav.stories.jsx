import { BookingWidget, ObjectStickyNav } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';

const items = [
  { href: '#about', label: 'About' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#booking-process', label: 'Booking' },
  { href: '#questions', label: 'Questions' },
];

function DemoSection({ id, title }) {
  return <section id={id} style={{ minHeight: 420, paddingBlock: 48, scrollMarginTop: 90 }}><h2>{title}</h2><p>Scroll this story to inspect the active anchor and compact booking state.</p></section>;
}

export default {
  title: 'Blocks/Detail/Object Sticky Navigation',
  component: ObjectStickyNav,
  tags: ['autodocs'],
  parameters: {
    composition: defineComposition({ root: 'ObjectStickyNav' }),
    docs: { description: { component: 'Viewport-wide fixed object navigation. It is absent before its trigger, appears only after that point crosses the top edge and adds the compact desktop CTA after the BookingWidget leaves the viewport.' } },
  },
};

export const Default = {
  render: () => <div style={{ position: 'relative', maxWidth: 1180, marginInline: 'auto' }}>
    <ObjectStickyNav items={items} bookingSummary={{ actionLabel: 'Continue', totalLabel: '240 GEL' }} />
    <DemoSection id="about" title="About" />
    <DemoSection id="reviews" title="Reviews" />
    <BookingWidget id="booking-request" category="instructor" price={120} />
    <DemoSection id="booking-process" title="How booking works" />
    <DemoSection id="questions" title="Common questions" />
  </div>,
};

export const WithoutPrice = {
  render: () => <div style={{ position: 'relative', maxWidth: 1180, marginInline: 'auto' }}>
    <ObjectStickyNav items={items} bookingSummary={{ actionLabel: 'Check availability', totalLabel: null }} />
    <DemoSection id="about" title="About" />
    <BookingWidget id="booking-request" category="activity" />
    <DemoSection id="reviews" title="Reviews" />
    <DemoSection id="booking-process" title="How booking works" />
    <DemoSection id="questions" title="Common questions" />
  </div>,
};
