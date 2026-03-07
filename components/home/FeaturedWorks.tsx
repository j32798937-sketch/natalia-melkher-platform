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
    <section className="py-16 md:py-24 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)]/[0.02] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="container-content relative">
        {/* Section header — centered */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-col items-center text-center gap-6 mb-10 md:mb-14">
            <div>
              <span className="text-caption text-[var(--color-accent)] mb-2 block tracking-wide">
                ✦ {dictionary.home.featured.title}
              </span>
              <h2 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] tracking-tight">
                {dictionary.home.featured.title}
              </h2>
            </div>

            <div>
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
          </div>
        </FadeIn>

        {/* Featured grid — centered */}
        <div
          className={cn(
            'grid gap-8 md:gap-10 justify-items-center',
            posts.length === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : posts.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
          )}
        >
          {posts.map((post, index) => (
            <PublicationCard
              key={post.id}
              post={post}
              locale={locale}
              index={index}
              variant="featured"
              centered
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