import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NAV_CATEGORIES } from '../../data/navCategories';
import { DESTINATIONS } from '../../data/destinations';
import { resolveSiteCategory } from '../../data/siteCategories';
import { useLanguage } from '../../i18n/LanguageContext';
import { cn } from '../../utils/cn';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import './SiteNavbar.scss';

const MOBILE_QUERY = '(max-width: 820px)';
const MENU_PANEL_WIDTH = 700;
/* Canvas “menu open”: Instructors is the featured tile, the rest form a grid. */
const MOBILE_TILE_ORDER = ['rental', 'transfers', 'stays', 'activities', 'services', 'places'];

function sectionCount(slug) {
  return DESTINATIONS[slug]?.items?.length ?? 0;
}
const FOCUSABLE = 'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PRIMARY_LINKS = [
  { labelKey: 'articles', href: '/articles' },
  { labelKey: 'about', href: '/about-gudauri' },
  { labelKey: 'contacts', href: '/contacts' }
];

export function SiteNavbar({ className }) {
  const { t, language, languages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [categories, setCategories] = useState(NAV_CATEGORIES);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, width: 0 });
  const menuId = useId();
  const hostRef = useRef(null);
  const linksRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimerRef = useRef(null);
  const shouldRestoreFocusRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const updateMenuPosition = useCallback(() => {
    if (!linksRef.current || window.matchMedia(MOBILE_QUERY).matches) return;
    // The desktop panel grows out of the links pill: centered under it.
    const rect = linksRef.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const left = Math.round(Math.min(Math.max(center - MENU_PANEL_WIDTH / 2, 16), window.innerWidth - MENU_PANEL_WIDTH - 16));
    setMenuPosition({ left, top: Math.round(rect.bottom + 10) });
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    shouldRestoreFocusRef.current = restoreFocus;
    setIsOpen(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuMounted(false);
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--menu-scrollbar-compensation');
    }, shouldReduceMotion ? 0 : (isMobile ? 240 : 250));
  }, [isMobile, shouldReduceMotion]);

  const openMenu = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    shouldRestoreFocusRef.current = false;
    updateMenuPosition();
    setIsMenuMounted(true);
    setIsOpen(true);
  }, [updateMenuPosition]);

  useEffect(() => {
    if (isMenuMounted || !shouldRestoreFocusRef.current) return undefined;

    shouldRestoreFocusRef.current = false;
    const focusFrame = requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(focusFrame);
  }, [isMenuMounted]);

  const toggleMenu = useCallback(() => {
    if (isOpen) closeMenu(true);
    else openMenu();
  }, [closeMenu, isOpen, openMenu]);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const syncMode = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) updateMenuPosition();
    };

    media.addEventListener('change', syncMode);
    return () => media.removeEventListener('change', syncMode);
  }, [updateMenuPosition]);

  useEffect(() => {
    fetch('/api/categories', { headers: { accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload) => {
        const resolved = payload.data
          .map(resolveSiteCategory)
          .filter((category, index, items) => category && items.findIndex((item) => item.slug === category.slug) === index);
        setCategories(resolved.length ? resolved : NAV_CATEGORIES);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    updateMenuPosition();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--menu-scrollbar-compensation', `${scrollbarWidth}px`);
    document.body.classList.add('menu-open');

    const focusFirstItem = window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true });
    }, shouldReduceMotion ? 0 : 120);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusableItems = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!focusableItems.length) return;
      const firstItem = focusableItems[0];
      const lastItem = focusableItems.at(-1);

      if (event.shiftKey && (document.activeElement === firstItem || document.activeElement === panelRef.current)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === panelRef.current) {
        event.preventDefault();
        firstItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, { passive: true });

    return () => {
      window.clearTimeout(focusFirstItem);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition);
    };
  }, [closeMenu, isOpen, shouldReduceMotion, updateMenuPosition]);

  useEffect(() => () => {
    window.clearTimeout(closeTimerRef.current);
    document.body.classList.remove('menu-open');
    document.body.style.removeProperty('--menu-scrollbar-compensation');
  }, []);

  const panelMotion = shouldReduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : isMobile
      ? {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
          transition: { duration: 0.22, ease: [0.2, 0, 0, 1] }
        }
      : {
          initial: { opacity: 0, y: -6, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -4, scale: 0.99 },
          transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
        };

  const itemMotion = (index) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 5 },
    animate: isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 2 },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 0.18,
      delay: isOpen && !shouldReduceMotion ? 0.04 + index * 0.018 : 0,
      ease: [0.2, 0, 0, 1]
    }
  });

  return (
    <>
      <header ref={hostRef} className={cn('site-nav-host', className)}>
        <div className={cn('site-nav', isOpen && 'is-open')}>
          <div className="site-nav__bar">
            <Link className="site-nav__brand" to="/" aria-label={t('nav.homeLabel')} onClick={() => closeMenu()}>
              <span className="site-nav__brand-muted">My </span>Gudauri
            </Link>

            <nav className="site-nav__links" aria-label={t('nav.mainLabel')} ref={linksRef}>
              <button
                ref={triggerRef}
                className="site-nav__trigger"
                type="button"
                aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                aria-expanded={isOpen}
                aria-controls={menuId}
                onClick={toggleMenu}
              >
                <span className="site-nav__trigger-text">{t('nav.categories')}</span>
                <span className="site-nav__chevron-wrap" aria-hidden="true">
                  <img className="site-nav__chevron" src="/assets/navbar/caret-down.png" alt="" />
                </span>
                <span className="site-nav__burger" aria-hidden="true"><i /><i /></span>
              </button>
              {PRIMARY_LINKS.map((item) => (
                <Link className="site-nav__link" to={item.href} onClick={() => closeMenu()} key={item.href}>{t(`nav.${item.labelKey}`)}</Link>
              ))}
            </nav>

            <div className="site-nav__actions">
              <LanguageSwitcher onBeforeOpen={() => isOpen && closeMenu()} />
              <a className="site-nav__offer" href="mailto:support@mygudauri.com?subject=Offer%20a%20service" onClick={() => closeMenu()}>
                {t('nav.offer')}
              </a>
            </div>
          </div>
        </div>
      </header>

      {createPortal(
          isMenuMounted && (
            <motion.div
              className={cn('site-nav-overlay', isMobile && 'is-mobile')}
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : (isMobile ? 0.18 : 0.2) }}
            >
              <button
                className="site-nav-backdrop"
                type="button"
                aria-label={t('nav.closeMenu')}
                onClick={() => closeMenu(true)}
              />

              <motion.div
                initial={panelMotion.initial}
                animate={isOpen ? panelMotion.animate : panelMotion.exit}
                transition={panelMotion.transition}
                ref={panelRef}
                id={menuId}
                className="site-nav__panel site-nav-menu"
                role="dialog"
                aria-modal="true"
                aria-label={t('nav.siteLabel')}
                tabIndex={-1}
                style={isMobile ? undefined : menuPosition}
              >
                {isMobile ? (
                  <>
                    <div className="site-nav-menu__mobile-head">
                      <Link className="site-nav__brand" to="/" onClick={() => closeMenu()}>
                        <span className="site-nav__brand-muted">My </span>Gudauri
                      </Link>
                      <button className="site-nav-menu__close" type="button" onClick={() => closeMenu(true)} aria-label={t('nav.closeMenu')}>
                        <i /><i />
                      </button>
                    </div>

                    <div className="site-nav-menu__tiles">
                      <motion.div {...itemMotion(0)}>
                        <Link className="site-nav-menu__tile site-nav-menu__tile--featured" to="/instructors" onClick={() => closeMenu()}>
                          <img className="site-nav-menu__tile-icon" src="/assets/navbar/icon-instructors.png" alt="" aria-hidden="true" />
                          <span className="site-nav-menu__tile-copy">
                            <strong>{t('categories.instructors.title')}</strong>
                            <small>{t('nav.menuInstructorsNote', { count: sectionCount('instructors') })}</small>
                          </span>
                          <span className="site-nav-menu__tile-arrow" aria-hidden="true">↗</span>
                        </Link>
                      </motion.div>

                      <div className="site-nav-menu__tile-grid">
                        {MOBILE_TILE_ORDER.map((slug, index) => {
                          const category = categories.find((item) => item.slug === slug);
                          if (!category) return null;
                          return (
                            <motion.div key={slug} {...itemMotion(index + 1)}>
                              <Link className="site-nav-menu__tile" to={category.href} onClick={() => closeMenu()}>
                                <img className="site-nav-menu__tile-icon" src={category.icon} alt="" aria-hidden="true" />
                                <span className="site-nav-menu__tile-copy">
                                  <strong>{t(`categories.${slug}.title`)}</strong>
                                  <small>{sectionCount(slug)}</small>
                                </span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <nav className="site-nav-menu__primary" aria-label={t('nav.mobileLabel')}>
                      {PRIMARY_LINKS.map((item) => (
                        <Link to={item.href} onClick={() => closeMenu()} key={item.href}>{t(`nav.${item.labelKey}`)}<span aria-hidden="true">↗</span></Link>
                      ))}
                    </nav>

                    <div className="site-nav-menu__dock">
                      <div className="site-nav-menu__dock-row">
                        <Link className="site-nav-menu__dock-btn" to="/instructors/match" onClick={() => closeMenu()}>
                          {t('nav.helpChoose')}
                        </Link>
                        <Link className="site-nav-menu__dock-btn" to="/about-gudauri" onClick={() => closeMenu()}>
                          {t('nav.weatherLifts')}
                        </Link>
                      </div>
                      <div className="site-nav-menu__dock-row">
                        {languages.map((item) => (
                          <button
                            className={cn('site-nav-menu__dock-btn site-nav-menu__dock-btn--lang', item.code === language && 'is-active')}
                            type="button"
                            aria-pressed={item.code === language}
                            onClick={() => setLanguage(item.code)}
                            key={item.code}
                          >
                            {item.code.toUpperCase()}
                          </button>
                        ))}
                        <a
                          className="site-nav-menu__dock-btn site-nav-menu__dock-btn--offer"
                          href="mailto:support@mygudauri.com?subject=Offer%20a%20service"
                          onClick={() => closeMenu()}
                        >
                          {t('nav.offer')} <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="site-nav-menu__grid">
                    {categories.map((category, index) => (
                      <motion.div key={category.slug} {...itemMotion(index)}>
                        <Link className="site-nav-menu__item" to={category.href} onClick={() => closeMenu()}>
                          <img className="site-nav-menu__item-icon" src={category.icon} alt="" aria-hidden="true" />
                          <span className="site-nav-menu__item-copy">
                            <strong>{t(`categories.${category.slug}.title`)}</strong>
                            <small>{t(`categories.${category.slug}.description`)}</small>
                          </span>
                          <span className="site-nav-menu__item-arrow" aria-hidden="true">↗</span>
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div {...itemMotion(categories.length)}>
                      <Link className="site-nav-menu__item site-nav-menu__item--promo" to="/instructors/match" onClick={() => closeMenu()}>
                        <span className="site-nav-menu__item-copy">
                          <strong>{t('nav.promoTitle')}</strong>
                          <small>{t('nav.promoNote')}</small>
                        </span>
                        <span className="site-nav-menu__item-arrow" aria-hidden="true">↗</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ),
        document.body
      )}
    </>
  );
}
