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
  container.replaceChildren(...items.map((item) => createElement(document, 'span', 'fact-pill ui-pill ui-pill--sm ui-pill--light', item)));
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

function buildCertifications(document, instructor) {
  const grid = document.querySelector('.profile-certifications-grid');
  const certifications = instructor.certifications?.length
    ? instructor.certifications
    : instructor.certificate
      ? [{ title: instructor.certificate }]
      : [];

  if (!certifications.length) {
    grid.replaceChildren(createElement(document, 'p', 'profile-empty-state', 'Certification details are being updated.'));
    return;
  }

  grid.replaceChildren(...certifications.map((certification) => {
    const card = createElement(document, certification.fileUrl ? 'a' : 'article', 'profile-certification-card');
    if (certification.fileUrl) {
      card.href = certification.fileUrl;
      card.target = '_blank';
      card.rel = 'noreferrer';
    }

    const preview = certification.fileUrl
      ? createElement(document, 'img', 'profile-certification-card__preview')
      : createElement(document, 'span', 'profile-certification-card__icon', '✓');
    preview.setAttribute('aria-hidden', 'true');
    if (certification.fileUrl) preview.src = certification.fileUrl;
    const copy = createElement(document, 'span', 'profile-certification-card__copy');
    copy.append(createElement(document, 'strong', '', certification.title));
    if (certification.level) copy.append(createElement(document, 'small', '', certification.level));
    if (certification.fileUrl) copy.append(createElement(document, 'span', 'profile-certification-card__link', 'View certificate'));
    card.append(preview, copy);
    return card;
  }));
}

function buildMedia(document, instructor) {
  const allMedia = instructor.media?.length
    ? instructor.media
    : [{ type: 'image', src: instructor.heroImage, thumbnail: instructor.heroImage, alt: instructor.heroImageAlt, featured: true }];
  const media = allMedia.filter((item) => item.type !== 'video');
  const introVideo = allMedia.find((item) => item.type === 'video');

  const videoLink = document.querySelector('.profile-video-intro');
  if (introVideo) {
    videoLink.href = introVideo.src;
    videoLink.target = '_blank';
    videoLink.rel = 'noreferrer';
  } else {
    videoLink.remove();
  }

  const thumbs = document.querySelector('.profile-gallery-trigger__thumbs');
  thumbs.replaceChildren(...media.slice(0, 3).map((item) => {
    const image = createElement(document, 'img');
    image.src = item.thumbnail || item.src;
    image.alt = '';
    return image;
  }));

  const galleryMeta = document.querySelector('.profile-gallery-trigger small');
  galleryMeta.textContent = `${media.length} ${media.length === 1 ? 'photo' : 'photos'}`;

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
    const badge = createElement(document, 'span', 'profile-badge ui-pill ui-pill--md ui-pill--soft');
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

  document.querySelector('.profile-hero-intro > p').textContent = instructor.intro;

  const hero = document.querySelector('.profile-hero-photo');
  hero.src = instructor.heroImage;
  hero.alt = instructor.heroImageAlt;
  const availability = document.querySelector('.profile-availability');
  availability.lastChild.textContent = instructor.availability || 'Schedule confirmed by manager';

  const factBottoms = document.querySelectorAll('.profile-facts .fact-bottom');
  buildPills(document, factBottoms[0], sports);
  buildPills(document, factBottoms[1], languages);
  factBottoms[2].querySelector('.fact-pill').className = 'fact-pill ui-pill ui-pill--sm ui-pill--light';
  factBottoms[3].querySelector('.fact-pill').className = 'fact-pill ui-pill ui-pill--sm ui-pill--light';
  factBottoms[2].querySelector('.fact-pill').textContent = `${instructor.experienceYears}+`;
  factBottoms[3].querySelector('.fact-pill').textContent = instructor.certificate;

  const aboutCopy = document.querySelector('.about-copy');
  aboutCopy.replaceChildren(...(instructor.about ?? []).map((paragraph) => createElement(document, 'p', '', paragraph)));
  const aboutTags = document.querySelector('.about-tags');
  aboutTags.replaceChildren(...(instructor.tags ?? []).map((tag) => {
    const pill = createElement(document, 'span', 'about-tag ui-pill-lg');
    pill.append(createElement(document, 'i'), document.createTextNode(tag));
    return pill;
  }));

  buildCertifications(document, instructor);

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
  booking.querySelector('[data-booking-rate]').textContent = instructor.pricing.hourlyRateGel;
  const bookingAvatar = booking.querySelector('.booking-avatar');
  bookingAvatar.src = instructor.bookingAvatar;
  bookingAvatar.alt = instructor.name;

  const hoursCounter = booking.querySelector('[data-counter][data-role="hours"]');
  hoursCounter.dataset.min = instructor.pricing.minHours;
  hoursCounter.dataset.max = instructor.pricing.maxHours;
  hoursCounter.dataset.step = instructor.pricing.hoursStep;
  hoursCounter.querySelector('[data-counter-val]').textContent = instructor.pricing.defaultHours;

  const peopleCounter = booking.querySelector('[data-counter][data-role="people"]');
  peopleCounter.dataset.min = instructor.pricing.minPeople;
  peopleCounter.dataset.max = Math.min(instructor.pricing.maxPeople, 3);
  peopleCounter.querySelector('[data-counter-val]').textContent = Math.min(instructor.pricing.defaultPeople, 3);

  document.querySelector('.profile-hero')?.remove();

  return { html: document.body.innerHTML, media };
}
