'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { PublicationCard, type PublicationCardData } from '@/components/library/PublicationCard'
import { Divider } from '@/components/ui/Divider'
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
          <div className="flex flex-col items-center text-center gap-4 mb-10 md:mb-14">
            <div>
              <span className="text-caption text-[var(--color-accent)] mb-2 block tracking-wide">
                ✦ {dictionary.home.featured.title}
              </span>
              <h2 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] tracking-tight">
                {dictionary.home.featured.title}
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Featured list — centered, with gradient separators between entries */}
        <div className="flex flex-col items-center max-w-2xl mx-auto gap-0">
          {posts.map((post, index) => (
            <div key={post.id} className="w-full flex flex-col items-center">
              <div className="w-full py-8 md:py-10 first:pt-0">
                <PublicationCard
                  post={post}
                  locale={locale}
                  index={index}
                  variant="featured"
                  centered
                />
              </div>
              {index < posts.length - 1 && (
                <div className="w-full">
                  <Divider variant="gradient" symbol="✦" spacing="sm" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View all button — градиенты сверху и снизу, изящный шрифт и цвет */}
        <div className="w-full pt-10 md:pt-12 pb-10 md:pb-12">
          <Divider variant="gradient" symbol="✦" spacing="md" />
          <div className="text-center py-6">
            <Button
              href={`/${locale}/library`}
              variant="secondary"
              size="md"
              className="md:hidden font-heading text-[var(--color-accent)] text-base tracking-wide hover:text-[var(--color-accent-hover)] border-[var(--color-accent)]/30"
            >
              {dictionary.home.featured.viewAll}
            </Button>
            <Button
              href={`/${locale}/library`}
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex font-heading text-[var(--color-accent)] text-sm tracking-[0.15em] hover:text-[var(--color-accent-light)] hover:bg-transparent"
              iconRight={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              }
            >
              {dictionary.home.featured.viewAll}
            </Button>
          </div>
          <Divider variant="gradient" symbol="✦" spacing="md" />
        </div>
      </div>
    </section>
  )
}