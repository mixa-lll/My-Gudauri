const SPORTS = {
  snowboard: { slug: 'snowboard', name: 'Snowboard', icon: '/assets/design-2/icon-snow.png' },
  ski: { slug: 'ski', name: 'Ski', icon: '/assets/design-2/icon-ski.png' }
};

const LANGUAGES = {
  Ge: { code: 'Ge', name: 'Georgian' },
  En: { code: 'En', name: 'English' },
  Ru: { code: 'Ru', name: 'Russian' }
};

const CATALOG_DETAILS = {
  mikhail: { cardFocus: 'Technique · Confidence', tags: ['Technique', 'Confidence training', 'Carving'] },
  oleg: { cardFocus: 'Freeride · Technique', tags: ['Freeride', 'Technique', 'Advanced'] },
  'alex-red': { cardFocus: 'First lessons · Technique', tags: ['First lessons', 'Technique', 'Kids lessons'] },
  andrey: { cardFocus: 'Kids & families · First lessons', tags: ['Kids & families', 'First lessons', 'Confidence training'] },
  nino: { cardFocus: 'Technique · Carving', tags: ['Technique', 'Carving', 'Confidence training'] },
  giorgi: { cardFocus: 'First lessons · Freestyle', tags: ['First lessons', 'Freestyle', 'Kids lessons'] },
  levan: { cardFocus: 'Technique · Freeride', tags: ['Technique', 'Freeride', 'Advanced'] },
  mari: { cardFocus: 'Kids & families · First lessons', tags: ['Kids & families', 'First lessons', 'Confidence training'] }
};

export const INSTRUCTORS = [
  ['mikhail', 'Mikhail Andreev', 'Ski & snowboard · 8 years experience', 4.8, 6, 8, '/assets/design-2/card-mikhail.png', ['snowboard', 'ski'], ['Ge', 'En', 'Ru']],
  ['oleg', 'Oleg Yung', 'Snowboard · Freeride specialist', 4.8, 6, 8, '/assets/design-2/card-oleg.png', ['snowboard'], ['Ge', 'En']],
  ['alex-red', 'Alex Red', 'Ski · Beginner-friendly lessons', 4.8, 6, 6, '/assets/design-2/card-red-ski.png', ['ski'], ['Ge', 'En']],
  ['andrey', 'Andrey Gregorev', 'Ski & snowboard · Kids and families', 4.8, 6, 5, '/assets/design-2/card-andrey.png', ['snowboard', 'ski'], ['Ge', 'En']],
  ['nino', 'Nino Beridze', 'Ski · Technique and confidence', 4.9, 11, 8, '/assets/design-2/card-mikhail.png', ['ski'], ['Ge', 'En', 'Ru']],
  ['giorgi', 'Giorgi Maisuradze', 'Snowboard · All levels welcome', 4.8, 8, 7, '/assets/design-2/card-oleg.png', ['snowboard'], ['Ge', 'En']],
  ['levan', 'Levan Kapanadze', 'Ski & snowboard · Private lessons', 4.9, 14, 10, '/assets/design-2/card-red-ski.png', ['ski', 'snowboard'], ['Ge', 'En']],
  ['mari', 'Mari Gelashvili', 'Ski · First-time and family lessons', 5, 9, 9, '/assets/design-2/card-andrey.png', ['ski'], ['Ge', 'En', 'Ru']]
].map(([slug, name, description, rating, reviews, experienceYears, image, sports, languages]) => ({
  id: slug,
  slug,
  name,
  description,
  rating,
  reviews,
  experienceYears,
  image,
  sports: sports.map((sport) => SPORTS[sport]),
  languages: languages.map((language) => LANGUAGES[language]),
  ...CATALOG_DETAILS[slug]
}));

const DEFAULT_MEDIA = [
  { type: 'image', src: '/assets/design-3/hero-main.png', alt: 'Instructor on a Gudauri ski slope', featured: true },
  { type: 'image', src: '/assets/design-3/media-1.jpg', alt: 'Snowboard students on a slope' },
  { type: 'image', src: '/assets/design-3/media-2.jpg', alt: 'Two riders resting in snow' },
  { type: 'image', src: '/assets/design-3/media-3.jpg', alt: 'Child snowboard student' },
  { type: 'image', src: '/assets/design-3/media-4.jpg', alt: 'Snowboard lesson moment' },
  { type: 'image', src: '/assets/design-3/media-5.jpg', alt: 'Kids ski group' }
];

const DEFAULT_REVIEWS = [
  { author: 'Karla Lynn', lesson: '2 hour lesson', rating: 5, date: '2025-08-18', body: 'A calm, attentive lesson with clear explanations and visible progress.', avatar: '/assets/design-3/avatars-sprite.png', avatarPosition: 1 },
  { author: 'Marina Ivanova', lesson: '8 hour lesson', rating: 5, date: '2025-08-11', body: 'Very patient and professional. Every exercise felt adapted to my pace.', avatar: '/assets/design-3/avatars-sprite.png', avatarPosition: 2 }
];

export const INSTRUCTOR_DETAILS = Object.fromEntries(INSTRUCTORS.map((instructor, index) => [instructor.slug, {
  ...instructor,
  role: 'Instructor',
  tagline: index === 0 ? 'Private lessons in Gudauri' : `${instructor.sports[0].name} lessons in Gudauri`,
  intro: 'Structured, supportive coaching adapted to your level, pace and goals on the mountain.',
  heroImage: index === 0 ? '/assets/design-3/hero-main.png' : instructor.image,
  heroImageAlt: `${instructor.name} in Gudauri`,
  bookingAvatar: index === 0 ? '/assets/design-3/avatar-booking.jpg' : instructor.image,
  experienceYears: 6 + (index % 5),
  availability: index % 3 === 0 ? 'Limited availability' : 'Available this week',
  certificate: 'Verified Instructor',
  about: [
    `${instructor.name} is a verified local instructor with extensive teaching experience in Gudauri.`,
    'Lessons combine clear explanations, practical exercises and steady progress with safety and comfort as priorities.',
    'Every session is adapted to the guest’s current level, pace and personal goals.'
  ],
  tags: [...instructor.tags, 'Private lessons', 'Intermediate'],
  media: DEFAULT_MEDIA,
  reviewsList: DEFAULT_REVIEWS,
  pricing: { hourlyRateGel: 345, minHours: 2, maxHours: 12, hoursStep: 2, minPeople: 1, maxPeople: 10, defaultHours: 8, defaultPeople: 2 }
}]));
