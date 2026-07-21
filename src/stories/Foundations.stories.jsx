import { Container } from '../design-system';

const COLORS = [
  ['grey-50', '#f6f6f3'], ['grey-100', '#eeeeea'], ['grey-150', '#e5e5df'], ['grey-200', '#d8d8d1'],
  ['grey-300', '#a3a39b'], ['grey-400', '#77776f'], ['grey-500', '#4d4d47'], ['grey-600', '#20211e'],
  ['grey-700', '#151612'], ['grey-800', '#0e0f0d'], ['grey-white', '#ffffff'], ['accent-600', '#c43f34'],
  ['accent-100', '#f7e4df'], ['olive-50', '#edf0e6'], ['blue-50', '#e9eef2'], ['sand-50', '#f2ede4'],
  ['green-600', '#51ee6b'], ['green-700', 'rgba(38, 76, 44, 0.42)'], ['success-600', '#4c9a59'],
  ['danger-700', '#9d2e2e'], ['warning-100', '#fff1d8'], ['warning-700', '#744700']
];

const SEMANTIC_COLORS = ['surface-page', 'surface-card', 'surface-subtle', 'surface-overlay', 'surface-inverse', 'surface-media-overlay', 'text-primary', 'text-secondary', 'text-inverse', 'text-disabled', 'border-subtle', 'border-default', 'border-strong', 'action-primary', 'action-primary-hover', 'action-secondary', 'action-secondary-hover', 'action-disabled', 'status-success', 'status-warning', 'status-danger', 'focus-ring'];

const TYPE_STYLES = [['type-display', 'Display — MY GUDAURI'], ['type-page-title', 'Page Title — Mountain services'], ['type-section-title', 'Section Title — Local knowledge'], ['type-subsection-title', 'Subsection Title — Booking details'], ['type-body-large', 'Body Large — A clear, calm introduction to the service.'], ['type-body', 'Body — Practical information for planning your trip.'], ['type-body-small', 'Body Small — Updated for winter 2026'], ['type-label', 'Label — Available this week'], ['type-caption', 'Caption — Supporting metadata']];

const SPACES = [[0, '0px', 'Reset only'], [150, '6px', 'Tight icon gap'], [200, '8px', 'Inline gap'], [300, '12px', 'Control groups'], [350, '14px', 'Legacy compatibility'], [400, '16px', 'Control padding'], [500, '20px', 'Compact content'], [600, '24px', 'Card padding'], [700, '28px', 'Legacy compatibility'], [800, '32px', 'Small sections'], [900, '40px', 'Section rhythm'], [1000, '48px', 'Medium sections'], [1200, '64px', 'Large sections']];
const RADII = ['none', 'sm', 'md', 'lg', 'full'];

function StoryHeader({ title, children }) {
  return <header><h2>{title}</h2>{children ? <p>{children}</p> : null}</header>;
}

export default {
  title: 'Foundations/Tokens',
  parameters: { controls: { disable: true } }
};

export const Colors = {
  render: () => (
    <main className="sb-canvas sb-section">
      <StoryHeader title="Color tokens">The complete color palette currently defined in the project.</StoryHeader>
      <div className="sb-grid">
        {COLORS.map(([name, value]) => (
          <article className="sb-swatch" key={name}>
            <div className="sb-swatch__color" style={{ background: `var(--${name})` }} />
            <div className="sb-swatch__meta"><strong>{name}</strong><code>{value}</code></div>
          </article>
        ))}
      </div>
    </main>
  )
};

export const SemanticColors = { render: () => <main className="sb-canvas sb-section"><StoryHeader title="Semantic color contract">Production components use roles; raw palette values remain implementation detail.</StoryHeader><div className="sb-grid">{SEMANTIC_COLORS.map((name) => <article className="sb-swatch" key={name}><div className="sb-swatch__color" style={{ background: `var(--${name})` }} /><div className="sb-swatch__meta"><strong>--{name}</strong></div></article>)}</div></main> };

