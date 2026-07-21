import { CatalogDiscovery, Pagination } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { PatternFilterToolbar, PatternListingGrid } from './shared';

export default {
  title: 'Patterns/Catalog Discovery',
  component: CatalogDiscovery,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'CatalogDiscovery' }) },
};

export const Default = {
  render: () => (
    <CatalogDiscovery
      categoryTabs={<div className="sb-sample">Category tabs</div>}
      filterToolbar={<PatternFilterToolbar />}
      listingGrid={<PatternListingGrid />}
      pagination={<Pagination page={1} totalPages={3} />}
    />
  ),
};
