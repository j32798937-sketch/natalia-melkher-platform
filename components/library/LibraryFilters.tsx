'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { CategoryNav } from '@/components/library/CategoryNav'
import { SortControls } from '@/components/library/SortControls'
import type { CategoryWithCount } from '@/lib/services/CategoryService'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface LibraryFiltersProps {
  categories: CategoryWithCount[]
  locale: Locale
  dictionary: Dictionary
  activeCategory?: string
  sortBy: 'newest' | 'oldest' | 'popular'
  onSortChange: (sort: 'newest' | 'oldest' | 'popular') => void
  totalResults: number
}

/**
 * Library Filters Bar
 *
 * Combines category navigation and sort controls.
 */
export function LibraryFilters({
  categories,
  locale,
  dictionary,
  activeCategory,
  sortBy,
  onSortChange,
  totalResults,
}: LibraryFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Category pills */}
      <CategoryNav
        categories={categories}
        locale={locale}
        dictionary={dictionary}
        activeSlug={activeCategory}
      />

      {/* Sort + result count */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {totalResults}{' '}
          {locale === 'ru'
            ? totalResults === 1
              ? 'публикация'
              : totalResults < 5
                ? 'публикации'
                : 'публикаций'
            : totalResults === 1
              ? 'publication'
              : 'publications'}
        </p>

        <SortControls
          sortBy={sortBy}
          onSortChange={onSortChange}
          dictionary={dictionary}
        />
      </div>
    </div>
  )
}