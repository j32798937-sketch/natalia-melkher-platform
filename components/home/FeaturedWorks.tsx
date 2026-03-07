'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { PublicationCard, type PublicationCardData } from '@/components/library/PublicationCard'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface FeaturedWorksProps {
  posts: PublicationCardData[]
  locale: Locale
  dictionary: Dictionary
}

/**
 * Featured Works Section
 *
 * Displays hand-picked featured publications
 * in a prominent grid layout.
 */
export function FeaturedWorks({ posts, locale, dictionary }: FeaturedWorksProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container-content">
        {/* Section header */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <span className="text-caption text-[var(--color-accent)] mb-2 block">
                ✦ {dictionary.home.featured.title}
              </span>
              <h2 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)]">
                {dictionary.home.featured.title}
              </h2>
            </div>

            <Button
              href={`/${locale}/library`}
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
              iconRight={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              }
            >
              {dictionary.home.featured.viewAll}
            </Button>
          </div>
        </FadeIn>

        {/* Featured grid */}
        <div
          className={cn(
            'grid gap-6 md:gap-8',
            posts.length === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : posts.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {posts.map((post, index) => (
            <PublicationCard
              key={post.id}
              post={post}
              locale={locale}
              index={index}
              variant="featured"
            />
          ))}
        </div>

        {/* Mobile view all button */}
        <div className="mt-8 text-center md:hidden">
          <Button
            href={`/${locale}/library`}
            variant="secondary"
            size="md"
          >
            {dictionary.home.featured.viewAll}
          </Button>
        </div>
      </div>
    </section>
  )
}