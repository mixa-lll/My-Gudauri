(() => {
  const nav = document.querySelector('.home-page [data-site-nav]');
  const toggle = nav?.querySelector('[data-site-nav-toggle]');
  const panel = nav?.querySelector('[data-site-nav-panel]');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  if (!nav || !toggle || !panel || !backdrop) return;

  const TRANSITION_MS = 200;
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

  const setMenuOpen = (isOpen) => {
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

  const closeMenu = () => setMenuOpen(false);

  const onToggleClick = (event) => {
    // Override shared navbar toggle handler only on this page.
    event.preventDefault();
    event.stopImmediatePropagation();
    setMenuOpen(!nav.classList.contains('is-open'));
  };

  toggle.addEventListener('click', onToggleClick, true);
  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!nav.classList.contains('is-open')) return;
    closeMenu();
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('beforeunload', () => {
    toggle.removeEventListener('click', onToggleClick, true);
    clearTimeout(panelHideTimer);
    clearTimeout(backdropHideTimer);
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    backdrop.hidden = true;
    backdrop.classList.remove('is-visible');
    document.body.classList.remove('menu-open');
  });

  panel.hidden = true;
  backdrop.hidden = true;
  document.body.classList.remove('menu-open');
})();
