import { INSTRUCTORS } from './instructors';

const INSTRUCTOR_FAQ = [
  {
    question: 'How does booking work?',
    answer: 'Send a request with your preferred date and details. A local booking manager checks availability before you receive a secure payment link.'
  },
  {
    question: 'Is the price final?',
    answer: 'The price and everything included are shown before payment. If your request needs a custom quote, we will confirm it with you first.'
  },
  {
    question: 'Can I change or cancel my request?',
    answer: 'Yes. Contact support with your booking reference and we will explain the options for your specific service.'
  }
];

const INSTRUCTOR_BOOKING_STEPS = [
  ['Send your request', 'Share your dates, group and lesson goals.'],
  ['We check availability', 'A manager finds the best available match.'],
  ['Confirm before booking', 'You receive the instructor, schedule and final price.']
];

const BROWSE_FAQ = [
  {
    question: 'How do availability inquiries work?',
    answer: 'Send the local team an email from the offer page. They will check the current details with the provider and explain the available next steps.'
  },
  {
    question: 'Are the listed prices final?',
    answer: 'Prices are useful starting points. Seasonal dates, group size and custom requirements can change the final quote, which is confirmed directly before any arrangement.'
  },
  {
    question: 'Can I book these offers online?',
    answer: 'Not yet. Online booking currently supports instructor lessons only; other sections are curated browse-and-inquiry guides.'
  }
];

const image = (name) => `/assets/design-1/${name}`;

