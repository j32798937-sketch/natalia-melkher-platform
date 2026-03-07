'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Divider } from '@/components/ui/Divider'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AuthorQuoteProps {
  dictionary: Dictionary
}

/**
 * Author Quote Section
 *
 * A centered, elegant quote from the author
 * with subtle reveal animation.
 */
export function AuthorQuote({ dictionary }: AuthorQuoteProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-literary text-center">
        <Divider variant="literary" spacing="lg" />

        <FadeIn delay={0.2} duration={1} direction="none">
          <blockquote className="relative">
            {/* Opening quote mark */}
            <span
              className={cn(
                'absolute -top-6 left-1/2 -translate-x-1/2',
                'text-5xl md:text-6xl font-heading',
                'text-[var(--color-accent-light)]/20',
                'select-none leading-none'
              )}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Quote text */}
            <p
              className={cn(
                'font-literary text-lg md:text-xl lg:text-2xl',
                'italic leading-relaxed',
                'text-[var(--color-text-primary)]',
                'max-w-2xl mx-auto',
                'text-balance'
              )}
            >
              {dictionary.home.quote.text}
            </p>

            {/* Attribution */}
            <footer className="mt-6">
              <cite
                className={cn(
                  'not-italic font-body text-sm',
                  'text-[var(--color-accent)]',
                  'tracking-wide'
                )}
              >
                — {dictionary.home.quote.author}
              </cite>
            </footer>
          </blockquote>
        </FadeIn>

        <Divider variant="literary" spacing="lg" />
      </div>
    </section>
  )
}