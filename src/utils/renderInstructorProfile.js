function createElement(document, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatRating(rating) {
  return Number(rating).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatReviewDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(value));
}

function buildPills(document, container, items) {
  container.replaceChildren(...items.map((item) => createElement(document, 'span', 'fact-pill ui-pill-md', item)));
}

function buildSectionHeadings(document) {
  document.querySelectorAll('[data-section-heading]').forEach((mount, index) => {
    const headingId = `profile-section-title-${index + 1}`;
    const header = createElement(document, 'header', 'section-heading section-heading--md section-heading--start');
    const kicker = createElement(document, 'p', 'section-heading__kicker', mount.dataset.kicker);
    const title = createElement(document, 'h2', 'section-heading__title', mount.dataset.title);
    title.id = headingId;
    header.append(kicker, title);
    mount.closest('section')?.setAttribute('aria-labelledby', headingId);
    mount.replaceWith(header);
  });
}

function buildReviews(document, instructor) {
  const reviewsGrid = document.querySelector('.reviews-grid');
  const reviews = instructor.reviewsList ?? [];

  if (!reviews.length) {
    reviewsGrid.replaceChildren(createElement(document, 'p', 'profile-empty-state', 'No published reviews yet.'));
    return;
  }

  reviewsGrid.replaceChildren(...reviews.map((review) => {
    const card = createElement(document, 'article', 'review-card');
    const head = createElement(document, 'div', 'review-head');
    const avatar = createElement(document, 'div', 'avatar');
    const hasStandaloneAvatar = review.avatar && !review.avatar.includes('avatars-sprite');

    if (hasStandaloneAvatar) {
      const avatarImage = createElement(document, 'img');
      avatarImage.src = review.avatar;
      avatarImage.alt = review.author;
      avatar.append(avatarImage);
    } else {
      avatar.append(createElement(document, 'span', '', review.author.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()));
    }

    const author = createElement(document, 'div');
    author.append(createElement(document, 'h3', '', review.author), createElement(document, 'p', '', review.lesson));
    head.append(avatar, author);

    const meta = createElement(document, 'div', 'review-meta');
    const stars = createElement(document, 'img');
    stars.src = '/assets/design-3/stars-review.svg';
    stars.alt = `${review.rating} stars`;
    const dot = createElement(document, 'img');
    dot.src = '/assets/design-3/dot-review.svg';
    dot.alt = '';
    dot.setAttribute('aria-hidden', 'true');
    meta.append(stars, dot, createElement(document, 'span', '', formatReviewDate(review.date)));
    card.append(head, meta, createElement(document, 'p', 'review-text', review.body));
    return card;
  }));
}

function buildMedia(document, instructor) {
  const media = instructor.media?.length
    ? instructor.media
    : [{ type: 'image', src: instructor.heroImage, thumbnail: instructor.heroImage, alt: instructor.heroImageAlt, featured: true }];

  const thumbs = document.querySelector('.profile-gallery-trigger__thumbs');
  thumbs.replaceChildren(...media.slice(0, 3).map((item) => {
    const image = createElement(document, 'img');
    image.src = item.thumbnail || item.src;
    image.alt = '';
    return image;
  }));

  const galleryMeta = document.querySelector('.profile-gallery-trigger small');
  galleryMeta.textContent = `${media.length} ${media.length === 1 ? 'photo' : 'photos'}`;

  const grid = document.querySelector('.media-grid');
  grid.replaceChildren(...media.slice(1, 6).map((item, index) => {
    const button = createElement(document, 'button', `media-card media-${index + 1}`);
    button.type = 'button';
    button.dataset.profileGalleryOpen = '';
    button.dataset.galleryIndex = String(index + 1);
    const image = createElement(document, 'img');
    image.src = item.thumbnail || item.src;
    image.alt = item.alt;
    button.append(image);
    return button;
  }));

  return media;
}

