import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NAV_CATEGORIES } from '../../data/navCategories';
import { resolveSiteCategory } from '../../data/siteCategories';
import { SUPPORTED_LANGUAGES, useLanguage } from '../../i18n/LanguageContext';
import { cn } from '../../utils/cn';
import './SiteNavbar.scss';

const MOBILE_QUERY = '(max-width: 820px)';
const FOCUSABLE = 'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PRIMARY_LINKS = [
  { labelKey: 'articles', href: '/articles' },
  { labelKey: 'about', href: '/about-gudauri' },
  { labelKey: 'contacts', href: '/contacts' }
];

function LanguageSelect({ mobile = false, onBeforeOpen }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const languageMenuId = useId();
  const shouldReduceMotion = useReducedMotion();
  const currentLanguage = SUPPORTED_LANGUAGES.find((item) => item.code === language) ?? SUPPORTED_LANGUAGES[0];

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({
      top: Math.round(rect.bottom + 8),
      right: Math.max(12, Math.round(window.innerWidth - rect.right))
    });
  }, []);

  const closeLanguageMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  const openLanguageMenu = useCallback(() => {
    onBeforeOpen?.();
    updatePosition();
    setIsOpen(true);
  }, [onBeforeOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || mobile) return undefined;

    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      closeLanguageMenu();
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLanguageMenu(true);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [closeLanguageMenu, isOpen, mobile, updatePosition]);

  const chooseLanguage = (code) => {
    setLanguage(code);
    closeLanguageMenu(true);
  };

  if (mobile) {
    return (
      <div className="site-language site-language--mobile" role="group" aria-label={t('nav.language')}>
        <span className="site-language__label">{t('nav.language')}</span>
        <div className="site-language__mobile-options">
          {SUPPORTED_LANGUAGES.map((item) => (
            <button
              className={cn('site-language__mobile-option', language === item.code && 'is-active')}
              type="button"
              aria-pressed={language === item.code}
              onClick={() => setLanguage(item.code)}
              key={item.code}
            >
              <span className="site-language__flag" aria-hidden="true">{item.flag}</span>
              <span>{item.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="site-language">
      <button
        ref={triggerRef}
        className="site-language__trigger"
        type="button"
        aria-label={`${t('nav.language')}: ${currentLanguage.label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={languageMenuId}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => isOpen ? closeLanguageMenu(true) : openLanguageMenu()}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown') return;
          event.preventDefault();
          if (!isOpen) openLanguageMenu();
          window.setTimeout(() => menuRef.current?.querySelector('[role="menuitemradio"]')?.focus(), shouldReduceMotion ? 0 : 170);
        }}
      >
        <span className="site-language__code">{currentLanguage.shortLabel}</span>
        <span className="site-language__flag" aria-hidden="true">{currentLanguage.flag}</span>
        <span className="site-language__caret" aria-hidden="true">⌄</span>
      </button>

      {isOpen && createPortal(
        <motion.div
          ref={menuRef}
          id={languageMenuId}
          className="site-language-menu"
          role="menu"
          aria-label={t('nav.language')}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: [0.2, 0, 0, 1] }}
          style={menuPosition}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const items = [...menuRef.current.querySelectorAll('[role="menuitemradio"]')];
            const currentIndex = items.indexOf(document.activeElement);
            if (event.key === 'Home') items[0]?.focus();
            else if (event.key === 'End') items.at(-1)?.focus();
            else if (event.key === 'ArrowDown') items[(currentIndex + 1 + items.length) % items.length]?.focus();
            else items[(currentIndex - 1 + items.length) % items.length]?.focus();
          }}
        >
          <p>{t('nav.language')}</p>
          {SUPPORTED_LANGUAGES.map((item) => (
            <button
              className={cn('site-language-menu__option', language === item.code && 'is-active')}
              type="button"
              role="menuitemradio"
              aria-checked={language === item.code}
              onClick={() => chooseLanguage(item.code)}
              key={item.code}
            >
              <span className="site-language-menu__name">{item.label}</span>
              <span className="site-language-menu__meta">
                <small>{item.shortLabel}</small>
                <span className="site-language__flag" aria-hidden="true">{item.flag}</span>
              </span>
            </button>
          ))}
        </motion.div>,
        document.body
      )}
    </div>
  );
}

export function SiteNavbar({ className }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [categories, setCategories] = useState(NAV_CATEGORIES);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, width: 0 });
  const menuId = useId();
  const hostRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimerRef = useRef(null);
  const shouldRestoreFocusRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const updateMenuPosition = useCallback(() => {
    if (!hostRef.current || window.matchMedia(MOBILE_QUERY).matches) return;
    const rect = hostRef.current.getBoundingClientRect();
    setMenuPosition({
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width)
    });
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
      panelRef.current?.querySelector(FOCUSABLE)?.focus({ preventScroll: true });
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

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
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
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.18, ease: [0.2, 0, 0, 1] }
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
            <div className="site-nav__left">
              <Link className="site-nav__brand" to="/" aria-label={t('nav.homeLabel')} onClick={() => closeMenu()}>
                <span className="site-nav__brand-muted">My </span>Gudauri
              </Link>

              <nav className="site-nav__links" aria-label={t('nav.mainLabel')}>
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
            </div>

            <div className="site-nav__actions">
              <LanguageSelect onBeforeOpen={() => isOpen && closeMenu()} />
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
                style={isMobile ? undefined : menuPosition}
              >
                <div className="site-nav-menu__mobile-head">
                  <Link className="site-nav__brand" to="/" onClick={() => closeMenu()}>
                    <span className="site-nav__brand-muted">My </span>Gudauri
                  </Link>
                  <button className="site-nav-menu__close" type="button" onClick={() => closeMenu(true)} aria-label={t('nav.closeMenu')}>
                    <i /><i />
                  </button>
                </div>

                <nav className="site-nav-menu__primary" aria-label={t('nav.mobileLabel')}>
                  {PRIMARY_LINKS.map((item) => (
                    <Link to={item.href} onClick={() => closeMenu()} key={item.href}>{t(`nav.${item.labelKey}`)}<span aria-hidden="true">↗</span></Link>
                  ))}
                </nav>

                <LanguageSelect mobile />

                <div className="site-nav-menu__content">
                  <div className="site-nav__categories">
                    {categories.map((category, index) => (
                      <motion.div key={category.slug} {...itemMotion(index)}>
                        <Link className="site-nav__category" to={category.href} onClick={() => closeMenu()}>
                          <img className="site-nav__category-icon" src={category.icon} alt="" aria-hidden="true" />
                          <span className="site-nav__category-copy">
                            <span className="site-nav__category-title">{t(`categories.${category.slug}.title`, category.title)}</span>
                            <span className="site-nav__category-desc">{t(`categories.${category.slug}.description`, category.description)}</span>
                          </span>
                          <span className="site-nav__category-arrow" aria-hidden="true">↗</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.aside className="site-nav__promo" aria-label={t('nav.promoLabel')} {...itemMotion(categories.length)}>
                    <p className="site-nav__promo-title">{t('nav.promoTitle')}</p>
                    <Link className="site-nav__promo-btn" to="/instructors" onClick={() => closeMenu()}>
                      {t('nav.promoButton')}
                      <span className="site-nav__promo-arrow" aria-hidden="true">↗</span>
                    </Link>
                  </motion.aside>
                </div>

                <a className="site-nav-menu__offer" href="mailto:support@mygudauri.com?subject=Offer%20a%20service" onClick={() => closeMenu()}>
                  {t('nav.offer')} <span aria-hidden="true">↗</span>
                </a>
              </motion.div>
            </motion.div>
          ),
        document.body
      )}
    </>
  );
}
