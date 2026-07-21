import { FilterChip, FilterToolbar, ListingGrid, ResultCount } from '../../design-system';

export const listingItems = [
  {
    slug: 'lesson',
    title: 'Private ski lesson',
    category: 'Lesson',
    rating: 4.9,
    reviews: 24,
    price: '240 GEL',
    tags: ['Beginner'],
  },
];

export function PatternFilterToolbar() {
  return <FilterToolbar resultCount={1} controls={<FilterChip selected>Beginner</FilterChip>} />;
}

export function PatternListingGrid() {
  return <ListingGrid items={listingItems} />;
}

export function PatternResultCount({ count = 1 }) {
  return <ResultCount count={count} />;
}
