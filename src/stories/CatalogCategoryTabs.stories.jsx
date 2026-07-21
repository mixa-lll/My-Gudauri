import { useState } from 'react';
import { CatalogCategoryTabs, CategoryTab } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const CATEGORIES = [
  { id: 'all', label: 'All offers', description: 'Browse the complete collection', count: 18 },
  { id: 'winter', label: 'Winter', description: 'Snow activities and lessons', count: 9 },
  { id: 'summer', label: 'Summer', description: 'Hiking, views and culture', count: 6 },
  { id: 'food', label: 'Food & culture', count: 3 }
];

function TabsHarness({ categories = CATEGORIES, initial = 'all', label = 'Browse by category' }) {
  const [activeId, setActiveId] = useState(initial);
  return <CatalogCategoryTabs categories={categories} activeId={activeId} onChange={setActiveId} label={label} />;
}

export default { title: 'Blocks/Catalog/Category Tabs', component: CatalogCategoryTabs, parameters: { composition: defineComposition({ root: 'CategoryTabs' }) } };
export const Default = { parameters: { composition: defineComposition({ root: 'CategoryTabs' }) }, render: () => <div className="sb-canvas"><TabsHarness /></div> };
export const WithoutDescriptions = { render: () => <div className="sb-canvas"><TabsHarness categories={CATEGORIES.map(({ description, ...category }) => category)} /></div> };
export const WithoutCounts = { render: () => <div className="sb-canvas"><TabsHarness categories={CATEGORIES.map(({ count, ...category }) => category)} /></div> };
export const CategoryTabComponent = { parameters: { composition: defineComposition({ root: 'CategoryTab' }) }, render: () => <div className="sb-canvas sb-row"><CategoryTab category={CATEGORIES[0]} active onSelect={() => {}} /><CategoryTab category={CATEGORIES[1]} onSelect={() => {}} /></div> };
