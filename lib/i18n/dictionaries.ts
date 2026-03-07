import type { Locale } from '@/lib/utils/constants'

/**
 * Dictionary type definition
 * Defines the structure of translation files
 */
export interface Dictionary {
  meta: {
    title: string
    description: string
  }
  nav: {
    home: string
    library: string
    poetry: string
    prose: string
    essays: string
    reflections: string
    diary: string
    about: string
    contact: string
    search: string
    language: string
  }
  home: {
    hero: {
      title: string
      subtitle: string
      cta: string
    }
    featured: {
      title: string
      viewAll: string
    }
    latest: {
      title: string
      viewAll: string
    }
    quote: {
      text: string
      author: string
    }
  }
  library: {
    title: string
    subtitle: string
    allCategories: string
    noResults: string
    readMore: string
    readingTime: string
    views: string
    publishedOn: string
    sortBy: string
    sortNewest: string
    sortOldest: string
    sortPopular: string
    filterBy: string
  }
  reading: {
    backToLibrary: string
    publishedOn: string
    readingTime: string
    views: string
    share: string
    listen: string
    stopListening: string
    relatedWorks: string
    fontSize: string
    theme: string
    themeLight: string
    themeDark: string
    themeSepia: string
    bookmark: string
    bookmarked: string
  }
  about: {
    title: string
    subtitle: string
  }
  contact: {
    title: string
    subtitle: string
    name: string
    email: string
    subject: string
    message: string
    send: string
    sending: string
    sent: string
    error: string
  }
  search: {
    title: string
    placeholder: string
    noResults: string
    resultsFor: string
    results: string
  }
  cms: {
    dashboard: string
    posts: string
    newPost: string
    editPost: string
    media: string
    categories: string
    analytics: string
    settings: string
    logout: string
    save: string
    saving: string
    saved: string
    delete: string
    cancel: string
    confirm: string
    publish: string
    unpublish: string
    draft: string
    published: string
    archived: string
    title: string
    content: string
    excerpt: string
    category: string
    tags: string
    coverImage: string
    featured: string
    slug: string
    metaTitle: string
    metaDescription: string
    translate: string
    aiAssist: string
  }
  common: {
    loading: string
    error: string
    retry: string
    goBack: string
    goHome: string
    notFound: string
    notFoundMessage: string
    serverError: string
    serverErrorMessage: string
    copyright: string
    allRightsReserved: string
    madeWith: string
  }
  ai: {
    assistant: string
    translate: string
    illustrate: string
    recommend: string
    generating: string
    improve: string
    continue: string
    rephrase: string
    summarize: string
    expand: string
  }
  tts: {
    play: string
    pause: string
    stop: string
    speed: string
    voice: string
  }
}

/**
 * Lazy-load dictionaries to reduce bundle size
 * Each locale is loaded only when needed
 */
const dictionaryLoaders: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import('@/translations/ru.json').then((m) => m.default as Dictionary),
  en: () => import('@/translations/en.json').then((m) => m.default as Dictionary),
  de: () => import('@/translations/de.json').then((m) => m.default as Dictionary),
  fr: () => import('@/translations/fr.json').then((m) => m.default as Dictionary),
  cn: () => import('@/translations/cn.json').then((m) => m.default as Dictionary),
  kr: () => import('@/translations/kr.json').then((m) => m.default as Dictionary),
}

/**
 * Cache for loaded dictionaries
 */
const dictionaryCache = new Map<Locale, Dictionary>()

/**
 * Load a dictionary for a given locale
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  // Check cache first
  const cached = dictionaryCache.get(locale)
  if (cached) return cached

  try {
    const dictionary = await dictionaryLoaders[locale]()
    dictionaryCache.set(locale, dictionary)
    return dictionary
  } catch (error) {
    console.error(`[Melkher] Failed to load dictionary for locale: ${locale}`, error)

    // Fallback to Russian
    if (locale !== 'ru') {
      console.log('[Melkher] Falling back to Russian dictionary')
      return getDictionary('ru')
    }

    throw error
  }
}

/**
 * Get a nested value from dictionary by dot-separated key
 *
 * @example
 * getTranslation(dict, 'nav.home') → 'Главная'
 */
export function getTranslation(
  dictionary: Dictionary,
  key: string,
  fallback?: string
): string {
  const keys = key.split('.')
  let current: unknown = dictionary

  for (const k of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback || key
    }
    current = (current as Record<string, unknown>)[k]
  }

  if (typeof current === 'string') {
    return current
  }

  return fallback || key
}

/**
 * Get a translation with variable substitution
 *
 * @example
 * getTranslationWithVars(dict, 'search.resultsFor', { query: 'тишина' })
 * → 'Результаты для "тишина"'
 */
export function getTranslationWithVars(
  dictionary: Dictionary,
  key: string,
  vars: Record<string, string | number>,
  fallback?: string
): string {
  let text = getTranslation(dictionary, key, fallback)

  for (const [varName, varValue] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(varValue))
  }

  return text
}