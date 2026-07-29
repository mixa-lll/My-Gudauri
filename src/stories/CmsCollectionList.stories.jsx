import { useState } from 'react';
import { CmsCollectionList } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const instructors = [
  { id: 1, slug: 'mikhail', name: 'Михаил Андреев', image: '/assets/design-2/card-mikhail.png', disciplines: ['Сноуборд', 'Лыжи'], languages: ['Ge', 'En', 'Ru'], experienceYears: 8, rating: 4.8, status: 'published', updated_at: '2026-07-21 10:00:00' },
  { id: 2, slug: 'oleg', name: 'Олег Юнг', image: '/assets/design-2/card-oleg.png', disciplines: ['Сноуборд'], languages: ['Ge', 'Ru'], experienceYears: 8, rating: 4.8, status: 'published', updated_at: '2026-07-18 10:00:00' },
  { id: 3, slug: 'nino', name: 'Нино Барамидзе', disciplines: ['Лыжи'], languages: ['Ge', 'En'], experienceYears: 7, rating: 0, status: 'draft', updated_at: '2026-07-23 10:00:00' },
];

const activities = [
  { id: 11, slug: 'snowmobile-plateau', name: 'Snowmobile tour', image: '/assets/design-1/mosaic/tours-1-117-upd.png', category: 'Snowmobile tours', tags: ['Transfer'], price_amount: 350, currency: 'GEL', rating: 4.8, status: 'published', updated_at: '2026-07-22 10:00:00' },
  { id: 12, slug: 'paragliding-gudauri', name: 'Paragliding', category: 'Paragliding', tags: ['Guide'], price_amount: 0, currency: 'GEL', rating: 0, status: 'draft', updated_at: '2026-07-25 10:00:00' },
];

const counts = { instructors: instructors.length, activities: activities.length };

function CollectionHarness({ collection = 'instructors', items, initialMenu = null }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [menu, setMenu] = useState(initialMenu);
  const filtered = items.filter((item) => (!query || item.name.toLowerCase().includes(query.toLowerCase())) && (status === 'all' || item.status === status));
  return <CmsCollectionList
    items={filtered}
    activeCollection={collection}
    counts={counts}
    query={query}
    onQueryChange={setQuery}
    filters={[]}
    status={status}
    onStatusChange={setStatus}
    openMenuId={menu}
    onOpenMenu={setMenu}
    onCloseMenu={() => setMenu(null)}
    onCreate={() => {}}
    onEdit={() => {}}
    onDuplicate={collection === 'instructors' ? () => {} : undefined}
    onCollectionChange={() => {}}
    onSignOut={() => {}}
  />;
}

export default { title: 'Blocks/Admin/CMS Collection List', component: CmsCollectionList, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'CmsCollectionList', children: ['Badge', 'Button', 'CmsEditorShell'] }) } };

export const Instructors = { render: () => <CollectionHarness items={instructors} /> };

/** The same shell with the activity column set — no separate list component. */
export const Activities = { render: () => <CollectionHarness collection="activities" items={activities} /> };

export const ActionsMenu = { name: 'Actions Menu', render: () => <CollectionHarness items={instructors} initialMenu={1} /> };

export const Empty = { render: () => <CollectionHarness items={[]} /> };
