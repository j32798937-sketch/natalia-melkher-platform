'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { TextReveal } from '@/components/animations/TextReveal'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { HeroConstellationScene } from '@/components/visuals/HeroConstellationScene'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

const FLOATING_SYMBOLS = ['✦', '◈', '◇', '○', '△', '✦', '◈', '◇'] as const

/** Deterministic pseudo-random per index — avoids hydration mismatch */
function seeded(i: number, max: number) {
  return ((i * 7 + 13) % 97) / 97 * max
}

function FloatingSymbols() {
  const configs = useMemo(
    () =>
      FLOATING_SYMBOLS.map((symbol, i) => ({
        symbol,
        fontSize: 1 + seeded(i, 2),
        left: 10 + seeded(i + 1, 80),
        top: 10 + seeded(i + 2, 80),
        yDelta: 15 + seeded(i + 3, 20),
        duration: 8 + seeded(i + 4, 6),
      })),
    []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {configs.map((c, i) => (
        <motion.span
          key={i}
          className="absolute text-[var(--color-accent-light)] select-none"
          style={{
            fontSize: `${c.fontSize}rem`,
            left: `${c.left}%`,
            top: `${c.top}%`,
            opacity: 0.06,
          }}
          animate={{
            y: [0, -c.yDelta, 0],
            opacity: [0.04, 0.1, 0.04],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        >
          {c.symbol}
        </motion.span>
      ))}
    </div>
  )
}

interface HeroSectionProps {
  locale: Locale
  dictionary: Dictionary
}

export function HeroSection({ locale, dictionary }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative min-h-[90vh] flex items-center justify-center',
        'overflow-hidden'
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-b from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)]'
        )}
        aria-hidden="true"
      />

      {/* WebGL constellation layer */}
      <HeroConstellationScene />

      {/* Floating decorative symbols — deterministic values to avoid hydration mismatch */}
      <FloatingSymbols />

      {/* Radial glow */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[600px] h-[600px] md:w-[800px] md:h-[800px]',
          'bg-gradient-radial from-[var(--color-accent-light)]/5 via-transparent to-transparent',
          'rounded-full blur-3xl pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container-content text-center px-6 py-20">
        {/* Decorative line */}
        <FadeIn delay={0.2} direction="none" duration={1.2}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-accent-light)]" />
            <span className="text-[var(--color-accent-light)] text-sm tracking-[0.3em]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-accent-light)]" />
          </div>
        </FadeIn>

        {/* Main title */}
        <div className="mb-8">
          <TextReveal
            as="h1"
            by="word"
            stagger={0.1}
            delay={0.4}
            className={cn(
              'title-hero',
              'text-[var(--color-text-primary)]',
              'text-balance'
            )}
          >
            {dictionary.home.hero.title}
          </TextReveal>
        </div>

        {/* Subtitle */}
        <FadeIn delay={1.2} duration={1} direction="up" distance={20}>
          <p
            className={cn(
              'font-body text-base md:text-lg',
              'text-[var(--color-text-secondary)]',
              'max-w-xl mx-auto leading-relaxed',
              'text-pretty'
            )}
          >
            {dictionary.home.hero.subtitle}
          </p>
        </FadeIn>

        {/* CTA Button */}
        <FadeIn delay={1.8} duration={0.8} direction="up" distance={15}>
          <div className="mt-10">
            <Button
              href={`/${locale}/library`}
              variant="primary"
              size="lg"
              className="group"
              iconRight={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              }
            >
              {dictionary.home.hero.cta}
            </Button>
          </div>
        </FadeIn>

        {/* Scroll indicator — minimal chevron */}
        <FadeIn delay={2.5} duration={1} direction="none">
          <div className="mt-16 md:mt-24 flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[var(--color-text-tertiary)]/60"
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}