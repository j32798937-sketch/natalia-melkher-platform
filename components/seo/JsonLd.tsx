'use client'

import React from 'react'

interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * JSON-LD Structured Data Component
 *
 * Injects Schema.org structured data into the page head.
 *
 * @example
 * <JsonLd data={generateWebsiteSchema()} />
 * <JsonLd data={generateArticleSchema({ ... })} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  )
}