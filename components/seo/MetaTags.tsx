'use client'

import React from 'react'
import type { Locale } from '@/lib/utils/constants'
import { ogLocaleMap, generateAlternateUrls } from '@/lib/config/seo'

interface MetaTagsProps {
  locale?: Locale
  path?: string
  canonicalUrl?: string
  noindex?: boolean
}

/**
 * Additional Meta Tags Component
 *
 * Renders hreflang alternate links and canonical URL.
 * Most meta tags are handled by Next.js Metadata API,
 * this component adds supplementary tags.
 *
 * @example
 * <MetaTags locale="ru" path="/library" />
 */
export function MetaTags({
  locale,
  path,
  canonicalUrl,
  noindex = false,
}: MetaTagsProps) {
  const alternates = path ? generateAlternateUrls(path) : []

  return (
    <>
      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Alternate language versions */}
      {alternates.map((alt) => (
        <link
          key={alt.locale}
          rel="alternate"
          hrefLang={alt.locale.replace('_', '-').toLowerCase()}
          href={alt.url}
        />
      ))}

      {/* x-default for language selection */}
      {path && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/ru${path === '/' ? '' : path}`}
        />
      )}

      {/* Noindex */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Content language */}
      {locale && (
        <meta
          httpEquiv="content-language"
          content={ogLocaleMap[locale]?.replace('_', '-') || 'ru'}
        />
      )}
    </>
  )
}