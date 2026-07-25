const BROWSE_FAQ_EN = [
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

export const en = {
  language: {
    label: 'Language',
    switcherLabel: 'Choose language',
    selected: 'Selected'
  },
  nav: {
    homeLabel: 'My Gudauri home',
    mainLabel: 'Main navigation',
    mobileLabel: 'Mobile navigation',
    siteLabel: 'Site navigation',
    categories: 'Categories',
    articles: 'Articles',
    about: 'About Gudauri',
    contacts: 'Contacts',
    offer: 'Offer a service',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    promoLabel: 'Featured category',
    promoTitle: 'Find the right ski instructor',
    promoButton: 'Browse instructors'
  },
  categories: {
    instructors: {
      title: 'Instructors',
      description: 'Verified ski and snowboard coaches',
      imageAlt: 'Instructor',
      tags: ['Ski', 'Snowboard']
    },
    activities: {
      title: 'Activities',
      description: 'Routes, freeride and mountain adventures',
      imageAlt: 'Mountain activity',
      tags: ['Freeride', 'Ski tour']
    },
    services: {
      title: 'Services',
      description: 'Photo, video, childcare and local professionals',
      imageAlt: 'Local professional',
      tags: ['Nannies', 'Photo', 'Video']
    },
    rental: {
      title: 'Rental',
      description: 'Equipment for every level and riding style',
      imageAlt: 'Ski equipment',
      tags: ['Ski', 'Snowboard']
    },
    transfers: {
      title: 'Transfers',
      description: 'Tbilisi, Kutaisi, Batumi and regional routes',
      imageAlt: 'Transfer van',
      tags: ['Batumi — Gudauri', 'Tbilisi — Gudauri']
    },
    stays: {
      title: 'Stays',
      description: 'Apartments, hotels and chalets close to the slopes',
      imageAlt: 'Apartment near the slopes',
      tags: ['Apartments']
    },
    places: {
      title: 'Places',
      description: 'Restaurants, wellness and local essentials',
      imageAlt: 'Mountain cafe',
      tags: ['Bars', 'Restaurants']
    }
  },
  home: {
    heroContextLabel: 'Gudauri guide context',
    heroBadgeLocal: 'Local guide',
    heroBadgeSeason: 'Winter 2026',
    heroSubtitle: 'Trusted local services for an effortless mountain stay.',
    aboutLinkTitle: 'About Gudauri',
    aboutLinkNote: 'Resort map & guide',
    essentialsKicker: 'Gudauri essentials',
    essentialsTitleLead: 'Everything you need,',
    essentialsTitleAccent: 'in one place.',
    essentialsDescription: 'Plan less. Ski more. Choose verified people and services with clear details and local support.',
    instructorsKicker: 'Verified professionals',
    instructorsTitle: 'Find your instructor',
    instructorsIntro: 'Compare experience, languages and real guest reviews to find the right teaching style for you.',
    instructorsAction: 'Show all instructors'
  },
  faq: {
    kicker: 'Frequently Asked Questions',
    title: 'FAQ',
    objectKicker: 'Good to know',
    objectTitle: 'Common questions',
    items: [
      {
        question: 'Is the price different for each instructor?',
        answer: 'All instructors follow the same official rate. You choose by teaching style, experience, language and guest reviews.'
      },
      {
        question: 'How are lesson hours distributed across days?',
        answer: 'Hours can be split across multiple days based on weather conditions, your pace and instructor availability.'
      },
      {
        question: 'How does the booking process work?',
        answer: 'Select an instructor, submit lesson details, receive confirmation, and coordinate final timing after approval.'
      },
      {
        question: 'When do I receive instructor contact details?',
        answer: 'Contact details are shared after booking confirmation so you can coordinate your meeting point and start time.'
      }
    ]
  },
  catalog: {
    common: {
      benefitsKicker: 'Why My Gudauri',
      filtersTitle: 'Refine results',
      categoriesLabel: '{{title}} categories',
      filtersAriaLabel: '{{title}} filters',
      resultsAriaLabel: '{{title}} results',
      clearAll: 'Clear all',
      loading: 'Loading {{items}}…',
      error: '{{items}} are temporarily unavailable. Please try again later.',
      empty: 'No offers match these filters yet.',
      showAll: 'Show all offers',
      promiseLabel: 'Service promise'
    },
    groups: {
      filters: 'Filters',
      language: 'Language',
      gender: 'Gender',
      specialty: 'Focus',
      level: 'Level',
      duration: 'Duration',
      format: 'Format',
      audience: 'Audience',
      pickup: 'Pickup',
      group: 'Group',
      vehicle: 'Vehicle',
      location: 'Location',
      access: 'Access',
      guests: 'Guests',
      hours: 'Hours',
      booking: 'Booking'
    },
    instructors: {
      kicker: 'Verified local experts',
      description: 'Compare teaching styles, languages and experience to find the right instructor for your time in Gudauri.',
      countLabel: 'instructors',
      countLabelOne: 'instructor',
      benefitsTitle: 'Why choose My Gudauri instructors',
      benefits: [
        { title: 'Verified professionals', description: 'Every instructor is reviewed before joining the platform.' },
        { title: 'Transparent pricing', description: 'The same official rate for everyone, with no hidden markups.' },
        { title: 'Real profiles', description: 'Compare experience, languages, reviews and teaching style.' },
        { title: 'Flexible scheduling', description: 'Split lesson hours across days in a way that suits you.' }
      ],
      bookingKicker: 'Booking guide',
      bookingTitle: 'How it works',
      bookingSteps: [
        { title: 'Send your request', description: 'Share your dates, group and lesson goals.' },
        { title: 'We check availability', description: 'A manager finds the best available match.' },
        { title: 'Confirm before booking', description: 'You receive the instructor, schedule and final price.' }
      ],
      faq: [
        { question: 'How does booking work?', answer: 'Send a request with your preferred date and details. A local booking manager checks availability before you receive a secure payment link.' },
        { question: 'Is the price final?', answer: 'The price and everything included are shown before payment. If your request needs a custom quote, we will confirm it with you first.' },
        { question: 'Can I change or cancel my request?', answer: 'Yes. Contact support with your booking reference and we will explain the options for your specific service.' }
      ],
      disciplinesLabel: 'Instructor disciplines',
      filtersTitle: 'Find the right fit',
      concierge: {
        ariaLabel: 'Personal instructor selection',
        kicker: 'Personal matching',
        title: 'Tell us your dates and what you need.',
        text: 'We will check availability and suggest an instructor for your language, group and lesson goals.',
        action: 'Ask us to choose'
      },
      pricing: {
        ariaLabel: 'Instructor pricing information',
        kicker: 'Simple pricing',
        title: 'One rate for every instructor',
        text: 'Choose by teaching style, language and experience — not by price.',
        note: 'Instructor profiles do not compete on price. Your final total depends on lesson duration and group size.',
        helpLabel: 'How instructor pricing works',
        closeLabel: 'Close pricing guide'
      },
      categories: {
        all: { label: 'All instructors', description: 'Verified local professionals' },
        ski: { label: 'Ski', description: 'Piste and technique lessons' },
        snowboard: { label: 'Snowboard', description: 'Technique and all-mountain lessons' }
      },
      refinements: {
        russian: 'Russian',
        english: 'English',
        georgian: 'Georgian',
        male: 'Male',
        female: 'Female',
        kids: 'Works with children',
        'first-lessons': 'First lessons',
        technique: 'Technique',
        carving: 'Carving',
        freeride: 'Freeride',
        freestyle: 'Freestyle'
      }
    },
    activities: {
      kicker: 'Mountain experiences',
      description: 'Discover Gudauri beyond the piste with trusted local guides, clear itineraries and equipment included where you need it.',
      countLabel: 'experiences',
      countLabelOne: 'experience',
      promise: 'Guides, transport and essential equipment in one clear price',
      promiseNote: 'Private and small-group formats are available',
      startingPrice: 'from 90 GEL',
      benefitsTitle: 'Why explore with My Gudauri',
      benefits: [
        { title: 'Local guides', description: 'Routes led by people who know the mountain and current conditions.' },
        { title: 'Clear itineraries', description: 'Duration, difficulty and what to bring are explained before an inquiry.' },
        { title: 'Safety first', description: 'Verified providers and the right equipment for every activity.' },
        { title: 'Flexible formats', description: 'Choose a private experience or join a small group.' }
      ],
      faq: [
        { question: 'Do I need previous experience?', answer: 'Most activities offer beginner-friendly formats. The required level is listed on every experience page.' },
        { question: 'What happens in bad weather?', answer: 'The guide monitors conditions and will suggest a safe alternative date or route if needed.' },
        { question: 'Is equipment included?', answer: 'Each page lists exactly what is included. Specialist equipment is included unless the offer says otherwise.' }
      ],
      categories: {
        all: { label: 'All adventures', description: 'Every way to explore Gudauri' }
      }
    },
    rental: {
      kicker: 'Mountain equipment',
      description: 'Well-maintained skis, snowboards and safety equipment, fitted locally and delivered close to the slopes.',
      countLabel: 'rental options',
      countLabelOne: 'rental option',
      promise: 'Fitting and slope-side delivery are included',
      promiseNote: 'Swap sizes during your rental if the fit is not right',
      startingPrice: 'from 45 GEL/day',
      benefitsTitle: 'Why rent with My Gudauri',
      benefits: [
        { title: 'Freshly serviced', description: 'Edges, bases and bindings are checked before every rental.' },
        { title: 'Easy fitting', description: 'Local technicians help choose the right size and setup.' },
        { title: 'Flexible swaps', description: 'Change size or category if your plans change.' },
        { title: 'Slope-side help', description: 'Delivery and support are available around the resort.' }
      ],
      faq: [
        { question: 'Is a deposit required?', answer: 'A photo ID is normally enough. Any special deposit requirement is shown before confirmation.' },
        { question: 'What if the size does not fit?', answer: 'Message support and the rental team will arrange a free size swap, subject to availability.' },
        { question: 'Where do I return the equipment?', answer: 'Ask about a convenient return point when you inquire. Slope-side collection is available for selected packages.' }
      ],
      categories: {
        all: { label: 'All equipment', description: 'Everything for a day on snow' },
        ski: { label: 'Ski sets', description: 'Piste, powder and kids' },
        snowboard: { label: 'Snowboard', description: 'All-mountain setup' },
        safety: { label: 'Safety & extras', description: 'Protection and avalanche gear' }
      },
      refinements: {
        'all-levels': 'All levels',
        advanced: 'Advanced',
        kids: 'For children'
      }
    },
    transfers: {
      kicker: 'Routes to Gudauri',
      description: 'Reliable airport and regional transfers with winter-ready vehicles, fixed prices and drivers who know the mountain road.',
      countLabel: 'routes',
      countLabelOne: 'route',
      promise: 'A fixed price for the whole vehicle, not per seat',
      promiseNote: 'Airport meet-and-greet and flight tracking are included',
      startingPrice: 'from 180 GEL',
      benefitsTitle: 'Why transfer with My Gudauri',
      benefits: [
        { title: 'Meet & greet', description: 'Your driver waits in arrivals with a name sign.' },
        { title: 'Winter-ready cars', description: 'All vehicles are prepared for the mountain road.' },
        { title: 'Fixed prices', description: 'No surcharge for luggage or a delayed flight.' },
        { title: 'Child seats', description: 'Available free of charge when requested in advance.' }
      ],
      faq: [
        { question: 'What if my flight is delayed?', answer: 'After a provider confirms your transfer, they will explain how pickup timing is adjusted for flight delays.' },
        { question: 'How much luggage can I bring?', answer: 'Standard luggage and ski bags are included. Choose a minivan for larger groups or extra equipment.' },
        { question: 'Are child seats available?', answer: 'Yes. Add the child age to your request and we will provide the correct seat free of charge.' }
      ],
      categories: {
        all: { label: 'All routes', description: 'Airport and regional transfers' },
        tbilisi: { label: 'Tbilisi ↔ Gudauri', description: 'Airport and city pickup' },
        kutaisi: { label: 'Kutaisi ↔ Gudauri', description: 'Private airport transfer' },
        regional: { label: 'Regional routes', description: 'Batumi, Kazbegi and Vladikavkaz' }
      },
      refinements: {
        airport: 'Airport pickup',
        groups: 'For groups',
        'four-by-four': 'Winter 4×4'
      }
    },
    services: {
      kicker: 'Trusted local professionals',
      description: 'Photography, childcare, wellness and practical help from independent Gudauri professionals with clear packages.',
      countLabel: 'professionals',
      countLabelOne: 'professional',
      promise: 'Choose a ready-made package or request a custom plan',
      promiseNote: 'Every provider is reviewed before joining the platform',
      startingPrice: 'from 80 GEL',
      benefitsTitle: 'Why choose local professionals',
      benefits: [
        { title: 'Verified profiles', description: 'Experience and portfolios are reviewed before publishing.' },
        { title: 'Clear packages', description: 'Compare what is included without hidden add-ons.' },
        { title: 'Local knowledge', description: 'Professionals know the best locations and suppliers.' },
        { title: 'Human support', description: 'The local team helps coordinate every inquiry.' }
      ],
      faq: BROWSE_FAQ_EN,
      categories: {
        all: { label: 'All services', description: 'Local help for your stay' },
        photo: { label: 'Photo & video', description: 'Memories from the mountain' },
        care: { label: 'Childcare & wellness', description: 'Time for the whole group' },
        hosting: { label: 'Dining & events', description: 'Private moments, well planned' }
      },
      refinements: {
        'at-your-stay': 'At your stay',
        family: 'For families',
        custom: 'Custom plan'
      }
    },
    stays: {
      kicker: 'Slope-side stays',
      description: 'Apartments, hotels and chalets with honest location details, useful amenities and local inquiry support.',
      countLabel: 'places to stay',
      countLabelOne: 'place to stay',
      promise: 'Real location details and clear starting prices',
      promiseNote: 'Ask the local team to confirm availability with the host',
      startingPrice: 'from 180 GEL/night',
      benefitsTitle: 'Book your Gudauri stay with confidence',
      benefits: [
        { title: 'Verified listings', description: 'Photos and essential property details are reviewed.' },
        { title: 'Slope distance', description: 'See the real walk or ski route to the nearest lift.' },
        { title: 'Host confirmation', description: 'Availability is checked directly with the host.' },
        { title: 'Local support', description: 'Help is nearby throughout your stay.' }
      ],
      faq: BROWSE_FAQ_EN,
      categories: {
        all: { label: 'All stays', description: 'Apartments, hotels and chalets' },
        apartments: { label: 'Apartments', description: 'Independent stays in Gudauri' },
        chalets: { label: 'Chalets', description: 'Space for groups and families' },
        hotels: { label: 'Hotels', description: 'A room with useful services' }
      },
      refinements: {
        'ski-in': 'Ski-in / ski-out',
        family: 'Family stays',
        'two-guests': 'For two guests'
      }
    },
    places: {
      kicker: 'Food, wellness and essentials',
      description: 'A practical local guide to restaurants, bars, spas, shops and useful places around Gudauri.',
      countLabel: 'local places',
      countLabelOne: 'local place',
      promise: 'Current opening hours and honest local recommendations',
      promiseNote: 'Table and spa requests are confirmed directly with the venue',
      startingPrice: 'local favourites',
      benefitsTitle: 'A useful guide, curated locally',
      benefits: [
        { title: 'Current details', description: 'Seasonal opening hours are checked regularly.' },
        { title: 'Useful filters', description: 'Find what is open, nearby and right for your group.' },
        { title: 'Local picks', description: 'A considered edit rather than an endless directory.' },
        { title: 'Inquiry help', description: 'Ask the local team about a restaurant table or spa visit.' }
      ],
      faq: BROWSE_FAQ_EN,
      categories: {
        all: { label: 'All places', description: 'Eat, recharge and explore' },
        food: { label: 'Restaurants & cafés', description: 'Meals and good coffee' },
        bars: { label: 'Bars', description: 'Après-ski and late evenings' },
        wellness: { label: 'Spa & useful', description: 'Recovery and essentials' }
      },
      refinements: {
        late: 'Open late',
        'new-gudauri': 'New Gudauri',
        bookable: 'Book ahead'
      }
    }
  },
  search: {
    label: 'Find your Gudauri',
    placeholder: 'Find instructors, stays, transfers, places…',
    clear: 'Clear search',
    popular: 'Popular searches',
    resultsLabel: 'Search results',
    matching: 'Matching everything in My Gudauri',
    emptyTitle: 'Nothing found yet',
    emptyHint: 'Try “ski”, “transfer”, “restaurant” or “apartment”.',
    sectionType: 'Section',
    articleType: 'Article',
    quick: ['Ski instructor', 'Freeride', 'Transfer from Tbilisi', 'Apartments']
  },
  object: {
    notFound: 'Page not found',
    backToCatalogue: 'Back to catalogue',
    backTo: 'Back to {{section}}',
    mediaAlt: '{{name}} in Gudauri',
    requestAvailability: 'Request availability',
    aboutKicker: 'About the offer',
    aboutTitle: 'What to expect',
    tagsLabel: 'Useful details',
    includedKicker: 'Included essentials',
    includedTitle: 'What is included',
    continueRequest: 'Continue request',
    unavailableText: 'Please try again later.',
    openGallery: 'Open gallery',
    photo: 'photo',
    photos: 'photos',
    bookingSteps: [
      { title: 'Send your request', description: 'Choose the date, group details and the format that suits you.' },
      { title: 'We check the details', description: 'A local manager confirms availability and the final price.' },
      { title: 'Receive confirmation', description: 'Get the meeting details and a secure payment link.' }
    ]
  },
  activity: {
    notFound: 'Activity not found',
    backToList: 'Back to activities',
    unavailable: 'Activity is temporarily unavailable',
    aboutKicker: 'About the activity',
    scheduleKicker: 'Plan your day',
    scheduleTitle: 'Schedule',
    bookingDetailsKicker: 'Booking details',
    includedTitle: 'Included and not included',
    packKicker: 'Pack for the day',
    packTitle: 'What to bring',
    reviewsKicker: 'Guest experience',
    reviewsTitle: 'Reviews',
    related: 'More activities',
    galleryLabel: 'Activity media',
    bookingSteps: [
      { title: 'Send your request', description: 'Choose your date, group size and preferred activity format.' },
      { title: 'We check conditions', description: 'A local manager confirms timing, guide availability and weather details.' },
      { title: 'Receive confirmation', description: 'Get your meeting point and final activity details before payment.' }
    ]
  },
  instructor: {
    notFound: 'Instructor not found',
    backToList: 'Back to instructors',
    unavailable: 'Profile is temporarily unavailable',
    specialization: 'Specialization',
    languages: 'Languages',
    experience: 'Experience',
    experienceValue: '{{years}}+ years',
    aboutTitle: 'About the instructor',
    tagsLabel: 'Lesson focus',
    configureTitle: 'Configure your lesson',
    related: 'More instructors',
    galleryLabel: 'Instructor media',
    typeLabel: 'Private instructor'
  },
  footer: {
    tagline: 'One trusted local guide for instructors, mountain experiences, stays and everything around Gudauri.',
    services: 'Services',
    instructors: 'Instructors',
    activities: 'Activities',
    rental: 'Rental',
    transfers: 'Transfers',
    localServices: 'Local services',
    explore: 'Explore',
    stays: 'Stays',
    places: 'Places',
    articles: 'Articles',
    about: 'About Gudauri',
    contact: 'Contact',
    location: 'Gudauri, Georgia',
    professional: 'Are you a local professional?',
    offer: 'Offer a service',
    contacts: 'Contacts',
    privacy: 'Privacy',
    cookies: 'Cookies',
    independent: 'Independent local platform'
  },
  contacts: {
    pageTitle: 'Contacts — My Gudauri',
    kicker: 'Contact My Gudauri',
    title: 'Here when you need a local answer.',
    intro: 'Questions about a service, a booking or cooperation? Contact the My Gudauri team directly. We keep communication clear and connect you with the right local specialist.',
    status: 'Working locally in Gudauri, Georgia',
    emailTitle: 'General enquiries',
    emailNote: 'Questions about the platform and services',
    phoneTitle: 'Phone',
    phoneNote: 'For time-sensitive questions',
    locationTitle: 'Service area',
    locationNote: 'Gudauri and the Kazbegi Municipality',
    detailsKicker: 'Platform details',
    detailsTitle: 'Who you are contacting',
    detailsText: 'The essential details in one place. Official company information can be requested before entering into an agreement.',
    brandLabel: 'Brand and platform',
    brandValue: 'My Gudauri',
    formatLabel: 'Service format',
    formatValue: 'Independent local information and services platform',
    regionLabel: 'Operating region',
    regionValue: 'Gudauri, Kazbegi Municipality, Georgia',
    legalLabel: 'Legal entity and registered address',
    legalValue: 'Request official details',
    trustKicker: 'Built for clarity',
    trustTitle: 'A straightforward way to work with us',
    verifiedTitle: 'Clear provider profiles',
    verifiedText: 'We structure service information so you can compare the important details before contacting a provider.',
    directTitle: 'Direct communication',
    directText: 'You can reach the platform team by email or phone without searching through multiple channels.',
    localTitle: 'Local focus',
    localText: 'The platform is dedicated to Gudauri and the surrounding mountain region.',
    responseKicker: 'Need help?',
    responseTitle: 'Tell us what happened — we will point you in the right direction.',
    responseText: 'Include the service, provider name and relevant date so we can understand your question faster.',
    write: 'Write to us'
  }
};
