// Intl falls back to the browser's own language when a locale has no data,
// so every entry ends with en-GB to keep date formatting predictable.
export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', shortLabel: 'EN', label: 'English', englishLabel: 'English', country: 'gb', intlLocale: ['en-GB'] },
  { code: 'ru', shortLabel: 'RU', label: 'Русский', englishLabel: 'Russian', country: 'ru', intlLocale: ['ru-RU', 'en-GB'] },
  { code: 'ka', shortLabel: 'KA', label: 'ქართული', englishLabel: 'Georgian', country: 'ge', intlLocale: ['ka-GE', 'en-GB'] }
];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((item) => item.code);

export function resolveLanguage(code) {
  return SUPPORTED_LANGUAGES.find((item) => item.code === code)
    ?? SUPPORTED_LANGUAGES.find((item) => item.code === DEFAULT_LANGUAGE);
}
