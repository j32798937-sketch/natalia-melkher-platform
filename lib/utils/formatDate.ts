import {
    format,
    formatDistanceToNow,
    parseISO,
    isValid,
    differenceInDays,
    differenceInHours,
  } from 'date-fns'
  import { ru, enUS, de, fr, zhCN, ko } from 'date-fns/locale'
  import type { Locale } from 'date-fns'
  import type { Locale as AppLocale } from '@/lib/utils/constants'
  
  /**
   * Locale map for date-fns
   */
  const localeMap: Record<AppLocale, Locale> = {
    ru: ru,
    en: enUS,
    de: de,
    fr: fr,
    cn: zhCN,
    kr: ko,
  }
  
  /**
   * Get date-fns locale object from locale string
   */
  function getDateLocale(locale: AppLocale = 'ru'): Locale {
    return localeMap[locale] || ru
  }
  
  /**
   * Parse a date string or return the Date object
   */
  function ensureDate(date: string | Date): Date {
    if (typeof date === 'string') {
      const parsed = parseISO(date)
      if (!isValid(parsed)) {
        const fallback = new Date(date)
        if (!isValid(fallback)) {
          return new Date()
        }
        return fallback
      }
      return parsed
    }
    return date
  }
  
  /**
   * Format date in full literary style
   * Example: "15 марта 2025"
   */
  export function formatDateFull(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    return format(d, 'd MMMM yyyy', { locale: getDateLocale(locale) })
  }
  
  /**
   * Format date in short style
   * Example: "15 мар 2025"
   */
  export function formatDateShort(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    return format(d, 'd MMM yyyy', { locale: getDateLocale(locale) })
  }
  
  /**
   * Format date in compact style
   * Example: "15.03.2025"
   */
  export function formatDateCompact(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
  
    if (locale === 'en') {
      return format(d, 'MM/dd/yyyy')
    }
    return format(d, 'dd.MM.yyyy')
  }
  
  /**
   * Format date with time
   * Example: "15 марта 2025, 14:30"
   */
  export function formatDateTime(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    return format(d, 'd MMMM yyyy, HH:mm', { locale: getDateLocale(locale) })
  }
  
  /**
   * Format as relative time
   * Example: "2 часа назад", "вчера", "3 дня назад"
   */
  export function formatDateRelative(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    const now = new Date()
    const hoursDiff = differenceInHours(now, d)
    const daysDiff = differenceInDays(now, d)
  
    if (hoursDiff < 1) {
      return locale === 'ru' ? 'только что' : 'just now'
    }
  
    if (daysDiff > 30) {
      return formatDateFull(d, locale)
    }
  
    return formatDistanceToNow(d, {
      addSuffix: true,
      locale: getDateLocale(locale),
    })
  }
  
  /**
   * Smart date formatting — combines relative and full formats
   * Shows relative for recent dates, full for older dates
   */
  export function formatDateSmart(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    const daysDiff = differenceInDays(new Date(), d)
  
    if (daysDiff < 7) {
      return formatDateRelative(d, locale)
    }
  
    return formatDateFull(d, locale)
  }
  
  /**
   * Format date for literary publication display
   * Elegant format for the reading page
   * Example: "Март, 2025" or "March, 2025"
   */
  export function formatDateLiterary(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    const monthYear = format(d, 'LLLL, yyyy', { locale: getDateLocale(locale) })
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
  }
  
  /**
   * Format date for SEO / meta tags (ISO 8601)
   */
  export function formatDateISO(date: string | Date): string {
    const d = ensureDate(date)
    return d.toISOString()
  }
  
  /**
   * Format year only
   */
  export function formatYear(date: string | Date): string {
    const d = ensureDate(date)
    return format(d, 'yyyy')
  }
  
  /**
   * Format month and year
   */
  export function formatMonthYear(
    date: string | Date,
    locale: AppLocale = 'ru'
  ): string {
    const d = ensureDate(date)
    const result = format(d, 'LLLL yyyy', { locale: getDateLocale(locale) })
    return result.charAt(0).toUpperCase() + result.slice(1)
  }