export const Typography = {
  render: () => (
    <main className="sb-canvas">
      <section className="sb-section">
        <StoryHeader title="Typography utilities">Geist is used for headings and body copy; Paytone One is reserved for decorative display type.</StoryHeader>
        <div>
          {TYPE_STYLES.map(([className, copy]) => (
            <div className="sb-type-row" key={className}>
              <code className="sb-token-label">.{className}</code>
              <p className={`${className} weight-regular`}>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="sb-section">
        <StoryHeader title="Decorative styles" />
        <div className="sb-sample"><p className="h-decor-3" style={{ margin: 0 }}>MY GUDAURI</p></div>
      </section>
    </main>
  )
};

export const Spacing = {
  render: () => (
    <main className="sb-canvas sb-section">
      <StoryHeader title="Spacing scale">Each bar uses the corresponding CSS variable as its width.</StoryHeader>
      {SPACES.map(([space, value, purpose]) => (
        <div className="sb-space-row" key={space}>
          <code className="sb-token-label">--space-{space}<br />{value}<br />{purpose}</code>
          <div className="sb-space-track"><div className="sb-space-bar" style={{ width: `var(--space-${space})` }} /></div>
        </div>
      ))}
    </main>
  )
};

export const RadiusElevationAndMotion = {
  render: () => (
    <main className="sb-canvas">
      <section className="sb-section">
        <StoryHeader title="Radius scale">Semantic aliases: control, card, dialog and pill.</StoryHeader>
        <div className="sb-grid">
          {RADII.map((radius) => <div className="sb-radius-sample" style={{ borderRadius: `var(--radius-${radius})` }} key={radius}><code>--radius-{radius}</code></div>)}
        </div>
      </section>
      <section className="sb-section">
        <StoryHeader title="Elevation" />
        <div className="sb-grid">
          {['soft', 'card', 'float'].map((shadow) => <div className="sb-radius-sample" style={{ borderRadius: 'var(--radius-lg)', boxShadow: `var(--shadow-${shadow})` }} key={shadow}><code>--shadow-{shadow}</code></div>)}
        </div>
      </section>
      <section className="sb-section">
        <StoryHeader title="Motion">Hover the samples to see the three current durations.</StoryHeader>
        <div className="sb-grid">
          {['fast', 'base', 'slow'].map((duration) => <button className="sb-radius-sample sb-motion-sample" style={{ transition: `transform var(--motion-duration-${duration}) var(--motion-ease-standard)` }} key={duration}><code>--motion-duration-{duration}</code></button>)}
        </div>
      </section>
    </main>
  )
};

export const Layout = {
  render: () => (
    <main className="sb-section">
      <Container width="wide"><StoryHeader title="Responsive layout">Mobile 480px · tablet 768px · desktop 1120px. All roles share fluid page margins and gutters.</StoryHeader></Container>
      <div className="sb-layout-stack">
        <Container width="wide"><div className="sb-layout-role"><strong>Wide · 1440px</strong><span>Home, catalog indexes and large card grids.</span><code>--layout-width-wide</code></div></Container>
        <Container width="detail"><div className="sb-layout-role"><strong>Detail · 1180px</strong><span>Instructor profiles and other object detail pages.</span><code>--layout-width-detail</code></div></Container>
        <Container width="article"><div className="sb-layout-role"><strong>Article · 1040px</strong><span>Editorial detail with navigation and readable body.</span><code>--layout-width-article</code></div></Container>
      </div>
      <Container width="wide"><div className="grid-12">{Array.from({ length: 12 }, (_, index) => <div className="sb-radius-sample" style={{ minHeight: 72, borderRadius: 'var(--radius-xsm)' }} key={index}>{index + 1}</div>)}</div></Container>
    </main>
  )
};

export const FocusLayeringAndMedia = { render: () => <main className="sb-canvas sb-section"><StoryHeader title="System tokens">Focus, z-index, opacity, icon sizes, control heights and media ratios are part of the public foundation.</StoryHeader><div className="sb-grid">{['focus-ring', 'z-sticky', 'z-dialog', 'opacity-disabled', 'icon-size-md', 'control-height-xs', 'control-height-md', 'media-landscape', 'media-wide', 'media-portrait'].map((token) => <div className="sb-radius-sample" key={token}><code>--{token}</code></div>)}</div></main> };
