import { LOCALES, DEFAULT_LOCALE, LOCALE_NAMES } from '@/lib/utils/constants'
import type { Locale } from '@/lib/utils/constants'

/**
 * Internationalization Configuration
 */

export const i18nConfig = {
  /**
   * Default locale
   */
  defaultLocale: DEFAULT_LOCALE,

  /**
   * All supported locales
   */
  locales: LOCALES,

  /**
   * Locale display names
   */
  localeNames: LOCALE_NAMES,

  /**
   * Locale detection strategy
   */
  detection: {
    /**
     * Check URL path first
     */
    urlPath: true,

    /**
     * Then check cookie
     */
    cookie: true,

    /**
     * Cookie name for locale preference
     */
    cookieName: 'melkher-locale',

    /**
     * Then check Accept-Language header
     */
    acceptLanguage: true,
  },

  /**
   * URL structure: /{locale}/path
   */
  urlStructure: 'prefix' as const,

  /**
   * Fallback locale chain
   * If a translation is missing, try these in order
   */
  fallbackChain: {
    en: ['en'],
    de: ['de', 'en'],
    fr: ['fr', 'en'],
    cn: ['cn', 'en'],
    kr: ['kr', 'en'],
    ru: ['ru'],
  } as Record<Locale, Locale[]>,
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale)
}

/**
 * Get the best matching locale from Accept-Language header
 */
export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, quality] = lang.trim().split(';q=')
      return {
        code: code.trim().toLowerCase().split('-')[0],
        quality: quality ? parseFloat(quality) : 1,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  const localeMapping: Record<string, Locale> = {
    ru: 'ru',
    en: 'en',
    de: 'de',
    fr: 'fr',
    zh: 'cn',
    ko: 'kr',
  }

  for (const lang of languages) {
    const mapped = localeMapping[lang.code]
    if (mapped) return mapped
  }

  return DEFAULT_LOCALE
}

/**
 * Get locale from URL path
 */
export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const firstSegment = segments[0]
  if (isValidLocale(firstSegment)) {
    return firstSegment
  }

  return null
}

/**
 * Remove locale prefix from a path
 */
export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return '/'

  if (isValidLocale(segments[0])) {
    const remaining = segments.slice(1).join('/')
    return remaining ? `/${remaining}` : '/'
  }

  return pathname
}

/**
 * Add locale prefix to a path
 */
export function addLocaleToPath(pathname: string, locale: Locale): string {
  const clean = removeLocaleFromPath(pathname)
  if (clean === '/') return `/${locale}`
  return `/${locale}${clean}`
}

/**
 * Get HTML dir attribute for locale
 */
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  // All supported locales are LTR
  return 'ltr'
}

/**
 * Get HTML lang attribute for locale
 */
export function getHtmlLang(locale: Locale): string {
  const map: Record<Locale, string> = {
    ru: 'ru',
    en: 'en',
    de: 'de',
    fr: 'fr',
    cn: 'zh-CN',
    kr: 'ko',
  }
  return map[locale]
}