export const DESTINATIONS = {
  instructors: {
    slug: 'instructors',
    navTitle: 'Instructors',
    title: 'Instructors',
    kicker: 'Verified local experts',
    description: 'Compare teaching styles, languages and experience to find the right instructor for your time in Gudauri.',
    countLabel: 'instructors',
    promise: 'One clear lesson rate with flexible scheduling',
    promiseNote: 'Lesson hours can be split across several days',
    startingPrice: 'from 345 GEL/hour',
    accent: 'blue',
    benefitsTitle: 'Why choose My Gudauri instructors',
    benefits: [
      ['Verified professionals', 'Every instructor is reviewed before joining the platform.'],
      ['Transparent pricing', 'The same official rate for everyone, with no hidden markups.'],
      ['Real profiles', 'Compare experience, languages, reviews and teaching style.'],
      ['Flexible scheduling', 'Split lesson hours across days in a way that suits you.']
    ],
    bookingKicker: 'Booking guide',
    bookingTitle: 'How it works',
    bookingSteps: INSTRUCTOR_BOOKING_STEPS,
    faq: INSTRUCTOR_FAQ,
    items: INSTRUCTORS
  },
  activities: {
    slug: 'activities',
    navTitle: 'Activities',
    title: 'Activities',
    kicker: 'Mountain experiences',
    description: 'Discover Gudauri beyond the piste with trusted local guides, clear itineraries and equipment included where you need it.',
    tabs: ['Winter', 'Excursions', 'Summer'],
    filters: ['Activity', 'Duration', 'Format'],
    countLabel: 'experiences',
    promise: 'Guides, transport and essential equipment in one clear price',
    promiseNote: 'Private and small-group formats are available',
    startingPrice: 'from 90 GEL',
    heroImage: image('mosaic/tours-1-117-upd.png'),
    accent: 'olive',
    benefitsTitle: 'Why explore with My Gudauri',
    benefits: [
      ['Local guides', 'Routes led by people who know the mountain and current conditions.'],
      ['Clear itineraries', 'Duration, difficulty and what to bring are explained before an inquiry.'],
      ['Safety first', 'Verified providers and the right equipment for every activity.'],
      ['Flexible formats', 'Choose a private experience or join a small group.']
    ],
    faq: [
      { question: 'Do I need previous experience?', answer: 'Most activities offer beginner-friendly formats. The required level is listed on every experience page.' },
      { question: 'What happens in bad weather?', answer: 'The guide monitors conditions and will suggest a safe alternative date or route if needed.' },
      { question: 'Is equipment included?', answer: 'Each page lists exactly what is included. Specialist equipment is included unless the offer says otherwise.' }
    ],
    items: [
      { slug: 'kazbegi-gergeti', name: 'Kazbegi & Gergeti', category: 'Scenic tour', price: '120 GEL', priceSuffix: 'per guest', rating: '4.9', reviews: '86 reviews', tags: ['1 day', 'Easy', 'Transfer'], image: image('mosaic/tours-1-117-upd.png'), facts: [['Duration', '8 hours'], ['Group', 'Up to 7'], ['Languages', 'EN · RU'], ['Season', 'All year']], included: ['Local guide', 'Return transfer', 'Photo stops', 'Water'], description: 'A full-day road trip through the dramatic Terek valley to Stepantsminda and the iconic Gergeti Trinity Church.' },
      { slug: 'snowmobile-plateau', name: 'Snowmobile plateau ride', category: 'Winter adventure', price: '200 GEL', priceSuffix: 'per ride', rating: '4.8', reviews: '52 reviews', tags: ['2 hours', 'Equipment', 'Guide'], image: image('mosaic/tours-2104-1380.png'), facts: [['Duration', '2 hours'], ['Level', 'Beginner'], ['Guests', '1–2'], ['Season', 'Winter']], included: ['Safety briefing', 'Helmet', 'Fuel', 'Local guide'], description: 'Ride across open snowfields above Gudauri with a guide and panoramic stops along the way.' },
      { slug: 'paragliding-gudauri', name: 'Paragliding over Gudauri', category: 'Air adventure', price: '350 GEL', priceSuffix: 'per guest', rating: '4.9', reviews: '114 reviews', tags: ['Tandem', '15–25 min', 'Video'], image: image('mosaic/tours-riders-1-117.png'), facts: [['Flight', '15–25 min'], ['Format', 'Tandem'], ['Pilot', 'Certified'], ['Video', 'Included']], included: ['Certified pilot', 'Equipment', 'GoPro video', 'Slope transfer'], description: 'A tandem flight above the Caucasus with a certified pilot and a video of your experience.' },
      { slug: 'heli-ski', name: 'Heli-ski drop', category: 'Advanced', price: '900 GEL', priceSuffix: 'per guest', rating: '5.0', reviews: '31 reviews', tags: ['Advanced', 'Full day', 'Safety kit'], image: image('mosaic/tours-slope-1-117.png'), facts: [['Duration', 'Full day'], ['Level', 'Advanced'], ['Group', 'Up to 4'], ['Runs', '3–5']], included: ['Mountain guide', 'Helicopter drops', 'Avalanche kit', 'Lunch'], description: 'Remote Caucasus lines, small groups and a certified mountain guide for experienced freeride guests.' },
      { slug: 'freeride-day', name: 'Freeride discovery day', category: 'Ski & snowboard', price: '280 GEL', priceSuffix: 'per guest', rating: '4.9', reviews: '67 reviews', tags: ['6 hours', 'Intermediate+', 'Guide'], image: image('mosaic/tours-riders-1-117.png'), facts: [['Duration', '6 hours'], ['Level', 'Intermediate+'], ['Group', 'Up to 5'], ['Terrain', 'Off-piste']], included: ['Certified guide', 'Route planning', 'Safety briefing', 'Radio'], description: 'Learn to read the terrain and discover the best snow for the day with a local freeride guide.' },
      { slug: 'gastro-route', name: 'Khinkali & mountain wine route', category: 'Food & culture', price: '110 GEL', priceSuffix: 'per guest', rating: '4.8', reviews: '43 reviews', tags: ['Half day', 'Tastings', 'Transfer'], image: image('service-places.png'), facts: [['Duration', '5 hours'], ['Group', 'Up to 8'], ['Meals', 'Included'], ['Season', 'All year']], included: ['Local host', 'Three tastings', 'Return transfer', 'Soft drinks'], description: 'A relaxed route through family kitchens and cellars with regional dishes and Georgian wine.' }
    ]
  },
  rental: {
    slug: 'rental',
    navTitle: 'Rental',
    title: 'Rental',
    kicker: 'Mountain equipment',
    description: 'Well-maintained skis, snowboards and safety equipment, fitted locally and delivered close to the slopes.',
    tabs: ['Ski', 'Snowboard', 'Safety'],
    filters: ['Equipment', 'Level', 'Size'],
    countLabel: 'rental options',
    promise: 'Fitting and slope-side delivery are included',
    promiseNote: 'Swap sizes during your rental if the fit is not right',
    startingPrice: 'from 45 GEL/day',
    heroImage: image('mosaic/rental-1-135-upd.png'),
    accent: 'sand',
    benefitsTitle: 'Why rent with My Gudauri',
    benefits: [['Freshly serviced', 'Edges, bases and bindings are checked before every rental.'], ['Easy fitting', 'Local technicians help choose the right size and setup.'], ['Flexible swaps', 'Change size or category if your plans change.'], ['Slope-side help', 'Delivery and support are available around the resort.']],
    faq: [
      { question: 'Is a deposit required?', answer: 'A photo ID is normally enough. Any special deposit requirement is shown before confirmation.' },
      { question: 'What if the size does not fit?', answer: 'Message support and the rental team will arrange a free size swap, subject to availability.' },
      { question: 'Where do I return the equipment?', answer: 'Ask about a convenient return point when you inquire. Slope-side collection is available for selected packages.' }
    ],
    items: [
      { slug: 'performance-ski-set', name: 'Performance ski set', category: 'Ski', price: '75 GEL', priceSuffix: 'per day', rating: '4.9', reviews: '98 reviews', tags: ['Intermediate+', 'Boots', 'Poles'], image: image('mosaic/rental-1-135-upd.png'), facts: [['Level', 'Intermediate+'], ['Sizes', '150–185 cm'], ['Boots', 'EU 36–48'], ['Service', 'Daily']], included: ['Skis', 'Boots', 'Poles', 'Slope delivery'], description: 'Responsive all-mountain skis for confident piste skiing and mixed conditions around Gudauri.' },
      { slug: 'snowboard-set', name: 'All-mountain snowboard set', category: 'Snowboard', price: '70 GEL', priceSuffix: 'per day', rating: '4.8', reviews: '74 reviews', tags: ['All levels', 'Boots', 'Helmet option'], image: image('service-snowboard.png'), facts: [['Level', 'All levels'], ['Boards', '138–166 cm'], ['Boots', 'EU 35–48'], ['Stance', 'Regular · Goofy']], included: ['Board', 'Bindings', 'Boots', 'Free fitting'], description: 'A forgiving, versatile snowboard package set up for your stance and riding level.' },
      { slug: 'freeride-ski-set', name: 'Freeride ski set', category: 'Powder', price: '95 GEL', priceSuffix: 'per day', rating: '4.9', reviews: '46 reviews', tags: ['Advanced', 'Wide ski', 'Poles'], image: image('mosaic/rental-1-137.png'), facts: [['Level', 'Advanced'], ['Waist', '100–115 mm'], ['Sizes', '170–190 cm'], ['Service', 'Daily']], included: ['Freeride skis', 'Boots', 'Poles', 'Expert setup'], description: 'Wide, stable skis for powder days and guided off-piste routes.' },
      { slug: 'kids-ski-set', name: 'Kids ski set', category: 'Children', price: '45 GEL', priceSuffix: 'per day', rating: '4.9', reviews: '61 reviews', tags: ['Ages 4–12', 'Helmet', 'Lightweight'], image: image('service-skis.png'), facts: [['Age', '4–12'], ['Sizes', '80–140 cm'], ['Boots', 'EU 25–36'], ['Helmet', 'Included']], included: ['Skis', 'Boots', 'Poles', 'Helmet'], description: 'Lightweight, easy-turning equipment for a comfortable first days on snow.' },
      { slug: 'avalanche-set', name: 'Avalanche safety set', category: 'Safety', price: '60 GEL', priceSuffix: 'per day', rating: '5.0', reviews: '39 reviews', tags: ['Beacon', 'Probe', 'Shovel'], image: image('mosaic/tours-slope-1-117.png'), facts: [['Beacon', '3 antenna'], ['Probe', '240 cm'], ['Shovel', 'Aluminium'], ['Check', 'Daily']], included: ['Beacon', 'Probe', 'Shovel', 'Quick briefing'], description: 'A complete, checked avalanche kit for guided freeride and ski touring days.' },
      { slug: 'premium-helmet-goggles', name: 'Helmet & goggles', category: 'Accessories', price: '30 GEL', priceSuffix: 'per day', rating: '4.7', reviews: '28 reviews', tags: ['All sizes', 'Anti-fog', 'Sanitised'], image: image('service-rental.png'), facts: [['Helmet', 'XS–XL'], ['Lens', 'All weather'], ['Fit', 'Adjustable'], ['Care', 'Sanitised']], included: ['Helmet', 'Goggles', 'Soft case', 'Fitting'], description: 'Comfortable protective essentials with an all-weather anti-fog lens.' }
    ]
  },
  transfers: {
    slug: 'transfers',
    navTitle: 'Transfers',
    title: 'Transfers',
    kicker: 'Routes to Gudauri',
    description: 'Reliable airport and regional transfers with winter-ready vehicles, fixed prices and drivers who know the mountain road.',
    tabs: ['From airport', 'Around the region'],
    filters: ['Route', 'Vehicle', 'Passengers'],
    countLabel: 'routes',
    promise: 'A fixed price for the whole vehicle, not per seat',
    promiseNote: 'Airport meet-and-greet and flight tracking are included',
    startingPrice: 'from 180 GEL',
    heroImage: image('mosaic/transfer-1-144-upd.png'),
    accent: 'blue',
    benefitsTitle: 'Why transfer with My Gudauri',
    benefits: [['Meet & greet', 'Your driver waits in arrivals with a name sign.'], ['Winter-ready cars', 'All vehicles are prepared for the mountain road.'], ['Fixed prices', 'No surcharge for luggage or a delayed flight.'], ['Child seats', 'Available free of charge when requested in advance.']],
    faq: [
      { question: 'What if my flight is delayed?', answer: 'After a provider confirms your transfer, they will explain how pickup timing is adjusted for flight delays.' },
      { question: 'How much luggage can I bring?', answer: 'Standard luggage and ski bags are included. Choose a minivan for larger groups or extra equipment.' },
      { question: 'Are child seats available?', answer: 'Yes. Add the child age to your request and we will provide the correct seat free of charge.' }
    ],
    items: [
      { slug: 'tbilisi-airport-gudauri', name: 'Tbilisi Airport → Gudauri', category: 'Airport transfer', price: '180 GEL', priceSuffix: 'per vehicle', rating: '4.9', reviews: '128 rides', tags: ['Sedan', 'Up to 3', '~2 hours'], image: image('mosaic/transfer-1-144-upd.png'), facts: [['Class', 'Comfort'], ['Seats', 'Up to 3'], ['Journey', '~2 hours'], ['Driver', 'EN · RU']], included: ['Meet & greet', 'Flight tracking', '60 min waiting', 'Ski luggage'], description: 'A private, direct transfer from Tbilisi International Airport to your accommodation in Gudauri.' },
      { slug: 'tbilisi-minivan-gudauri', name: 'Tbilisi → Gudauri minivan', category: 'Group transfer', price: '260 GEL', priceSuffix: 'per vehicle', rating: '4.8', reviews: '94 rides', tags: ['Minivan', 'Up to 7', '~2 hours'], image: image('service-transfer.png'), facts: [['Class', 'Minivan'], ['Seats', 'Up to 7'], ['Journey', '~2 hours'], ['Bags', '7 + skis']], included: ['Door pickup', 'Flight tracking', 'Ski luggage', 'Water'], description: 'A spacious private minivan for families and groups travelling from Tbilisi.' },
      { slug: 'kutaisi-gudauri', name: 'Kutaisi Airport → Gudauri', category: 'Airport transfer', price: '420 GEL', priceSuffix: 'per vehicle', rating: '4.8', reviews: '57 rides', tags: ['Sedan', 'Up to 3', '~4.5 hours'], image: image('mosaic/transfer-2104-1385.png'), facts: [['Class', 'Comfort'], ['Seats', 'Up to 3'], ['Journey', '~4.5 hours'], ['Stops', 'On request']], included: ['Meet & greet', 'Flight tracking', 'Comfort stop', 'Ski luggage'], description: 'A comfortable cross-country transfer from Kutaisi with a rest stop on the way.' },
      { slug: 'batumi-gudauri', name: 'Batumi → Gudauri', category: 'Long distance', price: '520 GEL', priceSuffix: 'per vehicle', rating: '4.7', reviews: '33 rides', tags: ['Sedan', 'Up to 3', '~6 hours'], image: image('mosaic/transfer-1-144.png'), facts: [['Class', 'Comfort'], ['Seats', 'Up to 3'], ['Journey', '~6 hours'], ['Stops', 'Two']], included: ['Door pickup', 'Two comfort stops', 'Ski luggage', 'Water'], description: 'A private transfer from the Black Sea coast to Gudauri with flexible comfort stops.' },
      { slug: 'kazbegi-gudauri', name: 'Kazbegi ↔ Gudauri', category: 'Regional route', price: '150 GEL', priceSuffix: 'per vehicle', rating: '4.9', reviews: '76 rides', tags: ['4×4', 'Up to 4', '~1 hour'], image: image('mosaic/tours-1-117-upd.png'), facts: [['Vehicle', '4×4'], ['Seats', 'Up to 4'], ['Journey', '~1 hour'], ['Route', 'Cross Pass']], included: ['Door pickup', 'Winter-ready 4×4', 'Luggage', 'Flexible time'], description: 'A winter-ready 4×4 transfer across the Cross Pass between Kazbegi and Gudauri.' },
      { slug: 'vladikavkaz-gudauri', name: 'Vladikavkaz → Gudauri', category: 'Border route', price: '390 GEL', priceSuffix: 'per vehicle', rating: '4.8', reviews: '44 rides', tags: ['Minivan', 'Border', '~3–6 hours'], image: image('service-transfer.png'), facts: [['Vehicle', 'Minivan'], ['Seats', 'Up to 6'], ['Border', 'Documents required'], ['Time', 'Variable']], included: ['Airport pickup', 'Border guidance', 'Ski luggage', 'Waiting'], description: 'Cross-border transfer with document guidance. Journey time depends on border and road conditions.' }
    ]
  },
  services: {
    slug: 'services', navTitle: 'Services', title: 'Services', kicker: 'Trusted local professionals',
    description: 'Photography, childcare, wellness and practical help from independent Gudauri professionals with clear packages.',
    tabs: ['Photo & video', 'Personal', 'Events'], filters: ['Service', 'Availability', 'Language'], countLabel: 'professionals',
    promise: 'Choose a ready-made package or request a custom plan', promiseNote: 'Every provider is reviewed before joining the platform', startingPrice: 'from 80 GEL',
    heroImage: image('mosaic/services-1-107.png'), accent: 'rad', benefitsTitle: 'Why choose local professionals',
    benefits: [['Verified profiles', 'Experience and portfolios are reviewed before publishing.'], ['Clear packages', 'Compare what is included without hidden add-ons.'], ['Local knowledge', 'Professionals know the best locations and suppliers.'], ['Human support', 'The local team helps coordinate every inquiry.']], faq: BROWSE_FAQ,
    items: [
      { slug: 'mountain-photo-session', name: 'Mountain photo session', category: 'Photography', price: '250 GEL', priceSuffix: 'per session', rating: '5.0', reviews: '48 reviews', tags: ['90 min', '30 photos', 'Gudauri'], image: image('mosaic/services-1-107.png'), facts: [['Duration', '90 min'], ['Photos', '30 edited'], ['Delivery', '5 days'], ['Languages', 'EN · RU']], included: ['Location planning', '90 min shoot', '30 edited photos', 'Private gallery'], description: 'A relaxed portrait or family session on the slopes with help choosing the best light and location.' },
      { slug: 'ski-video-reel', name: 'Ski video reel', category: 'Video', price: '390 GEL', priceSuffix: 'per session', rating: '4.9', reviews: '36 reviews', tags: ['2 hours', 'Vertical reel', 'Drone option'], image: image('mosaic/tours-riders-1-117.png'), facts: [['Duration', '2 hours'], ['Result', '45–60 sec'], ['Delivery', '7 days'], ['Format', '4K']], included: ['Route planning', 'Slope filming', 'Edited reel', 'Music license'], description: 'Dynamic follow-cam filming and a polished vertical reel from your best runs.' },
      { slug: 'evening-nanny', name: 'Evening nanny', category: 'Childcare', price: '80 GEL', priceSuffix: 'per hour', rating: '4.9', reviews: '65 reviews', tags: ['3 hour minimum', 'Verified', 'EN · RU'], image: image('service-services.png'), facts: [['Minimum', '3 hours'], ['Age', '1+'], ['Languages', 'EN · RU'], ['Check', 'Verified']], included: ['Intro call', 'Games', 'Meal help', 'Bedtime routine'], description: 'Experienced childcare at your accommodation, from an early dinner through bedtime.' },
      { slug: 'sports-massage', name: 'Sports recovery massage', category: 'Wellness', price: '140 GEL', priceSuffix: 'per hour', rating: '4.8', reviews: '51 reviews', tags: ['At your stay', '60 min', 'Recovery'], image: image('service-real-estate.png'), facts: [['Duration', '60 min'], ['Location', 'Your stay'], ['Style', 'Sports'], ['Setup', 'Included']], included: ['Massage table', 'Oils', 'Towels', 'Travel in Gudauri'], description: 'Targeted recovery after a full ski day, provided in the comfort of your accommodation.' },
      { slug: 'private-chef', name: 'Private Georgian dinner', category: 'Chef', price: '120 GEL', priceSuffix: 'per guest', rating: '5.0', reviews: '29 reviews', tags: ['4 courses', 'At your stay', '4+ guests'], image: image('service-places.png'), facts: [['Courses', '4'], ['Guests', '4–12'], ['Cuisine', 'Georgian'], ['Duration', '~3 hours']], included: ['Menu planning', 'Ingredients', 'Cooking', 'Kitchen cleanup'], description: 'A four-course Georgian dinner prepared and served in your apartment or chalet.' },
      { slug: 'event-decor', name: 'Mountain celebration setup', category: 'Events', price: '450 GEL', priceSuffix: 'per setup', rating: '4.9', reviews: '18 reviews', tags: ['Decor', 'Flowers', 'Custom plan'], image: image('mosaic/services-1-107.png'), facts: [['Planning', 'Included'], ['Setup', '2–3 hours'], ['Guests', 'Up to 20'], ['Style', 'Custom']], included: ['Moodboard', 'Decor rental', 'Flowers', 'Setup & removal'], description: 'A warm, considered setup for birthdays, proposals and intimate mountain celebrations.' }
    ]
  },
  stays: {
    slug: 'stays', navTitle: 'Stays', title: 'Stays', kicker: 'Slope-side stays',
    description: 'Apartments, hotels and chalets with honest location details, useful amenities and local inquiry support.',
    tabs: ['Apartments', 'Hotels', 'Chalets'], filters: ['Dates', 'Guests', 'Location'], countLabel: 'places to stay',
    promise: 'Real location details and clear starting prices', promiseNote: 'Ask the local team to confirm availability with the host', startingPrice: 'from 180 GEL/night',
    heroImage: image('service-real-estate.png'), accent: 'blue', benefitsTitle: 'Book your Gudauri stay with confidence',
    benefits: [['Verified listings', 'Photos and essential property details are reviewed.'], ['Slope distance', 'See the real walk or ski route to the nearest lift.'], ['Host confirmation', 'Availability is checked directly with the host.'], ['Local support', 'Help is nearby throughout your stay.']], faq: BROWSE_FAQ,
    items: [
      { slug: 'four-seasons-loft', name: 'Four Seasons slope loft', category: 'New Gudauri', price: '260 GEL', priceSuffix: 'per night', rating: '4.9', reviews: '72 stays', tags: ['4 guests', 'Ski-in', 'Mountain view'], image: image('service-real-estate.png'), facts: [['Guests', '4'], ['Beds', '2'], ['Size', '42 m²'], ['Lift', '120 m']], included: ['Kitchen', 'Ski storage', 'Wi-Fi', 'Mountain view'], description: 'A bright, compact loft with a balcony and easy access to the GoodAura gondola.' },
      { slug: 'neo-family-apartment', name: 'NEO family apartment', category: 'New Gudauri', price: '310 GEL', priceSuffix: 'per night', rating: '4.8', reviews: '58 stays', tags: ['6 guests', '2 bedrooms', 'Gondola'], image: image('mosaic/places-1-154.png'), facts: [['Guests', '6'], ['Bedrooms', '2'], ['Size', '68 m²'], ['Lift', '180 m']], included: ['Full kitchen', 'Washer', 'Ski storage', 'Parking'], description: 'A comfortable two-bedroom apartment for families, minutes from the gondola and restaurants.' },
      { slug: 'atrium-ski-in', name: 'Atrium ski-in studio', category: 'New Gudauri', price: '220 GEL', priceSuffix: 'per night', rating: '4.9', reviews: '83 stays', tags: ['3 guests', 'Ski-in/out', 'SPA'], image: image('mosaic/tours-1-117-upd.png'), facts: [['Guests', '3'], ['Beds', '2'], ['Size', '35 m²'], ['Slope', 'At the door']], included: ['Kitchenette', 'Ski room', 'Wi-Fi', 'SPA access option'], description: 'A true ski-in/ski-out studio with direct slope access and optional wellness facilities.' },
      { slug: 'panorama-chalet', name: 'Panorama private chalet', category: 'Upper Gudauri', price: '980 GEL', priceSuffix: 'per night', rating: '5.0', reviews: '24 stays', tags: ['10 guests', 'Sauna', 'Fireplace'], image: image('mosaic/tours-2104-1380.png'), facts: [['Guests', '10'], ['Bedrooms', '4'], ['Size', '210 m²'], ['Lift', '5 min drive']], included: ['Private sauna', 'Fireplace', 'Breakfast', 'Resort transfer'], description: 'A private mountain chalet for groups, with wide views, a sauna and daily resort transfers.' },
      { slug: 'twins-view-room', name: 'Twins mountain room', category: 'Hotel', price: '180 GEL', priceSuffix: 'per night', rating: '4.7', reviews: '47 stays', tags: ['2 guests', 'Breakfast', 'View'], image: image('service-places.png'), facts: [['Guests', '2'], ['Bed', 'Queen'], ['Breakfast', 'Included'], ['Lift', '500 m']], included: ['Breakfast', 'Wi-Fi', 'Reception', 'Ski storage'], description: 'A simple, comfortable hotel room with breakfast and a view across the valley.' },
      { slug: 'loft-long-stay', name: 'Quiet loft for a long stay', category: 'Lower Gudauri', price: '190 GEL', priceSuffix: 'per night', rating: '4.8', reviews: '39 stays', tags: ['2 guests', 'Workspace', 'Weekly rate'], image: image('service-real-estate.png'), facts: [['Guests', '2'], ['Workspace', 'Yes'], ['Size', '38 m²'], ['Minimum', '5 nights']], included: ['Kitchen', 'Fast Wi-Fi', 'Washer', 'Weekly cleaning'], description: 'A calm, well-equipped base with a proper workspace and discounted weekly rates.' }
    ]
  },
  places: {
    slug: 'places', navTitle: 'Places', title: 'Places', kicker: 'Food, wellness and essentials',
    description: 'A practical local guide to restaurants, bars, spas, shops and useful places around Gudauri.',
    tabs: ['Food & drink', 'Wellness', 'Useful'], filters: ['Category', 'Area', 'Open now'], countLabel: 'local places',
    promise: 'Current opening hours and honest local recommendations', promiseNote: 'Table and spa requests are confirmed directly with the venue', startingPrice: 'local favourites',
    heroImage: image('mosaic/places-1-154.png'), accent: 'olive', benefitsTitle: 'A useful guide, curated locally',
    benefits: [['Current details', 'Seasonal opening hours are checked regularly.'], ['Useful filters', 'Find what is open, nearby and right for your group.'], ['Local picks', 'A considered edit rather than an endless directory.'], ['Inquiry help', 'Ask the local team about a restaurant table or spa visit.']], faq: BROWSE_FAQ,
    items: [
      { slug: 'drunk-cherry', name: 'Drunk Cherry', category: 'Restaurant · Bar', price: '60 GEL', priceSuffix: 'average spend', rating: '4.8', reviews: '214 reviews', tags: ['Open late', 'Georgian', 'Cocktails'], image: image('mosaic/places-1-154.png'), facts: [['Cuisine', 'Georgian'], ['Hours', '12:00–02:00'], ['Area', 'New Gudauri'], ['Spend', '~60 GEL']], included: ['Vegetarian options', 'Cocktail bar', 'Terrace', 'Table request'], description: 'Modern Georgian comfort food, a lively bar and a convenient location in New Gudauri.' },
      { slug: 'black-dog-bar', name: 'Black Dog Bar', category: 'Bar', price: '45 GEL', priceSuffix: 'average spend', rating: '4.7', reviews: '173 reviews', tags: ['Après-ski', 'Burgers', 'Live DJ'], image: image('service-places.png'), facts: [['Style', 'Après-ski'], ['Hours', '16:00–02:00'], ['Area', 'New Gudauri'], ['Spend', '~45 GEL']], included: ['Food menu', 'Cocktails', 'DJ nights', 'Walk-ins'], description: 'A relaxed après-ski bar for burgers, drinks and late mountain evenings.' },
      { slug: 'gudauri-lodge-spa', name: 'Gudauri Lodge Spa', category: 'SPA & pool', price: '120 GEL', priceSuffix: 'day visit', rating: '4.9', reviews: '89 reviews', tags: ['Pool', 'Sauna', 'Massage'], image: image('service-real-estate.png'), facts: [['Hours', '10:00–22:00'], ['Area', 'Central'], ['Booking', 'Required'], ['Children', 'Until 18:00']], included: ['Pool', 'Sauna', 'Steam room', 'Towel'], description: 'A warm indoor pool and sauna circuit for a slow recovery afternoon.' },
      { slug: 'platforma-cafe', name: 'Platforma Coffee', category: 'Cafe', price: '25 GEL', priceSuffix: 'average spend', rating: '4.8', reviews: '126 reviews', tags: ['Breakfast', 'Coffee', 'Laptop friendly'], image: image('mosaic/services-1-107.png'), facts: [['Cuisine', 'Cafe'], ['Hours', '08:00–20:00'], ['Area', 'New Gudauri'], ['Wi-Fi', 'Fast']], included: ['Specialty coffee', 'Breakfast', 'Vegetarian options', 'Wi-Fi'], description: 'Good coffee, all-day breakfast and a calm corner for a little work between ski days.' },
      { slug: 'smart-market', name: 'Smart Market Gudauri', category: 'Supermarket', price: 'Daily', priceSuffix: '08:00–23:00', rating: '4.5', reviews: '91 reviews', tags: ['Groceries', 'Wine', 'Essentials'], image: image('service-rental.png'), facts: [['Hours', '08:00–23:00'], ['Area', 'Central'], ['Delivery', 'Limited'], ['ATM', 'Nearby']], included: ['Fresh food', 'Local wine', 'Household goods', 'Ski snacks'], description: 'A practical supermarket for groceries, local wine and everyday essentials.' },
      { slug: 'friendship-monument', name: 'Friendship Monument viewpoint', category: 'Viewpoint', price: 'Free', priceSuffix: 'public place', rating: '4.9', reviews: '340 reviews', tags: ['Panorama', 'Sunset', 'Roadside'], image: image('mosaic/tours-2104-1380.png'), facts: [['Access', 'Free'], ['Drive', '15 min'], ['Best time', 'Sunset'], ['Season', 'All year']], included: ['Panoramic view', 'Monument', 'Photo stop', 'Parking'], description: 'One of the region’s widest views, framed by the colourful Soviet-era mosaic monument.' }
    ]
  }
};

export { ARTICLES } from './articles';

export function getDestination(section) {
  return DESTINATIONS[section] ?? null;
}

export function getDestinationItem(section, slug) {
  return getDestination(section)?.items.find((item) => item.slug === slug) ?? null;
}
