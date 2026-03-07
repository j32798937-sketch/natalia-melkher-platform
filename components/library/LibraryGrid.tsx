'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { PublicationCard, type PublicationCardData } from '@/components/library/PublicationCard'
import { PublicationCardSkeleton } from '@/components/ui/Skeleton'
import type { Locale } from '@/lib/utils/constants'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface LibraryGridProps {
  posts: PublicationCardData[]
  locale: Locale
  dictionary: Dictionary
  loading?: boolean
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number
}

/**
 * Library Grid Component
 *
 * Displays publications in a responsive grid layout.
 * Shows skeleton loading state.
 */
export function LibraryGrid({
  posts,
  locale,
  dictionary,
  loading = false,
  skeletonCount = 6,
}: LibraryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <PublicationCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-4xl mb-4 block opacity-20">◇</span>
        <p className="text-[var(--color-text-secondary)] font-body">
          {dictionary.library.noResults}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <PublicationCard
          key={post.id}
          post={post}
          locale={locale}
          index={index}
          variant="default"
        />
      ))}
    </div>
  )
}