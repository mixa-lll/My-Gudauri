import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';
import { cn } from '../../utils/cn';
import { FlagIcon } from '../UI/FlagIcon/FlagIcon';
import './LanguageSwitcher.scss';

const SWITCHER_VARIANTS = ['bar', 'stacked'];
const MENU_OFFSET = 10;
const MENU_EDGE_MARGIN = 12;

function ChevronIcon() {
  return (
    <svg className="language-switcher__chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="m4 6.5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="language-option__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LanguageOption({ option, isActive, onSelect, role }) {
  const selectionProps = role === 'menuitemradio'
    ? { role: 'menuitemradio', 'aria-checked': isActive }
    : { 'aria-pressed': isActive };

  return (
    <button
      className={cn('language-option', isActive && 'is-active')}
      type="button"
      onClick={() => onSelect(option.code)}
      {...selectionProps}
    >
      <FlagIcon className="language-option__flag" country={option.country} size="xs" />
      <span className="language-option__name" lang={option.code}>{option.label}</span>
      {isActive ? <CheckIcon /> : null}
    </button>
  );
}

export function LanguageSwitcher({ variant = 'bar', className, onBeforeOpen }) {
  if (!SWITCHER_VARIANTS.includes(variant)) throw new Error(`LanguageSwitcher: unsupported variant “${variant}”.`);

  const { currentLanguage, language, languages, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  const shouldReduceMotion = useReducedMotion();

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({
      top: Math.round(rect.bottom + MENU_OFFSET),
      right: Math.max(MENU_EDGE_MARGIN, Math.round(window.innerWidth - rect.right))
    });
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  const openMenu = useCallback(() => {
    onBeforeOpen?.();
    updatePosition();
    setIsOpen(true);
  }, [onBeforeOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      closeMenu();
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeMenu(true);
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
  }, [closeMenu, isOpen, updatePosition]);

  const chooseLanguage = (code) => {
    setLanguage(code);
    closeMenu(true);
  };

  if (variant === 'stacked') {
    return (
      <div className={cn('language-switcher', 'language-switcher--stacked', className)} role="group" aria-label={t('language.label')}>
        <span className="language-switcher__label">{t('language.label')}</span>
        <div className="language-switcher__list">
          {languages.map((option) => (
            <LanguageOption
              option={option}
              isActive={option.code === language}
              onSelect={setLanguage}
              key={option.code}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('language-switcher', className)}>
      <button
        ref={triggerRef}
        className="language-switcher__trigger"
        type="button"
        aria-label={`${t('language.switcherLabel')}: ${currentLanguage.label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => (isOpen ? closeMenu(true) : openMenu())}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown') return;
          event.preventDefault();
          if (!isOpen) openMenu();
          window.setTimeout(
            () => menuRef.current?.querySelector('[role="menuitemradio"]')?.focus(),
            shouldReduceMotion ? 0 : 170
          );
        }}
      >
        <FlagIcon className="language-switcher__flag" country={currentLanguage.country} size="xs" />
        <span className="language-switcher__code">{currentLanguage.shortLabel}</span>
        <ChevronIcon />
      </button>

      {isOpen && createPortal(
        <motion.div
          ref={menuRef}
          id={menuId}
          className="language-switcher-menu"
          role="menu"
          aria-label={t('language.label')}
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
          <div className="language-switcher__list">
            {languages.map((option) => (
              <LanguageOption
                option={option}
                isActive={option.code === language}
                onSelect={chooseLanguage}
                role="menuitemradio"
                key={option.code}
              />
            ))}
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}
