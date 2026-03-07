'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { LOCALES, DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_FLAGS } from '@/lib/utils/constants'
import { isValidLocale, removeLocaleFromPath } from '@/lib/i18n/config'
import type { Locale } from '@/lib/utils/constants'

interface UseLocaleReturn {
  /** Current active locale */
  locale: Locale
  /** All supported locales */
  locales: readonly Locale[]
  /** Display name of current locale */
  localeName: string
  /** Flag emoji of current locale */
  localeFlag: string
  /** All locale names */
  localeNames: Record<Locale, string>
  /** All locale flags */
  localeFlags: Record<Locale, string>
  /** Switch to a different locale */
  switchLocale: (newLocale: Locale) => void
  /** Get localized path */
  getLocalizedPath: (path: string, targetLocale?: Locale) => string
  /** Check if a locale is the current one */
  isCurrentLocale: (checkLocale: Locale) => boolean
}

/**
 * Hook for managing locale/language in the application
 *
 * @example
 * const { locale, switchLocale, localeName } = useLocale()
 */
export function useLocale(): UseLocaleReturn {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()

  // Get current locale from URL params
  const locale = useMemo<Locale>(() => {
    const paramLocale = params?.locale as string | undefined
    if (paramLocale && isValidLocale(paramLocale)) {
      return paramLocale
    }

    // Try to extract from pathname
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0 && isValidLocale(segments[0])) {
      return segments[0] as Locale
    }

    return DEFAULT_LOCALE
  }, [params, pathname])

  const localeName = LOCALE_NAMES[locale]
  const localeFlag = LOCALE_FLAGS[locale]

  /**
   * Switch to a different locale
   */
  const switchLocale = useCallback(
    (newLocale: Locale) => {
      if (!isValidLocale(newLocale) || newLocale === locale) return

      // Get the current path without locale prefix
      const pathWithoutLocale = removeLocaleFromPath(pathname)

      // Build new path with new locale
      const newPath =
        pathWithoutLocale === '/'
          ? `/${newLocale}`
          : `/${newLocale}${pathWithoutLocale}`

      // Set locale cookie
      document.cookie = `melkher-locale=${newLocale};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`

      router.push(newPath)
    },
    [locale, pathname, router]
  )

  /**
   * Get a localized path for a given path and optional locale
   */
  const getLocalizedPath = useCallback(
    (path: string, targetLocale?: Locale): string => {
      const loc = targetLocale || locale
      const cleanPath = path.startsWith('/') ? path : `/${path}`
      const pathWithoutLocale = removeLocaleFromPath(cleanPath)

      if (pathWithoutLocale === '/') {
        return `/${loc}`
      }

      return `/${loc}${pathWithoutLocale}`
    },
    [locale]
  )

  /**
   * Check if a locale is the current one
   */
  const isCurrentLocale = useCallback(
    (checkLocale: Locale): boolean => checkLocale === locale,
    [locale]
  )

  return {
    locale,
    locales: LOCALES,
    localeName,
    localeFlag,
    localeNames: LOCALE_NAMES,
    localeFlags: LOCALE_FLAGS,
    switchLocale,
    getLocalizedPath,
    isCurrentLocale,
  }
}