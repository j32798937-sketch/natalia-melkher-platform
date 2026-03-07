'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { PublicationCard, type PublicationCardData } from '@/components/library/PublicationCard'
import { Divider } from '@/components/ui/Divider'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface LatestPublicationsProps {
  posts: PublicationCardData[]
  locale: Locale
  dictionary: Dictionary
}

/**
 * Latest Publications Section
 *
 * Shows the most recent publications in a clean grid or list.
 */
export function LatestPublications({ posts, locale, dictionary }: LatestPublicationsProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="container-content">
        {/* Section header */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <span className="text-caption text-[var(--color-accent)] mb-2 block">
                ◈ {dictionary.home.latest.title}
              </span>
              <h2 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)]">
                {dictionary.home.latest.title}
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
              {dictionary.home.latest.viewAll}
            </Button>
          </div>
        </FadeIn>

        {/* Publications grid */}
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

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <Button
            href={`/${locale}/library`}
            variant="secondary"
            size="md"
          >
            {dictionary.home.latest.viewAll}
          </Button>
        </div>
      </div>
    </section>
  )
}