import { useState } from 'react';
import { CmsCollectionList } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const items = [
  { id: 1, slug: 'mikhail', name: 'Михаил Андреев', image: '/assets/design-2/card-mikhail.png', disciplines: ['Сноуборд', 'Лыжи'], languages: ['Ge', 'En', 'Ru'], experienceYears: 8, rating: 4.8, status: 'published', updated_at: '2026-07-21 10:00:00' },
  { id: 2, slug: 'oleg', name: 'Олег Юнг', image: '/assets/design-2/card-oleg.png', disciplines: ['Сноуборд'], languages: ['Ge', 'Ru'], experienceYears: 8, rating: 4.8, status: 'published', updated_at: '2026-07-18 10:00:00' },
  { id: 3, slug: 'nino', name: 'Нино Барамидзе', disciplines: ['Лыжи'], languages: ['Ge', 'En'], experienceYears: 7, rating: 4.8, status: 'draft', updated_at: '2026-07-23 10:00:00' },
];

function CollectionHarness({ initialMenu = null }) {
  const [query, setQuery] = useState(''); const [discipline, setDiscipline] = useState('all'); const [language, setLanguage] = useState('all'); const [status, setStatus] = useState('all'); const [menu, setMenu] = useState(initialMenu);
  const filtered = items.filter((item) => (!query || item.name.toLowerCase().includes(query.toLowerCase())) && (discipline === 'all' || item.disciplines.includes(discipline)) && (language === 'all' || item.languages.includes(language)) && (status === 'all' || item.status === status));
  return <CmsCollectionList items={filtered} query={query} onQueryChange={setQuery} discipline={discipline} onDisciplineChange={setDiscipline} disciplines={['Сноуборд', 'Лыжи']} language={language} onLanguageChange={setLanguage} languages={['Ge', 'En', 'Ru']} status={status} onStatusChange={setStatus} openMenuId={menu} onOpenMenu={setMenu} onCloseMenu={() => setMenu(null)} onCreate={() => {}} onEdit={() => {}} onDuplicate={() => {}} onCollectionChange={() => {}} onSignOut={() => {}} />;
}

export default { title: 'Blocks/Admin/CMS Collection List', component: CmsCollectionList, tags: ['autodocs'], parameters: { composition: defineComposition({ root: 'CmsCollectionList', children: ['Badge', 'Button'] }) } };
export const Instructors = { render: () => <CollectionHarness /> };
export const ActionsMenu = { render: () => <CollectionHarness initialMenu={1} /> };
