import { FilterChip, SearchAndFiltering } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { PatternListingGrid, PatternResultCount } from './shared';

export default {
  title: 'Patterns/Search and Filtering',
  component: SearchAndFiltering,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'SearchAndFiltering' }) },
};

export const Default = {
  render: () => (
    <SearchAndFiltering
      search={<label className="sb-control-cell">Search<input defaultValue="ski" /></label>}
      filters={<FilterChip selected>Lessons</FilterChip>}
      activeFilters={<FilterChip>English ×</FilterChip>}
      resultCount={<PatternResultCount count={12} />}
      results={<PatternListingGrid />}
    />
  ),
};
