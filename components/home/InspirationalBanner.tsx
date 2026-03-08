'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface InspirationalBannerProps {
  locale: Locale
  dictionary: Dictionary
}

/**
 * Inspirational Banner Section
 *
 * A visually rich section inviting users to explore
 * the literary world of the author.
 */
export function InspirationalBanner({ locale, dictionary }: InspirationalBannerProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Градиентный разделитель сверху — отделяет от публикаций */}
      <div className="absolute top-0 left-0 right-0 py-8 pointer-events-none container-content">
        <div className="max-w-2xl mx-auto">
          <Divider variant="gradient" symbol="✦" spacing="md" />
        </div>
      </div>
      {/* Background elements */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--color-accent-light)]/5" />

        {/* Large decorative symbols — subtle literary motif */}
        <span
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 block',
            'text-[18rem] md:text-[26rem]',
            'text-[var(--color-accent-light)]/[0.04]',
            'font-heading select-none leading-none'
          )}
          aria-hidden="true"
        >
          ✦
        </span>
        <span
          className={cn(
            'absolute left-1/4 -translate-x-1/2 top-1/3 block',
            'text-[10rem] md:text-[14rem]',
            'text-[var(--color-accent-light)]/[0.02]',
            'font-heading select-none leading-none'
          )}
          aria-hidden="true"
        >
          ◈
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 container-content">
        <div className="max-w-2xl">
          <FadeIn direction="up" delay={0.1}>
            <span className="text-caption text-[var(--color-accent)] mb-4 block">
              {locale === 'ru' ? 'Литературная платформа' : 'Literary Platform'}
            </span>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <h2
              className={cn(
                'font-heading text-3xl md:text-4xl lg:text-5xl',
                'text-[var(--color-text-primary)]',
                'leading-tight mb-6',
                'text-balance'
              )}
            >
              {locale === 'ru'
                ? 'Пространство, где каждое слово имеет значение'
                : 'A space where every word matters'}
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <p
              className={cn(
                'text-base md:text-lg',
                'text-[var(--color-text-secondary)]',
                'leading-relaxed mb-8',
                'max-w-lg'
              )}
            >
              {locale === 'ru'
                ? 'Здесь живут тексты, которые хочется перечитывать. Поэзия, проза и размышления — каждое произведение создано с любовью к слову и вниманием к деталям.'
                : 'Here live texts that you want to reread. Poetry, prose, and reflections — each work is created with love for the word and attention to detail.'}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className="flex flex-wrap gap-4">
              <Button
                href={`/${locale}/library`}
                variant="primary"
                size="lg"
              >
                {dictionary.home.hero.cta}
              </Button>
              <Button
                href={`/${locale}/about`}
                variant="secondary"
                size="lg"
              >
                {dictionary.nav.about}
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}