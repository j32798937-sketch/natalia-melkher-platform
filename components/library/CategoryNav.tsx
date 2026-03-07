'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { CategoryWithCount } from '@/lib/services/CategoryService'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface CategoryNavProps {
  categories: CategoryWithCount[]
  locale: Locale
  dictionary: Dictionary
  activeSlug?: string
}

/**
 * Category Navigation
 *
 * Horizontal scrollable category pills for the library.
 */
export function CategoryNav({
  categories,
  locale,
  dictionary,
  activeSlug,
}: CategoryNavProps) {
  const pathname = usePathname()

  const allActive = !activeSlug || pathname === `/${locale}/library`

  const totalPosts = categories.reduce((sum, c) => sum + c.post_count, 0)

  return (
    <nav
      className={cn(
        'flex gap-2 overflow-x-auto no-scrollbar',
        'pb-2 -mb-2'
      )}
      aria-label="Categories"
    >
      {/* All categories */}
      <Link
        href={`/${locale}/library`}
        className={cn(
          'relative flex-shrink-0 px-4 py-2 rounded-full',
          'text-sm font-body tracking-wide whitespace-nowrap',
          'transition-all duration-200',
          allActive
            ? 'text-white'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-highlight)]'
        )}
      >
        {allActive && (
          <motion.span
            layoutId="category-pill"
            className="absolute inset-0 bg-[var(--color-accent)] rounded-full"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        )}
        <span className="relative z-10">
          {dictionary.library.allCategories}
          <span className="ml-1.5 opacity-60">{totalPosts}</span>
        </span>
      </Link>

      {/* Individual categories */}
      {categories.map((category) => {
        const isActive = activeSlug === category.slug

        return (
          <Link
            key={category.id}
            href={`/${locale}/library/${category.slug}`}
            className={cn(
              'relative flex-shrink-0 px-4 py-2 rounded-full',
              'text-sm font-body tracking-wide whitespace-nowrap',
              'transition-all duration-200',
              isActive
                ? 'text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-highlight)]'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 bg-[var(--color-accent)] rounded-full"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
            <span className="relative z-10">
              <span className="mr-1.5">{category.icon}</span>
              {category.name}
              <span className="ml-1.5 opacity-60">{category.post_count}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}