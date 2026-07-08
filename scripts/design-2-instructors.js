(() => {
  const overlay = document.querySelector('[data-calc-overlay]');
  const openButton = document.querySelector('[data-calc-open]');
  if (!overlay || !openButton) return;

  const closeTriggers = overlay.querySelectorAll('[data-calc-close]');
  const hoursValue = overlay.querySelector('[data-calc-hours-value]');
  const peopleValue = overlay.querySelector('[data-calc-people-value]');
  const priceValue = overlay.querySelector('[data-calc-price]');
  const currencyButtons = Array.from(overlay.querySelectorAll('[data-calc-currency]'));

  const HOUR_STEPS = [2, 4, 6];
  const PEOPLE_MIN = 1;
  const PEOPLE_MAX = 10;
  const RATE_PER_2H = 345;
  const GEL_PER_USD = 2.75;

  let hourIndex = 0;
  let people = 1;
  let currency = 'gel';

  const updatePrice = () => {
    if (!hoursValue || !peopleValue || !priceValue) return;

    const hours = HOUR_STEPS[hourIndex];
    const totalGel = Math.round((hours / 2) * RATE_PER_2H * people);
    const totalUsd = Math.round(totalGel / GEL_PER_USD);

    hoursValue.textContent = String(hours);
    peopleValue.textContent = String(people);

    if (currency === 'usd') {
      priceValue.textContent = `${totalUsd} USD`;
      return;
    }

    priceValue.textContent = `${totalGel} GEL`;
  };

  const setCurrency = (next) => {
    currency = next;
    currencyButtons.forEach((button) => {
      const isActive = button.getAttribute('data-calc-currency') === currency;
      button.classList.toggle('is-active', isActive);
    });
    updatePrice();
  };

  const setOpen = (isOpen) => {
    if (isOpen) {
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('is-open'));
      document.body.classList.add('calc-modal-open');
      return;
    }

    overlay.classList.remove('is-open');
    document.body.classList.remove('calc-modal-open');
    window.setTimeout(() => {
      if (!overlay.classList.contains('is-open')) overlay.hidden = true;
    }, 220);
  };

  openButton.addEventListener('click', (event) => {
    event.preventDefault();
    setOpen(true);
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => setOpen(false));
  });

  overlay.querySelectorAll('[data-calc-increase], [data-calc-decrease]').forEach((button) => {
    button.addEventListener('click', () => {
      const incTarget = button.getAttribute('data-calc-increase');
      const decTarget = button.getAttribute('data-calc-decrease');

      if (incTarget === 'hours' && hourIndex < HOUR_STEPS.length - 1) hourIndex += 1;
      if (decTarget === 'hours' && hourIndex > 0) hourIndex -= 1;

      if (incTarget === 'people' && people < PEOPLE_MAX) people += 1;
      if (decTarget === 'people' && people > PEOPLE_MIN) people -= 1;

      updatePrice();
    });
  });

  currencyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextCurrency = button.getAttribute('data-calc-currency');
      if (!nextCurrency) return;
      setCurrency(nextCurrency);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!overlay.classList.contains('is-open')) return;
    setOpen(false);
  });

  updatePrice();
})();
