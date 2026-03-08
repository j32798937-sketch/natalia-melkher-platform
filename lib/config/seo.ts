import { siteConfig } from '@/lib/config/site'
import type { Locale } from '@/lib/utils/constants'

/**
 * SEO Configuration
 */

export interface MetaData {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  locale?: string
  alternateLocales?: { locale: string; url: string }[]
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  noindex?: boolean
}

/**
 * Default meta data for each locale
 */
export const defaultMetaByLocale: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: 'Наталья Мельхер — Литературная платформа',
    description:
      'Поэзия, проза, эссе и размышления. Художественная платформа, где тексты воспринимаются как форма искусства.',
  },
  en: {
    title: 'Natalia Melkher — Literary Platform',
    description:
      'Poetry, prose, essays, and reflections. An artistic platform where texts are experienced as a form of art.',
  },
  de: {
    title: 'Natalia Melkher — Literarische Plattform',
    description:
      'Poesie, Prosa, Essays und Reflexionen. Eine künstlerische Plattform, auf der Texte als Kunstform erlebt werden.',
  },
  fr: {
    title: 'Natalia Melkher — Plateforme littéraire',
    description:
      'Poésie, prose, essais et réflexions. Une plateforme artistique où les textes sont perçus comme une forme d\'art.',
  },
  cn: {
    title: 'Natalia Melkher — 文学平台',
    description:
      '诗歌、散文、随笔和思考。一个将文字视为艺术形式的艺术平台。',
  },
  kr: {
    title: 'Natalia Melkher — 문학 플랫폼',
    description:
      '시, 산문, 에세이, 그리고 성찰. 텍스트를 예술의 한 형태로 경험하는 예술적 플랫폼.',
  },
}

/**
 * OpenGraph locale mapping
 */
export const ogLocaleMap: Record<Locale, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  de: 'de_DE',
  fr: 'fr_FR',
  cn: 'zh_CN',
  kr: 'ko_KR',
}

/**
 * Generate page title with site name
 */
export function generateTitle(pageTitle?: string, locale: Locale = 'ru'): string {
  if (!pageTitle) {
    return defaultMetaByLocale[locale].title
  }
  return `${pageTitle}${siteConfig.seo.titleTemplate.replace('%s', '')}`
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, locale?: Locale): string {
  const baseUrl = siteConfig.url.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  if (locale) {
    return `${baseUrl}/${locale}${cleanPath}`
  }

  return `${baseUrl}${cleanPath}`
}

/**
 * Generate alternate locale URLs for hreflang tags
 */
export function generateAlternateUrls(
  path: string
): { locale: string; url: string }[] {
  const baseUrl = siteConfig.url.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return siteConfig.locales.map((locale) => ({
    locale: ogLocaleMap[locale],
    url: `${baseUrl}/${locale}${cleanPath}`,
  }))
}

/**
 * Generate full meta data object for a page
 */
export function generateMetaData(
  options: Partial<MetaData> & { locale?: Locale; path?: string }
): MetaData {
  const locale = options.locale || 'ru'
  const defaults = defaultMetaByLocale[locale]

  return {
    title: options.title || defaults.title,
    description: options.description || defaults.description,
    keywords: options.keywords || [],
    canonicalUrl: options.path
      ? generateCanonicalUrl(options.path, locale)
      : options.canonicalUrl,
    ogImage: options.ogImage || `${siteConfig.url}/images/og/default.jpg`,
    ogType: options.ogType || 'website',
    twitterCard: options.twitterCard || 'summary_large_image',
    locale: ogLocaleMap[locale],
    alternateLocales: options.path
      ? generateAlternateUrls(options.path)
      : options.alternateLocales,
    publishedTime: options.publishedTime,
    modifiedTime: options.modifiedTime,
    author: options.author || siteConfig.author.name,
    section: options.section,
    noindex: options.noindex || false,
  }
}

/**
 * Schema.org structured data for the website
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: defaultMetaByLocale.ru.description,
    url: siteConfig.url,
    author: generatePersonSchema(),
    inLanguage: siteConfig.locales.map((l) => ogLocaleMap[l].replace('_', '-')),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/ru/search?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  }
}

/**
 * Schema.org structured data for the author
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    description: siteConfig.author.bio,
    url: siteConfig.url,
    sameAs: [
      siteConfig.author.social.telegram,
    ].filter(Boolean),
  }
}

/**
 * Schema.org structured data for a literary work / article
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  url: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  section?: string
  locale?: Locale
  genre?: string
}) {
  const isPoetry = article.section?.toLowerCase().includes('поэзи') || article.section?.toLowerCase() === 'poetry'
  const isProse = article.section?.toLowerCase().includes('проз') || article.section?.toLowerCase() === 'prose'
  const schemaType = isPoetry || isProse ? 'CreativeWork' : 'Article'

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image || `${siteConfig.url}/images/og/default.jpg`,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: generatePersonSchema(),
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    articleSection: article.section,
    inLanguage: article.locale
      ? ogLocaleMap[article.locale].replace('_', '-')
      : 'ru',
  }

  if (schemaType === 'CreativeWork') {
    schema.genre = article.genre || article.section || (isPoetry ? 'Поэзия' : 'Проза')
    schema.creator = generatePersonSchema()
    schema.isAccessibleForFree = true
  }

  return schema
}

/**
 * Schema.org BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}