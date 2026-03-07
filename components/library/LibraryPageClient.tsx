'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { LibraryFilters } from '@/components/library/LibraryFilters'
import { LibraryGrid } from '@/components/library/LibraryGrid'
import { Divider } from '@/components/ui/Divider'
import type { PublicationCardData } from '@/components/library/PublicationCard'
import type { CategoryWithCount } from '@/lib/services/CategoryService'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface LibraryPageClientProps {
  locale: Locale
  dictionary: Dictionary
  categories: CategoryWithCount[]
  initialPosts: PublicationCardData[]
  totalPosts: number
  activeCategory?: string
}

/**
 * Library Page Client Component
 *
 * Handles client-side interactivity: sorting, filtering.
 */
export function LibraryPageClient({
  locale,
  dictionary,
  categories,
  initialPosts,
  totalPosts,
  activeCategory,
}: LibraryPageClientProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [posts, setPosts] = useState(initialPosts)
  const [total, setTotal] = useState(totalPosts)
  const [loading, setLoading] = useState(false)

  const handleSortChange = async (newSort: 'newest' | 'oldest' | 'popular') => {
    setSortBy(newSort)
    setLoading(true)

    try {
      const params = new URLSearchParams({
        sort: newSort,
        limit: '12',
        page: '1',
      })

      if (activeCategory) {
        params.set('category', activeCategory)
      }

      const response = await fetch(`/api/posts?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setPosts(result.data)
        setTotal(result.total)
      }
    } catch (error) {
      console.error('[Melkher] Sort fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header section */}
      <section className="pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container-content">
          <FadeIn direction="up" delay={0.1}>
            <span className="text-caption text-[var(--color-accent)] mb-3 block">
              ✦ {dictionary.library.title}
            </span>
          </FadeIn>

          <TextReveal
            as="h1"
            by="word"
            stagger={0.08}
            delay={0.2}
            className={cn(
              'font-heading text-3xl md:text-4xl lg:text-5xl',
              'text-[var(--color-text-primary)]',
              'mb-4'
            )}
          >
            {dictionary.library.title}
          </TextReveal>

          <FadeIn direction="up" delay={0.5}>
            <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl">
              {dictionary.library.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      <Divider variant="subtle" spacing="sm" />

      {/* Filters */}
      <section className="py-6">
        <div className="container-content">
          <FadeIn direction="up" delay={0.3}>
            <LibraryFilters
              categories={categories}
              locale={locale}
              dictionary={dictionary}
              activeCategory={activeCategory}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalResults={total}
            />
          </FadeIn>
        </div>
      </section>

      {/* Publications grid */}
      <section className="py-8 pb-20">
        <div className="container-content">
          <LibraryGrid
            posts={posts}
            locale={locale}
            dictionary={dictionary}
            loading={loading}
          />
        </div>
      </section>
    </div>
  )
}