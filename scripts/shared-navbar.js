(() => {
  const hosts = document.querySelectorAll('[data-site-navbar]');
  if (!hosts.length) return;
  const TRANSITION_MS = 200;

  const template = `
    <div class="site-nav" data-site-nav>
      <div class="site-nav__bar">
        <div class="site-nav__left">
          <a class="site-nav__brand" href="../index.html" aria-label="My Gudauri home">
            <span class="site-nav__brand-muted">My </span>Gudauri
          </a>

          <nav class="site-nav__links" aria-label="Main navigation">
            <button class="site-nav__trigger" type="button" aria-label="Categories menu" aria-expanded="false" aria-controls="site-nav-menu" data-site-nav-toggle>
              <span class="site-nav__trigger-text">Categories</span>
              <span class="site-nav__chevron-wrap" aria-hidden="true">
                <img class="site-nav__chevron" src="../assets/navbar/caret-down.png" alt="" />
              </span>
            </button>
            <a class="site-nav__link" href="#">Articles</a>
            <a class="site-nav__link" href="#">About Gudauri</a>
            <a class="site-nav__link" href="#">Support</a>
          </nav>
        </div>

        <button class="site-nav__offer" type="button">Offer a service</button>
      </div>

      <div id="site-nav-menu" class="site-nav__panel" data-site-nav-panel hidden>
        <div class="site-nav__categories">
          <a class="site-nav__category" href="/instructors">
            <img class="site-nav__category-icon" src="../assets/navbar/icon-instructors.png" alt="" aria-hidden="true" />
            <span class="site-nav__category-copy">
              <span class="site-nav__category-title">Instructors</span>
              <span class="site-nav__category-desc">Ski, snowbord</span>
            </span>
          </a>

          <a class="site-nav__category" href="#">
            <img class="site-nav__category-icon" src="../assets/navbar/icon-rent.png" alt="" aria-hidden="true" />
            <span class="site-nav__category-copy">
              <span class="site-nav__category-title">Rent</span>
              <span class="site-nav__category-desc">Skis, Snowboards, Gloves, Helmets, Goggles</span>
            </span>
          </a>

          <a class="site-nav__category" href="#">
            <img class="site-nav__category-icon" src="../assets/navbar/icon-transfer.png" alt="" aria-hidden="true" />
            <span class="site-nav__category-copy">
              <span class="site-nav__category-title">Transfer</span>
              <span class="site-nav__category-desc site-nav__category-desc--muted">Batumi - Gudauri, Tbilisi- Gudauri</span>
            </span>
          </a>

          <a class="site-nav__category" href="#">
            <img class="site-nav__category-icon" src="../assets/navbar/icon-activity.png" alt="" aria-hidden="true" />
            <span class="site-nav__category-copy">
              <span class="site-nav__category-title">Activity</span>
              <span class="site-nav__category-desc">Freeride, Ski Touring, Heli-skiing, Excursions, Snowmobiling, Paragliding</span>
            </span>
          </a>

          <a class="site-nav__category" href="#">
            <img class="site-nav__category-icon" src="../assets/navbar/icon-services.png" alt="" aria-hidden="true" />
            <span class="site-nav__category-copy">
              <span class="site-nav__category-title">Services</span>
              <span class="site-nav__category-desc">Photo &amp; Video Shoot, Nanny</span>
            </span>
          </a>

          <a class="site-nav__category" href="#">
            <img class="site-nav__category-icon" src="../assets/navbar/icon-places.png" alt="" aria-hidden="true" />
            <span class="site-nav__category-copy">
              <span class="site-nav__category-title">Places</span>
              <span class="site-nav__category-desc">Ski, snowbord</span>
            </span>
          </a>
        </div>

        <aside class="site-nav__promo" aria-label="Featured category card">
          <p class="site-nav__promo-title">Find the right ski instructor</p>
          <button class="site-nav__promo-btn" type="button">
            Browse instructors
            <span class="site-nav__promo-arrow" aria-hidden="true">
              <img src="../assets/navbar/arrow-35.png" alt="" />
              <img src="../assets/navbar/arrow-36.png" alt="" />
            </span>
          </button>
        </aside>
      </div>
    </div>
  `;

  let backdrop = document.querySelector('[data-site-nav-backdrop]');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'site-nav-backdrop';
    backdrop.hidden = true;
    backdrop.setAttribute('data-site-nav-backdrop', '');
    document.body.append(backdrop);
  }

  const closeHandlers = [];

  hosts.forEach((host, index) => {
    host.innerHTML = template;

    const nav = host.querySelector('[data-site-nav]');
    const toggle = host.querySelector('[data-site-nav-toggle]');
    const panel = host.querySelector('[data-site-nav-panel]');
    if (!nav || !toggle || !panel) return;
    const panelId = `site-nav-menu-${index + 1}`;
    panel.id = panelId;
    toggle.setAttribute('aria-controls', panelId);
    let panelHideTimer;
    let backdropHideTimer;

    const showBackdrop = () => {
      clearTimeout(backdropHideTimer);
      if (backdrop.hidden) backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('is-visible'));
    };

    const hideBackdrop = () => {
      backdrop.classList.remove('is-visible');
      clearTimeout(backdropHideTimer);
      backdropHideTimer = window.setTimeout(() => {
        if (!nav.classList.contains('is-open')) backdrop.hidden = true;
      }, TRANSITION_MS);
    };

    const setOpen = (isOpen) => {
      clearTimeout(panelHideTimer);
      nav.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);

      if (isOpen) {
        panel.hidden = false;
        showBackdrop();
        return;
      }

      // Keep panel in DOM during fade-out, then hide.
      panel.hidden = false;
      hideBackdrop();
      panelHideTimer = window.setTimeout(() => {
        if (!nav.classList.contains('is-open')) panel.hidden = true;
      }, TRANSITION_MS);
    };

    const closeOnOutside = (event) => {
      if (!host.contains(event.target)) setOpen(false);
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = nav.classList.contains('is-open');
      setOpen(!isOpen);
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    backdrop.addEventListener('click', () => setOpen(false));
    document.addEventListener('click', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);

    closeHandlers.push(() => {
      clearTimeout(panelHideTimer);
      clearTimeout(backdropHideTimer);
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      document.body.classList.remove('menu-open');
      document.removeEventListener('click', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    });
  });

  window.addEventListener('beforeunload', () => {
    closeHandlers.forEach((dispose) => dispose());
    if (backdrop) {
      backdrop.classList.remove('is-visible');
      backdrop.hidden = true;
    }
  });
})();
