import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { NAV_CATEGORIES } from '../../data/navCategories';
import { cn } from '../../utils/cn';
import '../../../styles/system.css';
import './SiteNavbar.scss';

export function SiteNavbar({ className }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const hostRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const closeOnOutsideClick = (event) => {
      if (hostRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.body.classList.add('menu-open');

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header ref={hostRef} className={cn('site-nav-host', className)}>
        <div className={cn('site-nav', isOpen && 'is-open')}>
          <div className="site-nav__bar">
            <div className="site-nav__left">
              <Link className="site-nav__brand" to="/" aria-label="My Gudauri home" onClick={closeMenu}>
                <span className="site-nav__brand-muted">My </span>Gudauri
              </Link>

              <nav className="site-nav__links" aria-label="Main navigation">
                <button
                  ref={triggerRef}
                  className="site-nav__trigger"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  onClick={() => setIsOpen((current) => !current)}
                >
                  <span className="site-nav__trigger-text">Categories</span>
                  <span className="site-nav__chevron-wrap" aria-hidden="true">
                    <img className="site-nav__chevron" src="/assets/navbar/caret-down.png" alt="" />
                  </span>
                </button>
                <a className="site-nav__link" href="#articles">Articles</a>
                <a className="site-nav__link" href="#about">About Gudauri</a>
                <a className="site-nav__link" href="#support">Support</a>
              </nav>
            </div>

            <Link className="site-nav__offer" to="/summary" onClick={closeMenu}>
              Offer a service
            </Link>
          </div>

          <div id={menuId} className="site-nav__panel" aria-hidden={!isOpen}>
            <div className="site-nav__categories">
              {NAV_CATEGORIES.map((category) => (
                <Link className="site-nav__category" to={category.href} key={category.title} onClick={closeMenu}>
                  <img className="site-nav__category-icon" src={category.icon} alt="" aria-hidden="true" />
                  <span className="site-nav__category-copy">
                    <span className="site-nav__category-title">{category.title}</span>
                    <span className="site-nav__category-desc">{category.description}</span>
                  </span>
                </Link>
              ))}
            </div>

            <aside className="site-nav__promo" aria-label="Featured category">
              <p className="site-nav__promo-title">Find the right ski instructor</p>
              <Link className="site-nav__promo-btn" to="/instructors" onClick={closeMenu}>
                Browse instructors
                <span className="site-nav__promo-arrow" aria-hidden="true">
                  <img src="/assets/navbar/arrow-35.png" alt="" />
                  <img src="/assets/navbar/arrow-36.png" alt="" />
                </span>
              </Link>
            </aside>
          </div>
        </div>
      </header>

      {createPortal(
        <button
          className={cn('site-nav-backdrop', isOpen && 'is-visible')}
          type="button"
          aria-label="Close categories menu"
          aria-hidden={!isOpen}
          disabled={!isOpen}
          tabIndex={isOpen ? 0 : -1}
          onClick={closeMenu}
        />,
        document.body
      )}
    </>
  );
}