export function renderInstructorProfile(template, instructor) {
  const parser = new DOMParser();
  const document = parser.parseFromString(template, 'text/html');
  const sports = instructor.sports.map((sport) => sport.name);
  const languages = instructor.languages.map((language) => language.code);

  buildSectionHeadings(document);

  const badges = document.querySelector('.profile-badges-row');
  badges.replaceChildren(...instructor.sports.map((sport) => {
    const badge = createElement(document, 'span', 'profile-badge ui-pill-md');
    const icon = createElement(document, 'img');
    icon.src = sport.icon;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    badge.append(icon, document.createTextNode(sport.name));
    return badge;
  }), createElement(document, 'span', 'profile-role', instructor.role));

  document.querySelector('.profile-title').textContent = instructor.name;
  document.querySelector('.profile-rating-main > span').textContent = formatRating(instructor.rating);
  document.querySelector('.profile-rating-main > img').alt = `${instructor.rating} stars`;
  document.querySelector('.profile-rating-main a').textContent = `${instructor.reviews} reviews`;

  const introParagraphs = document.querySelectorAll('.profile-hero-intro > p');
  introParagraphs[0].textContent = instructor.tagline;
  introParagraphs[1].textContent = instructor.intro;
  const stats = document.querySelectorAll('.profile-hero-intro dl > div');
  stats[0].querySelector('dt').textContent = `${instructor.experienceYears}+`;
  stats[1].querySelector('dt').textContent = String(instructor.languages.length);
  stats[2].querySelector('dt').textContent = Number(instructor.rating).toFixed(1);

  const hero = document.querySelector('.profile-hero-photo');
  hero.src = instructor.heroImage;
  hero.alt = instructor.heroImageAlt;
  const availability = document.querySelector('.profile-availability');
  availability.lastChild.textContent = instructor.availability || 'Schedule on request';

  const factBottoms = document.querySelectorAll('.profile-facts .fact-bottom');
  buildPills(document, factBottoms[0], sports);
  buildPills(document, factBottoms[1], languages);
  factBottoms[2].querySelector('.fact-pill').textContent = `${instructor.experienceYears}+`;
  factBottoms[3].querySelector('.fact-pill').textContent = instructor.certificate;

  const aboutCopy = document.querySelector('.about-copy');
  aboutCopy.replaceChildren(...instructor.about.map((paragraph) => createElement(document, 'p', '', paragraph)));
  const aboutTags = document.querySelector('.about-tags');
  aboutTags.replaceChildren(...instructor.tags.map((tag) => {
    const pill = createElement(document, 'span', 'about-tag ui-pill-lg');
    pill.append(createElement(document, 'i'), document.createTextNode(tag));
    return pill;
  }));

  const summary = document.querySelectorAll('.reviews-summary__value');
  summary[0].textContent = Number(instructor.rating).toFixed(1);
  summary[1].textContent = `${instructor.reviews} reviews`;
  buildReviews(document, instructor);
  const reviewsButton = document.querySelector('.profile-reviews .outline-md-btn');
  reviewsButton.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.textContent = ` Show all reviews (${instructor.reviews}) `;
  });

  const media = buildMedia(document, instructor);

  const booking = document.querySelector('.profile-booking-card');
  booking.dataset.instructorName = instructor.name;
  booking.dataset.instructorAvatar = instructor.bookingAvatar;
  Object.entries(instructor.pricing).forEach(([key, value]) => {
    booking.dataset[key] = String(value);
  });
  const bookingAvatar = booking.querySelector('.booking-avatar');
  bookingAvatar.src = instructor.bookingAvatar;
  bookingAvatar.alt = instructor.name;
  booking.querySelector('.booking-head h3').textContent = instructor.name;
  booking.querySelector('.booking-counter:nth-child(1) .booking-counter-value span').textContent = instructor.pricing.defaultHours;
  booking.querySelector('.booking-counter:nth-child(2) .booking-counter-value span').textContent = instructor.pricing.defaultPeople;

  return { html: document.body.innerHTML, media };
}
