'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { PublicationCard, type PublicationCardData } from '@/components/library/PublicationCard'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { getTranslationWithVars, type Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface SearchPageClientProps {
  locale: Locale
  dictionary: Dictionary
}

export function SearchPageClient({ locale, dictionary }: SearchPageClientProps) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<PublicationCardData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      setSearched(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(debouncedQuery)}&locale=${locale}`
        )
        if (response.ok) {
          const data = await response.json()
          setResults(data.data || [])
        } else {
          setResults([])
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }

    fetchResults()
  }, [debouncedQuery, locale])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-12 pb-6 md:pt-20 md:pb-10">
        <div className="container-content max-w-2xl">
          <FadeIn direction="up" delay={0.1}>
            <h1 className="font-heading text-3xl md:text-4xl text-[var(--color-text-primary)] mb-8">
              {dictionary.search.title}
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dictionary.search.placeholder}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              }
              className="text-lg"
              autoFocus
            />
          </FadeIn>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 pb-20">
        <div className="container-content">
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {/* Results info */}
          {!loading && searched && debouncedQuery && (
            <FadeIn direction="up">
              <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
                {results.length > 0
                  ? getTranslationWithVars(dictionary, 'search.results', {
                      count: results.length,
                    })
                  : getTranslationWithVars(dictionary, 'search.noResults', {
                      query: debouncedQuery,
                    })}
              </p>
            </FadeIn>
          )}

          {/* Results grid */}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post, index) => (
                <PublicationCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  index={index}
                  variant="default"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && searched && results.length === 0 && debouncedQuery && (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block opacity-20">◎</span>
              <p className="text-[var(--color-text-secondary)]">
                {getTranslationWithVars(dictionary, 'search.noResults', {
                  query: debouncedQuery,
                })}
              </p>
            </div>
          )}

          {/* Initial state */}
          {!loading && !searched && !debouncedQuery && (
            <div className="text-center py-16">
              <span className="text-5xl mb-6 block text-[var(--color-accent-light)]/20">◎</span>
              <p className="text-[var(--color-text-tertiary)] text-sm">
                {dictionary.search.placeholder}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}