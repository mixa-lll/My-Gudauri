/**
 * URL-safe slugs for every CMS collection.
 *
 * Operators type names in Russian and Georgian, but page addresses and storage
 * keys have to stay ASCII, so this is shared by the instructor CMS, the media
 * bucket and any object type added later.
 */

const CYRILLIC_TO_LATIN = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y',
  ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const GEORGIAN_TO_LATIN = {
  ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z', თ: 't', ი: 'i', კ: 'k',
  ლ: 'l', მ: 'm', ნ: 'n', ო: 'o', პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u',
  ფ: 'p', ქ: 'k', ღ: 'gh', ყ: 'q', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz', წ: 'ts',
  ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h',
};

export function transliterate(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split('')
    .map((character) => {
      const lower = character.toLowerCase();
      const mapped = CYRILLIC_TO_LATIN[lower] ?? GEORGIAN_TO_LATIN[lower];
      if (mapped === undefined) return character;
      return character === lower ? mapped : `${mapped.charAt(0).toUpperCase()}${mapped.slice(1)}`;
    })
    .join('');
}

/** Latin, Cyrillic and Georgian text all produce a usable URL segment. */
export function toSlug(value, { maxLength } = {}) {
  const slug = transliterate(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return maxLength ? slug.slice(0, maxLength).replace(/-+$/g, '') : slug;
}
