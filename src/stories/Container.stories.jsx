import { Container } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default {
  title: 'Primitives/Container',
  component: Container,
  parameters: { composition: defineComposition({ root: 'Container' }) },
  args: { width: 'wide' },
  argTypes: { width: { control: 'select', options: ['wide', 'detail', 'article'] } },
};

export const Playground = {
  render: () => (
    <Container><div className="sb-radius-sample">Wide page container with responsive margins.</div></Container>
  )
};

export const WidthRoles = {
  name: 'Width Roles',
  render: () => (
    <main className="sb-layout-stack">
      <Container width="wide"><div className="sb-layout-role"><strong>Wide</strong><span>Home, catalogs and card grids</span><code>--layout-width-wide</code></div></Container>
      <Container width="detail"><div className="sb-layout-role"><strong>Detail</strong><span>Instructor and object detail pages</span><code>--layout-width-detail</code></div></Container>
      <Container width="article"><div className="sb-layout-role"><strong>Article</strong><span>Editorial detail and long-form layouts</span><code>--layout-width-article</code></div></Container>
    </main>
  ),
};

export const ResponsiveGrid = {
  render: () => (
    <Container width="wide">
      <div className="grid-12">{Array.from({ length: 12 }, (_, index) => <div className="sb-radius-sample" style={{ minHeight: 54, borderRadius: 8 }} key={index}>{index + 1}</div>)}</div>
    </Container>
  )
};
