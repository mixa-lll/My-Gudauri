export const SITE_CATEGORIES = [
  {
    slug: 'instructors',
    href: '/instructors',
    icon: '/assets/navbar/icon-instructors.png',
    homeClass: 'instructors',
    image: '/assets/design-1/mosaic/instructors-1-98.png'
  },
  {
    slug: 'activities',
    href: '/activities',
    icon: '/assets/navbar/icon-activity.png',
    homeClass: 'tours',
    image: '/assets/design-1/mosaic/tours-1-117-upd.png',
    tagsClass: 'tours-tags',
    hotTags: true
  },
  {
    slug: 'services',
    href: '/services',
    icon: '/assets/navbar/icon-services.png',
    homeClass: 'services',
    image: '/assets/design-1/mosaic/services-1-107.png',
    tagsClass: 'services-tags'
  },
  {
    slug: 'rental',
    href: '/rental',
    icon: '/assets/navbar/icon-rent.png',
    homeClass: 'rental',
    image: '/assets/design-1/mosaic/rental-1-135-upd.png',
    tagsClass: 'rental-tags'
  },
  {
    slug: 'transfers',
    href: '/transfers',
    icon: '/assets/navbar/icon-transfer.png',
    homeClass: 'transfer',
    image: '/assets/design-1/mosaic/transfer-1-144-upd.png',
    tagsClass: 'transfer-tags'
  },
  {
    slug: 'stays',
    href: '/stays',
    icon: '/assets/navbar/icon-places.png',
    homeClass: 'real-estate',
    tagsClass: 'real-estate-tags'
  },
  {
    slug: 'places',
    href: '/places',
    icon: '/assets/navbar/icon-places.png',
    homeClass: 'places',
    image: '/assets/design-1/mosaic/places-1-154.png'
  }
];

export const NAV_CATEGORIES = SITE_CATEGORIES.map(({ slug, href, icon }) => ({ slug, href, icon }));

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
