import { useState } from 'react';
import { SearchHero } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

function Harness({ state = 'idle' }) { const [query, setQuery] = useState(''); return <SearchHero kicker="Local knowledge" title="Find what you need in Gudauri" description="Search approved services, guides and practical information." query={query} onQueryChange={setQuery} onSubmit={() => {}} suggestions={['Ski instructor', 'Airport transfer', 'Equipment rental']} state={state} />; }

export default { title: 'Blocks/Marketing/Search Hero', component: SearchHero, parameters: { composition: defineComposition({ root: 'SearchHero' }) } };

export const Empty = {
  render: () => <Harness />
};

export const Loading = { render: () => <Harness state="loading" /> };

export const NoResults = { render: () => <Harness state="empty" /> };
