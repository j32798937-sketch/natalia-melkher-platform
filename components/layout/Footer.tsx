'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useInView } from '@/lib/hooks/useInView'
import { footerNavigation } from '@/lib/config/navigation'
import { getTranslation, getTranslationWithVars, type Dictionary } from '@/lib/i18n/dictionaries'
import { Divider } from '@/components/ui/Divider'
import type { Locale } from '@/lib/utils/constants'

interface FooterProps {
  locale: Locale
  dictionary: Dictionary
}

/**
 * Site Footer
 *
 * Literary, elegant footer — centered layout with gradient separators.
 */
export function Footer({ locale, dictionary }: FooterProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const currentYear = new Date().getFullYear()

  const linkClass = cn(
    'font-literary text-[15px] text-[var(--color-text-secondary)]',
    'hover:text-[var(--color-accent)]',
    'transition-colors duration-300',
    'inline-block'
  )

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        'relative overflow-hidden',
        'border-t border-[var(--color-border)]',
        'bg-gradient-to-b from-[var(--color-background)] to-[var(--color-surface)]'
      )}
    >
      {/* Top divider — gradient with symbol */}
      <div className="container-content pt-12 pb-4">
        <Divider variant="gradient" symbol="✦" spacing="md" />
      </div>

      {/* Main footer — centered, elegant */}
      <div className="container-content py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-12 gap-y-10 md:gap-y-12"
        >
          {/* Библиотека — категории */}
          <div className="flex flex-col items-center text-center min-w-[140px]">
            <h4 className="font-heading text-xs font-medium uppercase tracking-[0.2em] mb-4 text-[var(--color-accent)]">
              {dictionary.nav.library}
            </h4>
            <ul className="space-y-2">
              {footerNavigation.literary.map((item) => {
                const label = getTranslation(dictionary, item.translationKey, item.label)
                const href = `/${locale}${item.href}`

                return (
                  <li key={item.href}>
                    <Link href={href} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Vertical gradient separator */}
          <div className="hidden md:block w-px h-24 self-center bg-gradient-to-b from-transparent via-[var(--color-accent)]/40 to-transparent flex-shrink-0" aria-hidden="true" />

          {/* Об авторе */}
          <div className="flex flex-col items-center text-center min-w-[140px]">
            <h4 className="font-heading text-xs font-medium uppercase tracking-[0.2em] mb-4 text-[var(--color-accent)]">
              {dictionary.nav.about}
            </h4>
            <ul className="space-y-2">
              {footerNavigation.about.map((item) => {
                const label = getTranslation(dictionary, item.translationKey, item.label)
                const href = `/${locale}${item.href}`

                return (
                  <li key={item.href}>
                    <Link href={href} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link href={`/${locale}/search`} className={linkClass}>
                  {dictionary.nav.search}
                </Link>
              </li>
            </ul>
          </div>

          {/* Vertical gradient separator */}
          <div className="hidden md:block w-px h-24 self-center bg-gradient-to-b from-transparent via-[var(--color-accent)]/40 to-transparent flex-shrink-0" aria-hidden="true" />

          {/* Все публикации */}
          <div className="flex flex-col items-center text-center min-w-[140px]">
            <h4 className="font-heading text-xs font-medium uppercase tracking-[0.2em] mb-4 text-[var(--color-accent)]">
              {dictionary.nav.library}
            </h4>
            <Link href={`/${locale}/library`} className={linkClass}>
              {locale === 'ru' ? 'Все публикации' : 'All publications'}
            </Link>
          </div>

          {/* Vertical gradient separator */}
          <div className="hidden md:block w-px h-24 self-center bg-gradient-to-b from-transparent via-[var(--color-accent)]/40 to-transparent flex-shrink-0" aria-hidden="true" />

          {/* Связаться */}
          <div className="flex flex-col items-center text-center min-w-[140px]">
            <h4 className="font-heading text-xs font-medium uppercase tracking-[0.2em] mb-4 text-[var(--color-accent)]">
              {dictionary.contact.title}
            </h4>
            <a
              href="mailto:contact@natalia-melkher.com"
              className={cn(linkClass, 'hover:underline underline-offset-4')}
            >
              contact@natalia-melkher.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* Gradient separator before bottom bar */}
      <div className="container-content pb-4">
        <Divider variant="gradient" symbol="✦" spacing="sm" />
      </div>

      {/* Bottom bar — centered, subtle */}
      <div className="border-t border-[var(--color-border)]/80">
        <div className="container-content py-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent mb-4" aria-hidden="true" />
            <p className="font-literary text-sm text-[var(--color-text-tertiary)]">
              {getTranslationWithVars(dictionary, 'common.copyright', {
                year: currentYear,
              })}
              {' · '}
              {dictionary.common.allRightsReserved}
            </p>
            <div className="w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent mt-4" aria-hidden="true" />
            <p className="font-literary text-sm text-[var(--color-text-tertiary)]/80 italic">
              <span aria-hidden="true">❤️</span>{' '}
              {dictionary.common.madeWith}
              {' '}<span aria-hidden="true">📚</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
