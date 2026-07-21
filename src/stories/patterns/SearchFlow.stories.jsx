import { SearchFlow, SearchHero } from '../../design-system';
import { defineComposition } from '../../design-system/architecture/registry';
import { PatternListingGrid, PatternResultCount } from './shared';

export default {
  title: 'Patterns/Search Flow',
  component: SearchFlow,
  parameters: { controls: { disable: true }, composition: defineComposition({ root: 'SearchFlow' }) },
};

export const Default = {
  render: () => (
    <SearchFlow
      searchHero={<SearchHero title="Search Gudauri" query="" suggestions={['Transfer', 'Rental']} />}
      feedback={<PatternResultCount />}
      results={<PatternListingGrid />}
    />
  ),
};
