/**
 * Transliteration maps for Cyrillic and other scripts
 */

const cyrillicMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
    'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
    'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
    'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
    'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  }
  
  const germanMap: Record<string, string> = {
    'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
    'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue',
  }
  
  const frenchMap: Record<string, string> = {
    'à': 'a', 'â': 'a', 'æ': 'ae', 'ç': 'c',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'î': 'i', 'ï': 'i', 'ô': 'o', 'œ': 'oe',
    'ù': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y',
  }
  
  const allMaps: Record<string, string> = {
    ...cyrillicMap,
    ...germanMap,
    ...frenchMap,
  }
  
  /**
   * Transliterate a string using predefined character maps
   */
  function transliterate(text: string): string {
    return text
      .split('')
      .map((char) => allMaps[char] ?? char)
      .join('')
  }
  
  /**
   * Generate a URL-safe slug from any text
   *
   * Supports:
   * - Cyrillic (Russian) → transliterated
   * - German umlauts → transliterated
   * - French accents → transliterated
   * - Chinese / Korean → removed (use ID-based slugs for CJK)
   * - Special characters → removed
   * - Multiple spaces/dashes → single dash
   *
   * @param text - Input text
   * @param maxLength - Maximum slug length (default: 80)
   * @returns URL-safe slug
   *
   * @example
   * slugify('Тишина в саду') → 'tishina-v-sadu'
   * slugify('Hello World!') → 'hello-world'
   * slugify('Über den Wolken') → 'ueber-den-wolken'
   */
  export function slugify(text: string, maxLength = 80): string {
    if (!text) return ''
  
    let slug = text.trim().toLowerCase()
  
    // Transliterate known characters
    slug = transliterate(slug)
  
    // Remove any remaining non-ASCII, non-alphanumeric characters
    // except hyphens and spaces
    slug = slug.replace(/[^\w\s-]/g, '')
  
    // Replace whitespace and underscores with hyphens
    slug = slug.replace(/[\s_]+/g, '-')
  
    // Remove consecutive hyphens
    slug = slug.replace(/-+/g, '-')
  
    // Remove leading/trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '')
  
    // Truncate to max length at word boundary
    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength)
      const lastDash = slug.lastIndexOf('-')
      if (lastDash > maxLength * 0.5) {
        slug = slug.substring(0, lastDash)
      }
    }
  
    return slug
  }
  
  /**
   * Generate a unique slug by appending a numeric suffix if needed
   *
   * @param text - Input text
   * @param existingSlugs - Array of existing slugs to check against
   * @returns Unique slug
   */
  export function uniqueSlug(text: string, existingSlugs: string[]): string {
    const slug = slugify(text)
    const slugSet = new Set(existingSlugs)
  
    if (!slugSet.has(slug)) return slug
  
    let counter = 2
    while (slugSet.has(`${slug}-${counter}`)) {
      counter++
    }
  
    return `${slug}-${counter}`
  }
  
  /**
   * Validate if a string is a valid slug
   */
  export function isValidSlug(slug: string): boolean {
    if (!slug || slug.length === 0) return false
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  }