import { useState } from 'react';
import { BenefitCard, BenefitsSection, BookingStep, BookingSteps, Button, CatalogHero, FilterControl, FilterToolbar, ListingGrid, MediaPlaceholder, ResultCount } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

const listings = [
  { slug: 'private-lesson', title: 'Private ski lesson', category: 'Lessons', rating: 4.9, reviews: 38, price: '240 GEL', priceSuffix: '2 hours', tags: ['Beginner', 'English'] },
  { slug: 'freeride-day', title: 'Freeride day', category: 'Adventure', rating: 4.8, reviews: 16, price: '520 GEL', priceSuffix: 'per group', tags: ['Advanced', '6 hours'] }
];

export default { title: 'Blocks/Catalog', parameters: { controls: { disable: true } } };
const composition = (root) => ({ composition: defineComposition({ root }) });
export const CatalogHeroBlock = { name: 'Catalog Hero', parameters: composition('CatalogHero'), render: () => <CatalogHero kicker="Mountain experiences" title="Activities" description="Discover Gudauri beyond the piste with trusted local guides and clear itineraries." /> };
export const CatalogHeroSplitStart = { name: 'Catalog Hero / Split Start', parameters: composition('CatalogHero'), render: () => <CatalogHero align="start" kicker="Local knowledge" title="Articles" description="Practical guides for a smoother mountain trip — written with local experts and updated for the season." /> };
export const CatalogHeroWithMedia = { name: 'Catalog Hero / With Media', parameters: composition('CatalogHero'), render: () => <CatalogHero align="start" kicker="Gudauri catalog" title="Book trusted mountain experiences" description="Compare verified local services with clear terms." actions={<Button>Browse all</Button>} media={<MediaPlaceholder label="Gudauri catalog" />} /> };
function Toolbar() { const [value, setValue] = useState('all'); return <FilterToolbar resultCount={18} controls={<><FilterControl label="Category" value={value} onChange={setValue} options={[{ value: 'all', label: 'All' }, { value: 'lessons', label: 'Lessons' }]} /><FilterControl label="Sort" value="recommended" options={[{ value: 'recommended', label: 'Recommended' }, { value: 'price', label: 'Price' }]} /></>} actions={<Button variant="ghost">Reset</Button>} />; }
export const FilterToolbarBlock = { name: 'Filter Toolbar', parameters: composition('FilterToolbar'), render: () => <div className="sb-canvas"><Toolbar /></div> };
export const FilterControlComponent = { name: 'Filter Control', parameters: composition('FilterControl'), render: () => <div className="sb-canvas"><FilterControl label="Category" value="all" options={[{ value: 'all', label: 'All categories' }]} /></div> };
export const ResultCountComponent = { name: 'Result Count', parameters: composition('ResultCount'), render: () => <div className="sb-canvas"><ResultCount count={18} /></div> };
export const ListingGridReady = { name: 'Listing Grid / Ready', parameters: composition('ListingGrid'), render: () => <div className="sb-canvas"><ListingGrid items={listings} /></div> };
export const ListingGridStates = { name: 'Listing Grid / States', parameters: composition('ListingGrid'), render: () => <main className="sb-canvas sb-section"><ListingGrid state="loading" /><ListingGrid items={[]} emptyAction={<Button variant="secondary">Clear filters</Button>} /><ListingGrid state="error" onRetry={() => {}} /></main> };
export const Benefits = { name: 'Benefits Section', parameters: composition('BenefitsSection'), render: () => <BenefitsSection title="A calmer way to plan" description="Shared guarantees across every catalog type." items={[{ icon: '✓', title: 'Verified', description: 'Profiles and services are reviewed before publication.' }, { icon: '↗', title: 'Clear terms', description: 'Prices and conditions are visible before contact.' }, { icon: '●', title: 'Local support', description: 'A local operator helps if plans change.' }]} /> };
export const BenefitCardComponent = { name: 'Benefit Card', parameters: composition('BenefitCard'), render: () => <BenefitCard icon="✓" title="Verified" description="Reviewed before publication." /> };
export const BookingStepsBlock = { name: 'Booking Steps', parameters: composition('BookingSteps'), render: () => <BookingSteps items={[{ title: 'Choose', description: 'Compare registered offers.' }, { title: 'Request', description: 'Send dates and group details.' }, { title: 'Confirm', description: 'Receive final availability and terms.' }]} /> };
export const BookingStepComponent = { name: 'Booking Step', parameters: composition('BookingStep'), render: () => <BookingStep number={1} title="Choose" description="Compare registered offers." /> };
