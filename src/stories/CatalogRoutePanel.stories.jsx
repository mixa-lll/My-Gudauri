import { useState } from 'react';
import { CatalogRoutePanel, RouteOption } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const ANCHOR = { kicker: 'Always', title: 'Gudauri', meta: '2 200 m' };

const OPTIONS = [
  { id: 'all', label: 'All routes', description: 'Every direction to and from Gudauri', count: 6, meta: '6 routes' },
  { id: 'tbilisi', label: 'Tbilisi', description: 'Airport & city · ~2 h · from 180 GEL', count: 2, meta: '2 routes' },
  { id: 'kutaisi', label: 'Kutaisi', description: 'Airport · ~4.5 h · from 420 GEL', count: 1, meta: '1 route' },
  { id: 'batumi', label: 'Batumi', description: '~6 h · two stops · from 520 GEL', count: 1, meta: '1 route' },
  { id: 'kazbegi', label: 'Kazbegi', description: '4×4 · ~1 h · from 150 GEL', count: 1, meta: '1 route' },
  { id: 'vladikavkaz', label: 'Vladikavkaz', description: 'Border · 3–6 h · from 390 GEL', count: 1, meta: '1 route' }
];

function PanelHarness({ initial = 'all', initialDirection = 'to-anchor', defaultOpen = false, withSwap = true }) {
  const [activeId, setActiveId] = useState(initial);
  const [direction, setDirection] = useState(initialDirection);
  return (
    <CatalogRoutePanel
      options={OPTIONS}
      activeId={activeId}
      onChange={setActiveId}
      anchor={ANCHOR}
      direction={direction}
      onDirectionChange={withSwap ? setDirection : undefined}
      fromLabel="From"
      toLabel="To"
      swapLabel="Swap direction"
      kicker="Your route"
      hint="Pick the city — the grid updates instantly."
      note="The price is the same in both directions — your direction goes into the request."
      listLabel="Choose a city"
      defaultOpen={defaultOpen}
    />
  );
}

export default {
  title: 'Blocks/Catalog/Route Panel',
  component: CatalogRoutePanel,
  tags: ['autodocs'],
  parameters: {
    composition: defineComposition({ root: 'RoutePanel' }),
    docs: { description: { component: 'Route selection for single-anchor catalogs: one endpoint is pinned (Gudauri), the other is picked from a short city list that drives the same active category as the standard tabs. The swap control flips From and To — direction is carried into the request but never changes price or results.' } }
  }
};

export const Default = { parameters: { composition: defineComposition({ root: 'RoutePanel' }) }, render: () => <div className="sb-canvas"><PanelHarness /></div> };
export const CitySelected = { render: () => <div className="sb-canvas"><PanelHarness initial="tbilisi" /></div> };
export const FromGudauri = { render: () => <div className="sb-canvas"><PanelHarness initial="tbilisi" initialDirection="from-anchor" /></div> };
export const WithoutSwap = { render: () => <div className="sb-canvas"><PanelHarness withSwap={false} /></div> };
export const ListOpen = { render: () => <div className="sb-canvas" style={{ minHeight: 560 }}><PanelHarness defaultOpen /></div> };
export const RouteOptionComponent = {
  parameters: { composition: defineComposition({ root: 'RouteOption' }) },
  render: () => (
    <div className="sb-canvas" style={{ maxWidth: 420, display: 'grid', gap: 4 }}>
      <RouteOption option={OPTIONS[1]} active onSelect={() => {}} />
      <RouteOption option={OPTIONS[2]} onSelect={() => {}} />
    </div>
  )
};
