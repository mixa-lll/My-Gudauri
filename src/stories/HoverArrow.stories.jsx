import { HoverArrow } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const meta = {
  title: 'Components/Hover Arrow',
  component: HoverArrow,
  parameters: {
    composition: defineComposition({ root: 'HoverArrow' }),
    docs: {
      description: {
        component:
          'The ↗ used on every clickable card. Hovering the surrounding `.hover-card` sends it off the top-right and brings it back in from the bottom-left — it never retraces its path, which reads as "this opens somewhere else". Put `hover-card` on the card, not on the arrow.'
      }
    }
  },
  args: { variant: 'inline' },
  argTypes: { variant: { control: 'select', options: ['inline', 'pill'] } }
};

export default meta;

export const Playground = {
  render: (args) => (
    <main className="sb-canvas">
      <div className="hover-card" style={{ padding: '24px', borderRadius: '28px', background: 'var(--grey-white)', display: 'inline-flex', gap: '12px', alignItems: 'center' }}>
        Hover this card
        <HoverArrow {...args} />
      </div>
    </main>
  )
};

/* Both variants side by side, each inside its own card so the trigger is
   obvious: the pill inherits the card's hover colour through currentColor. */
export const Variants = {
  render: () => (
    <main className="sb-canvas">
      <section className="sb-section" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {['inline', 'pill'].map((variant) => (
          <div
            className="hover-card"
            key={variant}
            style={{
              width: '280px',
              minHeight: '160px',
              padding: '24px',
              borderRadius: '28px',
              background: 'var(--grey-white)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '24px' }}>Instructors</strong>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <small style={{ color: 'var(--text-secondary)' }}>{variant}</small>
              <HoverArrow variant={variant} />
            </span>
          </div>
        ))}
      </section>
    </main>
  )
};
