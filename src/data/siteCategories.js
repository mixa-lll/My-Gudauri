export const SITE_CATEGORIES = [
  {
    slug: 'instructors',
    title: 'Instructors',
    description: 'Verified ski and snowboard coaches',
    href: '/instructors',
    icon: '/assets/navbar/icon-instructors.png',
    homeClass: 'instructors',
    image: '/assets/design-1/mosaic/instructors-1-98.png',
    imageAlt: 'Instructor',
    tags: ['Ski', 'Snowboard']
  },
  {
    slug: 'activities',
    title: 'Activities',
    description: 'Routes, freeride and mountain adventures',
    href: '/activities',
    icon: '/assets/navbar/icon-activity.png',
    homeClass: 'tours',
    image: '/assets/design-1/mosaic/tours-1-117-upd.png',
    imageAlt: 'Mountain activity',
    tagsClass: 'tours-tags',
    tags: ['Freeride', 'Ski tour'],
    hotTags: true
  },
  {
    slug: 'services',
    title: 'Services',
    description: 'Photo, video, childcare and local professionals',
    href: '/services',
    icon: '/assets/navbar/icon-services.png',
    homeClass: 'services',
    image: '/assets/design-1/mosaic/services-1-107.png',
    imageAlt: 'Local professional',
    tagsClass: 'services-tags',
    tags: ['Nannies', 'Photo', 'Video']
  },
  {
    slug: 'rental',
    title: 'Rental',
    description: 'Equipment for every level and riding style',
    href: '/rental',
    icon: '/assets/navbar/icon-rent.png',
    homeClass: 'rental',
    image: '/assets/design-1/mosaic/rental-1-135-upd.png',
    imageAlt: 'Ski equipment',
    tagsClass: 'rental-tags',
    tags: ['Ski', 'Snowboard']
  },
  {
    slug: 'transfers',
    title: 'Transfers',
    description: 'Tbilisi, Kutaisi, Batumi and regional routes',
    href: '/transfers',
    icon: '/assets/navbar/icon-transfer.png',
    homeClass: 'transfer',
    image: '/assets/design-1/mosaic/transfer-1-144-upd.png',
    imageAlt: 'Transfer van',
    tagsClass: 'transfer-tags',
    tags: ['Batumi — Gudauri', 'Tbilisi — Gudauri']
  },
  {
    slug: 'stays',
    title: 'Stays',
    description: 'Apartments, hotels and chalets close to the slopes',
    href: '/stays',
    icon: '/assets/navbar/icon-places.png',
    homeClass: 'real-estate',
    tagsClass: 'real-estate-tags',
    tags: ['Apartments']
  },
  {
    slug: 'places',
    title: 'Places',
    description: 'Restaurants, wellness and local essentials',
    href: '/places',
    icon: '/assets/navbar/icon-places.png',
    homeClass: 'places',
    image: '/assets/design-1/mosaic/places-1-154.png',
    imageAlt: 'Mountain cafe',
    tags: ['Bars', 'Restaurants']
  }
];

export const NAV_CATEGORIES = SITE_CATEGORIES.map(({ slug, title, description, href, icon }) => ({
  slug,
  title,
  description,
  href,
  icon
}));

export const HOME_CATEGORIES = SITE_CATEGORIES;

const CATEGORY_ALIASES = {
  activity: 'activities',
  rent: 'rental',
  transfer: 'transfers',
  'real-estate': 'stays',
  tours: 'activities'
};

export function resolveSiteCategory(category) {
  const slug = CATEGORY_ALIASES[category?.slug] ?? category?.slug;
  return SITE_CATEGORIES.find((item) => item.slug === slug || item.href === category?.href) ?? null;
}
