export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', shortLabel: 'EN', label: 'English', englishLabel: 'English', country: 'gb' },
  { code: 'ru', shortLabel: 'RU', label: 'Русский', englishLabel: 'Russian', country: 'ru' },
  { code: 'ka', shortLabel: 'KA', label: 'ქართული', englishLabel: 'Georgian', country: 'ge' }
];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((item) => item.code);

export function resolveLanguage(code) {
  return SUPPORTED_LANGUAGES.find((item) => item.code === code)
    ?? SUPPORTED_LANGUAGES.find((item) => item.code === DEFAULT_LANGUAGE);
}
