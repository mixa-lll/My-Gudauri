import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGE_CODES, SUPPORTED_LANGUAGES, resolveLanguage } from './languages';
import { en } from './locales/en';
import { ka } from './locales/ka';
import { ru } from './locales/ru';

const STORAGE_KEY = 'my-gudauri-language';

const DICTIONARIES = { en, ru, ka };

const missingKeys = new Set();

function readPath(dictionary, path) {
  return path.split('.').reduce((result, key) => result?.[key], dictionary);
}

function interpolate(template, values) {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
  ));
}

function warnOnce(path, language) {
  if (!import.meta.env.DEV) return;
  const signature = `${language}:${path}`;
  if (missingKeys.has(signature)) return;
  missingKeys.add(signature);
  console.warn(`[i18n] Missing translation “${path}” for “${language}”.`);
}

export function translate(language, path, values) {
  const direct = readPath(DICTIONARIES[language], path);
  if (typeof direct === 'string') return interpolate(direct, values);

  if (language !== DEFAULT_LANGUAGE) {
    const fallback = readPath(DICTIONARIES[DEFAULT_LANGUAGE], path);
    if (typeof fallback === 'string') {
      warnOnce(path, language);
      return interpolate(fallback, values);
    }
  }

  warnOnce(path, language);
  return path;
}

export function translateList(language, path, { optional = false } = {}) {
  const direct = readPath(DICTIONARIES[language], path);
  if (Array.isArray(direct)) return direct;

  const fallback = readPath(DICTIONARIES[DEFAULT_LANGUAGE], path);
  if (Array.isArray(fallback)) {
    warnOnce(path, language);
    return fallback;
  }

  if (!optional) warnOnce(path, language);
  return [];
}

const LanguageContext = createContext(null);

function readInitialLanguage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (LANGUAGE_CODES.includes(stored)) return stored;

  const preferred = window.navigator.languages ?? [window.navigator.language];
  const matched = preferred
    .map((tag) => String(tag).slice(0, 2).toLowerCase())
    .find((tag) => LANGUAGE_CODES.includes(tag));
  return matched ?? DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readInitialLanguage);

  const setLanguage = useCallback((code) => {
    setLanguageState(LANGUAGE_CODES.includes(code) ? code : DEFAULT_LANGUAGE);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    languages: SUPPORTED_LANGUAGES,
    currentLanguage: resolveLanguage(language),
    setLanguage,
    t: (path, values) => translate(language, path, values),
    tList: (path, options) => translateList(language, path, options)
  }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './languages';
