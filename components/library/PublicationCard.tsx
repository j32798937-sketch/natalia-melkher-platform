'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { formatDateSmart } from '@/lib/utils/formatDate'
import { CATEGORY_ICONS } from '@/lib/utils/constants'
import type { Locale } from '@/lib/utils/constants'

export interface PublicationCardData {
  id: number
  title: string
  slug: string
  excerpt: string | null
  type: string
  categorySlug: string | null
  categoryName: string | null
  coverImage: string | null
  readingTime: number
  views: number
  publishedAt: string | null
  featured: boolean
}

interface PublicationCardProps {
  post: PublicationCardData
  locale: Locale
  /** Index for stagger animation */
  index?: number
  /** Display variant */
  variant?: 'default' | 'featured' | 'compact'
}

/**
 * Publication Card Component
 *
 * Displays a literary publication preview in the library grid.
 * Supports default, featured, and compact variants.
 */
export function PublicationCard({
  post,
  locale,
  index = 0,
  variant = 'default',
}: PublicationCardProps) {
  const categoryIcon = post.categorySlug
    ? CATEGORY_ICONS[post.categorySlug] || '✦'
    : '✦'

  const href = `/${locale}/library/${post.categorySlug || 'all'}/${post.slug}`

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <Link
          href={href}
          className={cn(
            'group flex items-start gap-4 py-4',
            'border-b border-[var(--color-border-light)]',
            'last:border-b-0',
            'transition-colors duration-200',
            'hover:bg-[var(--color-highlight)]/50',
            '-mx-3 px-3 rounded-lg'
          )}
        >
          {/* Number / Icon */}
          <span className="text-[var(--color-accent-light)] text-sm mt-0.5 flex-shrink-0 w-6 text-center font-heading">
            {categoryIcon}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-heading text-base md:text-lg leading-snug',
                'text-[var(--color-text-primary)]',
                'group-hover:text-[var(--color-accent)]',
                'transition-colors duration-200',
                'line-clamp-2'
              )}
            >
              {post.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-tertiary)]">
              {post.categoryName && <span>{post.categoryName}</span>}
              <span>{post.readingTime} мин</span>
              {post.publishedAt && (
                <span>{formatDateSmart(post.publishedAt, locale)}</span>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="group"
      >
        <Link href={href} className="block no-underline">
          <div
            className={cn(
              'relative overflow-hidden rounded-xl',
              'border border-[var(--color-card-border)]',
              'bg-[var(--color-card-bg)]',
              'shadow-[0_2px_8px_var(--color-shadow)]',
              'transition-all duration-500',
              'hover:shadow-literary',
              'hover:border-[var(--color-accent-light)]/40',
              'hover:-translate-y-1'
            )}
          >
            {/* Cover image or gradient */}
            <div
              className={cn(
                'relative h-48 md:h-56 overflow-hidden',
                'bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-highlight)]'
              )}
            >
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl text-[var(--color-accent-light)]/30 font-heading">
                    {categoryIcon}
                  </span>
                </div>
              )}

              {/* Featured badge */}
              {post.featured && (
                <div className="absolute top-3 right-3">
                  <Badge variant="accent" size="sm">✦ Featured</Badge>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card-bg)] via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Category */}
              {post.categoryName && (
                <div className="mb-3">
                  <Badge variant="outline" size="sm">
                    {categoryIcon} {post.categoryName}
                  </Badge>
                </div>
              )}

              {/* Title */}
              <h3
                className={cn(
                  'font-heading text-xl md:text-2xl leading-tight mb-3',
                  'text-[var(--color-text-primary)]',
                  'group-hover:text-[var(--color-accent)]',
                  'transition-colors duration-300'
                )}
              >
                {post.title}
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {post.readingTime} мин
                </span>

                {post.publishedAt && (
                  <span>{formatDateSmart(post.publishedAt, locale)}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  // Default variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group"
    >
      <Link href={href} className="block no-underline">
        <div
          className={cn(
            'relative overflow-hidden rounded-xl',
            'border border-[var(--color-card-border)]',
            'bg-[var(--color-card-bg)]',
            'shadow-[0_1px_3px_var(--color-shadow)]',
            'transition-all duration-400',
            'hover:shadow-soft hover:shadow-[0_6px_20px_-8px_var(--color-shadow)]',
            'hover:border-[var(--color-accent-light)]/25',
            'hover:-translate-y-1'
          )}
        >
          {/* Cover or gradient strip */}
          {post.coverImage ? (
            <div className="relative h-40 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card-bg)] via-transparent to-transparent opacity-40" />
            </div>
          ) : (
            <div className="h-1 bg-gradient-to-r from-[var(--color-accent-light)]/40 to-[var(--color-accent)]/20" />
          )}

          {/* Content */}
          <div className="p-5">
            {/* Category */}
            {post.categoryName && (
              <span className="text-caption text-[var(--color-accent)] mb-2 inline-block">
                {categoryIcon} {post.categoryName}
              </span>
            )}

            {/* Title */}
            <h3
              className={cn(
                'font-heading text-lg leading-snug mb-2',
                'text-[var(--color-text-primary)]',
                'group-hover:text-[var(--color-accent)]',
                'transition-colors duration-300',
                'line-clamp-2'
              )}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 mb-3">
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
              <span>{post.readingTime} мин</span>
              {post.publishedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                  <span>{formatDateSmart(post.publishedAt, locale)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}