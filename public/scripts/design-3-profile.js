(() => {
  const card = document.querySelector('.profile-booking-card[data-booking]');
  if (!card) return;

  const counters = Array.from(card.querySelectorAll('[data-counter]'));
  const hourlyRate = Number(card.dataset.hourlyRateGel) || 345;
  const formatPrice = (value) => Math.round(value).toLocaleString('en-US').replaceAll(',', ' ');

  const sync = () => {
    const readValue = (role) => Number(card.querySelector(`[data-role="${role}"] [data-counter-val]`)?.textContent) || 0;
    const hours = readValue('hours');
    const people = readValue('people');
    const peopleMultiplier = { 1: 1, 2: 1.4, 3: 1.7 }[people] || 1;
    const peoplePercent = Math.round((peopleMultiplier - 1) * 100);
    const volumePercent = hours >= 8 ? 15 : hours >= 4 ? 10 : 0;
    const base = hourlyRate * hours;
    const withPeople = base * peopleMultiplier;
    const surcharge = withPeople - base;
    const discount = withPeople * (volumePercent / 100);
    const total = withPeople - discount;

    const rows = [
      `<div class="booking-breakdown-row"><span>${hourlyRate} × ${hours} h</span><span>${formatPrice(base)}</span></div>`
    ];
    if (surcharge > 0) rows.push(`<div class="booking-breakdown-row"><span>${people} students · +${peoplePercent}%</span><span>+${formatPrice(surcharge)}</span></div>`);
    if (discount > 0) rows.push(`<div class="booking-breakdown-row"><span>From ${hours} h · −${volumePercent}%</span><span>−${formatPrice(discount)}</span></div>`);

    card.querySelector('[data-booking-breakdown]').innerHTML = rows.join('');
    card.querySelector('[data-booking-total]').textContent = `${formatPrice(total)} gel`;
    card.querySelector('[data-booking-hours]').textContent = String(hours);
    card.querySelector('[data-booking-people]').textContent = String(people);

    counters.forEach((counter) => {
      const value = Number(counter.querySelector('[data-counter-val]').textContent);
      const min = Number(counter.dataset.min);
      const max = Number(counter.dataset.max);
      const minus = counter.querySelector('[data-counter-btn="minus"]');
      const plus = counter.querySelector('[data-counter-btn="plus"]');
      minus.disabled = value <= min;
      plus.disabled = value >= max;
    });

    card.dataset.currentHours = String(hours);
    card.dataset.currentPeople = String(people);
    card.dataset.currentTotal = String(Math.round(total));
  };

  card.addEventListener('click', (event) => {
    const control = event.target.closest('[data-counter-btn]');
    if (control) {
      const counter = control.closest('[data-counter]');
      const valueNode = counter.querySelector('[data-counter-val]');
      const value = Number(valueNode.textContent) || 0;
      const step = Number(counter.dataset.step) || 1;
      const min = Number(counter.dataset.min) || 0;
      const max = Number(counter.dataset.max) || 99;
      valueNode.textContent = String(control.dataset.counterBtn === 'plus'
        ? Math.min(max, value + step)
        : Math.max(min, value - step));
      sync();
      return;
    }

    if (event.target.closest('[data-booking-continue]')) {
      window.localStorage.setItem('bookingDraftV1', JSON.stringify({
        instructor: {
          slug: window.location.pathname.split('/').filter(Boolean).at(-1),
          name: card.dataset.instructorName,
          avatar: card.dataset.instructorAvatar
        },
        hours: Number(card.dataset.currentHours),
        participants: Number(card.dataset.currentPeople),
        priceGel: Number(card.dataset.currentTotal)
      }));
      window.location.assign('/booking');
    }
  });

  sync();
})();
