import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NAV_CATEGORIES } from '../../data/navCategories';
import { resolveSiteCategory } from '../../data/siteCategories';
import { cn } from '../../utils/cn';
import './SiteNavbar.scss';

const MOBILE_QUERY = '(max-width: 820px)';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PRIMARY_LINKS = [
  { label: 'Articles', href: '/articles' },
  { label: 'About Gudauri', href: '/about-gudauri' }
];

export function SiteNavbar({ className }) {
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
          initial: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
          animate: { opacity: 1, clipPath: 'inset(0 0 0% 0 round 18px)' },
          exit: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
          transition: { duration: 0.24, ease: [0.2, 0, 0, 1] }
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
              <Link className="site-nav__brand" to="/" aria-label="My Gudauri home" onClick={() => closeMenu()}>
                <span className="site-nav__brand-muted">My </span>Gudauri
              </Link>

              <nav className="site-nav__links" aria-label="Main navigation">
                <button
                  ref={triggerRef}
                  className="site-nav__trigger"
                  type="button"
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  onClick={toggleMenu}
                >
                  <span className="site-nav__trigger-text">Categories</span>
                  <span className="site-nav__chevron-wrap" aria-hidden="true">
                    <img className="site-nav__chevron" src="/assets/navbar/caret-down.png" alt="" />
                  </span>
                  <span className="site-nav__burger" aria-hidden="true"><i /><i /></span>
                </button>
                {PRIMARY_LINKS.map((item) => (
                  <Link className="site-nav__link" to={item.href} onClick={() => closeMenu()} key={item.href}>{item.label}</Link>
                ))}
                <a className="site-nav__link" href="mailto:mygudauri@gmail.com" onClick={() => closeMenu()}>Support</a>
              </nav>
            </div>

            <Link className="site-nav__offer" to="/summary" onClick={() => closeMenu()}>
              Offer a service
            </Link>
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
                aria-label="Close menu"
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
                aria-label="Site navigation"
                style={isMobile ? undefined : menuPosition}
              >
                <div className="site-nav-menu__mobile-head">
                  <Link className="site-nav__brand" to="/" onClick={() => closeMenu()}>
                    <span className="site-nav__brand-muted">My </span>Gudauri
                  </Link>
                  <button className="site-nav-menu__close" type="button" onClick={() => closeMenu(true)} aria-label="Close menu">
                    <i /><i />
                  </button>
                </div>

                <nav className="site-nav-menu__primary" aria-label="Mobile navigation">
                  {PRIMARY_LINKS.map((item) => (
                    <Link to={item.href} onClick={() => closeMenu()} key={item.href}>{item.label}<span aria-hidden="true">↗</span></Link>
                  ))}
                  <a href="mailto:mygudauri@gmail.com" onClick={() => closeMenu()}>Support<span aria-hidden="true">↗</span></a>
                </nav>

                <div className="site-nav-menu__content">
                  <div className="site-nav__categories">
                    {categories.map((category, index) => (
                      <motion.div key={category.title} {...itemMotion(index)}>
                        <Link className="site-nav__category" to={category.href} onClick={() => closeMenu()}>
                          <img className="site-nav__category-icon" src={category.icon} alt="" aria-hidden="true" />
                          <span className="site-nav__category-copy">
                            <span className="site-nav__category-title">{category.title}</span>
                            <span className="site-nav__category-desc">{category.description}</span>
                          </span>
                          <span className="site-nav__category-arrow" aria-hidden="true">↗</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.aside className="site-nav__promo" aria-label="Featured category" {...itemMotion(categories.length)}>
                    <p className="site-nav__promo-title">Find the right ski instructor</p>
                    <Link className="site-nav__promo-btn" to="/instructors" onClick={() => closeMenu()}>
                      Browse instructors
                      <span className="site-nav__promo-arrow" aria-hidden="true">↗</span>
                    </Link>
                  </motion.aside>
                </div>

                <Link className="site-nav-menu__offer" to="/summary" onClick={() => closeMenu()}>
                  Offer a service <span aria-hidden="true">↗</span>
                </Link>
              </motion.div>
            </motion.div>
          ),
        document.body
      )}
    </>
  );
}
