(() => {
  const card = document.querySelector('.profile-booking-card');
  if (!card) return;

  const hoursPlus = card.querySelector('[aria-label="Increase hours"]');
  const hoursMinus = card.querySelector('[aria-label="Decrease hours"]');
  const peoplePlus = card.querySelector('[aria-label="Increase people"]');
  const peopleMinus = card.querySelector('[aria-label="Decrease people"]');
  const hoursValue = card.querySelector('.booking-counter:nth-child(1) .booking-counter-value span');
  const peopleValue = card.querySelector('.booking-counter:nth-child(2) .booking-counter-value span');
  const cta = card.querySelector('.booking-cta-btn');
  const priceLink = card.querySelector('.booking-price-row a');
  const hoursLabel = card.querySelector('.booking-price-row p:nth-child(3)');
  const peopleLabel = card.querySelector('.booking-price-row p:nth-child(5)');

  if (!hoursValue || !peopleValue || !cta || !priceLink || !hoursLabel || !peopleLabel) return;

  const HOURS_MIN = Number(card.dataset.minHours) || 2;
  const HOURS_MAX = Number(card.dataset.maxHours) || 12;
  const HOURS_STEP = Number(card.dataset.hoursStep) || 2;
  const PEOPLE_MIN = Number(card.dataset.minPeople) || 1;
  const PEOPLE_MAX = Number(card.dataset.maxPeople) || 10;
  const HOURLY_RATE_GEL = Number(card.dataset.hourlyRateGel) || 345;

  const calculatePrice = (hours) => Math.round(hours * HOURLY_RATE_GEL);

  let hours = Number(hoursValue.textContent) || 8;
  let people = Number(peopleValue.textContent) || 2;

  const sync = () => {
    hoursValue.textContent = String(hours);
    peopleValue.textContent = String(people);

    const price = calculatePrice(hours);
    priceLink.textContent = `${price} gel`;
    hoursLabel.textContent = `${hours} hour`;
    peopleLabel.textContent = `${people} peple`;

    const toggles = [
      [hoursPlus, hours >= HOURS_MAX],
      [hoursMinus, hours <= HOURS_MIN],
      [peoplePlus, people >= PEOPLE_MAX],
      [peopleMinus, people <= PEOPLE_MIN]
    ];

    toggles.forEach(([button, isDisabled]) => {
      if (!button) return;
      button.disabled = isDisabled;
      button.classList.toggle('is-disabled', isDisabled);
    });
  };

  hoursPlus?.addEventListener('click', () => {
    hours = Math.min(HOURS_MAX, hours + HOURS_STEP);
    sync();
  });

  hoursMinus?.addEventListener('click', () => {
    hours = Math.max(HOURS_MIN, hours - HOURS_STEP);
    sync();
  });

  peoplePlus?.addEventListener('click', () => {
    people = Math.min(PEOPLE_MAX, people + 1);
    sync();
  });

  peopleMinus?.addEventListener('click', () => {
    people = Math.max(PEOPLE_MIN, people - 1);
    sync();
  });

  cta.addEventListener('click', () => {
    const draft = {
      instructor: {
        slug: window.location.pathname.split('/').filter(Boolean).at(-1),
        name: card.dataset.instructorName,
        avatar: card.dataset.instructorAvatar
      },
      hours,
      participants: people,
      priceGel: calculatePrice(hours)
    };

    window.localStorage.setItem('bookingDraftV1', JSON.stringify(draft));
    window.location.href = '/booking';
  });

  sync();
})();
