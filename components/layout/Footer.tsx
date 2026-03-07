'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useInView } from '@/lib/hooks/useInView'
import { footerNavigation } from '@/lib/config/navigation'
import { getTranslation, getTranslationWithVars, type Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface FooterProps {
  locale: Locale
  dictionary: Dictionary
}

/**
 * Site Footer
 *
 * Literary, elegant footer with quote, navigation and contact.
 */
export function Footer({ locale, dictionary }: FooterProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const currentYear = new Date().getFullYear()

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        'relative overflow-hidden',
        'border-t border-[var(--color-border)]',
        'bg-gradient-to-b from-[var(--color-background)] to-[var(--color-surface)]'
      )}
    >
      {/* Decorative top line */}
      <div className="flex items-center justify-center gap-3 py-8 border-b border-[var(--color-border)]/60">
        <div className="h-px flex-1 max-w-[4rem] bg-gradient-to-r from-transparent to-[var(--color-accent-light)]/40" />
        <span className="text-[var(--color-accent-light)]/70 text-lg">✦</span>
        <div className="h-px flex-1 max-w-[4rem] bg-gradient-to-l from-transparent to-[var(--color-accent-light)]/40" />
      </div>

      {/* Main footer content — одна строка: Библиотека | Об авторе | Библиотека | Связаться */}
      <div className="container-content py-10 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="flex flex-wrap items-start justify-between gap-x-12 gap-y-8"
        >
          {/* Библиотека — категории */}
          <div className="min-w-0">
            <h4 className="font-heading text-sm font-medium text-[var(--color-text-primary)] uppercase tracking-widest mb-3 text-[var(--color-accent)]/90">
              {dictionary.nav.library}
            </h4>
            <ul className="space-y-2 flex flex-wrap gap-x-4 gap-y-1">
              {footerNavigation.literary.map((item) => {
                const label = getTranslation(dictionary, item.translationKey, item.label)
                const href = `/${locale}${item.href}`

                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      className={cn(
                        'text-sm text-[var(--color-text-secondary)]',
                        'hover:text-[var(--color-accent)]',
                        'transition-colors duration-200',
                        'inline-block hover:translate-x-1'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Об авторе */}
          <div className="min-w-0">
            <h4 className="font-heading text-sm font-medium text-[var(--color-text-primary)] uppercase tracking-widest mb-3 text-[var(--color-accent)]/90">
              {dictionary.nav.about}
            </h4>
            <ul className="space-y-2 flex flex-wrap gap-x-4 gap-y-1">
              {footerNavigation.about.map((item) => {
                const label = getTranslation(dictionary, item.translationKey, item.label)
                const href = `/${locale}${item.href}`

                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      className={cn(
                        'text-sm text-[var(--color-text-secondary)]',
                        'hover:text-[var(--color-accent)]',
                        'transition-colors duration-200',
                        'inline-block hover:translate-x-1'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  href={`/${locale}/search`}
                  className={cn(
                    'text-sm text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-accent)]',
                    'transition-colors duration-200',
                    'inline-block hover:translate-x-1'
                  )}
                >
                  {dictionary.nav.search}
                </Link>
              </li>
            </ul>
          </div>

          {/* Библиотека — все публикации */}
          <div className="min-w-0">
            <h4 className="font-heading text-sm font-medium text-[var(--color-text-primary)] uppercase tracking-widest mb-3 text-[var(--color-accent)]/90">
              {dictionary.nav.library}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/library`}
                  className={cn(
                    'text-sm text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-accent)]',
                    'transition-colors duration-200',
                    'inline-block hover:translate-x-1'
                  )}
                >
                  {locale === 'ru' ? 'Все публикации' : 'All publications'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Связаться */}
          <div className="min-w-0">
            <h4 className="font-heading text-sm font-medium text-[var(--color-text-primary)] uppercase tracking-widest mb-3 text-[var(--color-accent)]/90">
              {dictionary.contact.title}
            </h4>
            <a
              href="mailto:contact@natalia-melkher.com"
              className={cn(
                'text-sm text-[var(--color-text-secondary)]',
                'hover:text-[var(--color-accent)]',
                'transition-colors duration-200',
                'inline-block hover:underline underline-offset-2'
              )}
            >
              contact@natalia-melkher.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/50">
        <div className="container-content py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {getTranslationWithVars(dictionary, 'common.copyright', {
                year: currentYear,
              })}
              {' · '}
              {dictionary.common.allRightsReserved}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {dictionary.common.madeWith}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}