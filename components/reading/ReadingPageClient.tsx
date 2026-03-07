'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Divider } from '@/components/ui/Divider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PublicationCard, type PublicationCardData } from '@/components/library/PublicationCard'
import { ReadingControls } from '@/components/reading/ReadingControls'
import { formatDateFull, formatDateLiterary } from '@/lib/utils/formatDate'
import { formatReadingTime } from '@/lib/utils/helpers'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

/* ── Types ───────────────────────────────────────────── */

interface ReadingPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  type: string
  categoryName: string | null
  categorySlug: string | null
  categoryIcon: string | null
  categoryColor: string | null
  coverImage: string | null
  readingTime: number
  views: number
  publishedAt: string | null
  createdAt: string
}

interface ReadingPageClientProps {
  post: ReadingPost
  relatedPosts: PublicationCardData[]
  locale: Locale
  dictionary: Dictionary
}

/* ── Component ───────────────────────────────────────── */

export function ReadingPageClient({
  post,
  relatedPosts,
  locale,
  dictionary,
}: ReadingPageClientProps) {
  const [fontSize, setFontSize] = useLocalStorage('reading-font-size', 18)
  const [bookmarked, setBookmarked] = useState(false)

  // Determine literary text class based on post type
  const literaryClass = `literary-text literary-text--${post.type}`
  const fontSizeClass = `reading-size-${fontSize}`

  return (
    <article className={cn('min-h-screen', fontSizeClass)}>
      {/* Back link */}
      <div className="container-content pt-8">
        <FadeIn direction="left" distance={15} duration={0.5}>
          <Link
            href={`/${locale}/library`}
            className={cn(
              'inline-flex items-center gap-2 text-sm',
              'text-[var(--color-text-tertiary)]',
              'hover:text-[var(--color-accent)]',
              'transition-colors duration-200'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {dictionary.reading.backToLibrary}
          </Link>
        </FadeIn>
      </div>

      {/* Header section */}
      <header className="container-literary pt-8 pb-10 md:pt-12 md:pb-14">
        {/* Category badge */}
        {post.categoryName && (
          <FadeIn delay={0.1} direction="up" distance={10}>
            <div className="mb-5">
              <Badge variant="accent" size="md">
                {post.categoryIcon || '✦'} {post.categoryName}
              </Badge>
            </div>
          </FadeIn>
        )}

        {/* Title */}
        <FadeIn delay={0.2} duration={0.8}>
          <h1
            className={cn(
              'font-heading text-3xl md:text-4xl lg:text-5xl',
              'leading-tight text-[var(--color-text-primary)]',
              'mb-6 text-balance'
            )}
          >
            {post.title}
          </h1>
        </FadeIn>

        {/* Meta info */}
        <FadeIn delay={0.4} duration={0.6}>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
            {/* Date */}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDateLiterary(post.publishedAt, locale)}
              </span>
            )}

            {/* Reading time */}
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatReadingTime(post.readingTime)}
            </span>

            {/* Views */}
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {post.views}
            </span>

            {/* Separator */}
            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={cn(
                'flex items-center gap-1.5 transition-colors duration-200',
                bookmarked
                  ? 'text-[var(--color-accent)]'
                  : 'hover:text-[var(--color-text-secondary)]'
              )}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              {bookmarked ? dictionary.reading.bookmarked : dictionary.reading.bookmark}
            </button>
          </div>
        </FadeIn>

        {/* Reading controls */}
        <FadeIn delay={0.5} duration={0.5}>
          <div className="mt-6">
            <ReadingControls
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              locale={locale}
              dictionary={dictionary}
              postContent={post.content}
              postTitle={post.title}
            />
          </div>
        </FadeIn>
      </header>

      {/* Divider */}
      <Divider variant="literary" spacing="sm" />

      {/* Content */}
      <FadeIn delay={0.6} duration={1}>
        <div className="container-literary py-10 md:py-14">
          <div
            className={cn(literaryClass)}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </FadeIn>

      {/* End mark */}
      <div className="container-literary text-center py-6">
        <span className="text-[var(--color-accent-light)] text-lg opacity-40">✦</span>
      </div>

      <Divider variant="ornamental" spacing="lg" />

      {/* Related works */}
      {relatedPosts.length > 0 && (
        <section className="container-content py-12 md:py-16">
          <FadeIn direction="up">
            <h2 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] mb-8">
              {dictionary.reading.relatedWorks}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.slice(0, 4).map((related, index) => (
              <PublicationCard
                key={related.id}
                post={related}
                locale={locale}
                index={index}
                variant="compact"
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              href={`/${locale}/library`}
              variant="secondary"
              size="md"
            >
              {dictionary.reading.backToLibrary}
            </Button>
          </div>
        </section>
      )}
    </article>
  )
}