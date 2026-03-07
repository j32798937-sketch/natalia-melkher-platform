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
 * Features:
 * - Literary quote
 * - Navigation links by section
 * - Language and copyright
 * - Subtle reveal animation
 * - Decorative divider
 */
export function Footer({ locale, dictionary }: FooterProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const currentYear = new Date().getFullYear()

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        'relative',
        'border-t border-[var(--color-border)]',
        'bg-[var(--color-surface)]'
      )}
    >
      {/* Decorative top divider */}
      <div className="divider mt-0 mb-0 py-6">✦</div>

      {/* Main footer content */}
      <div className="container-content pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8"
        >
          {/* ── Column 1: Brand & Quote ──────────── */}
          <div className="md:col-span-5">
            {/* Site name */}
            <Link
              href={`/${locale}`}
              className="inline-block group no-underline mb-6"
            >
              <span className="font-heading text-2xl text-[var(--color-text-primary)] tracking-tight">
                <span className="text-[var(--color-accent)] mr-2 inline-block transition-transform duration-500 group-hover:rotate-45">
                  ✦
                </span>
                {locale === 'ru' ? 'Наталья Мельхер' : 'Natalia Melkher'}
              </span>
            </Link>

            {/* Literary quote */}
            <blockquote className="mt-4">
              <p className="font-literary text-sm italic leading-relaxed text-[var(--color-text-secondary)]">
                &ldquo;{dictionary.home.quote.text}&rdquo;
              </p>
            </blockquote>
          </div>

          {/* ── Column 2: Literary Links ─────────── */}
          <div className="md:col-span-3">
            <h4 className="text-caption mb-4">
              {dictionary.nav.library}
            </h4>
            <ul className="space-y-2.5">
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
                        'transition-colors duration-200'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── Column 3: About Links ────────────── */}
          <div className="md:col-span-2">
            <h4 className="text-caption mb-4">
              {dictionary.nav.about}
            </h4>
            <ul className="space-y-2.5">
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
                        'transition-colors duration-200'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}

              {/* Search */}
              <li>
                <Link
                  href={`/${locale}/search`}
                  className={cn(
                    'text-sm text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-accent)]',
                    'transition-colors duration-200'
                  )}
                >
                  {dictionary.nav.search}
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Column 4: Contact ────────────────── */}
          <div className="md:col-span-2">
            <h4 className="text-caption mb-4">
              {dictionary.contact.title}
            </h4>
            <a
              href="mailto:contact@natalia-melkher.com"
              className={cn(
                'text-sm text-[var(--color-text-secondary)]',
                'hover:text-[var(--color-accent)]',
                'transition-colors duration-200'
              )}
            >
              contact@natalia-melkher.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="container-content py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {getTranslationWithVars(dictionary, 'common.copyright', {
                year: currentYear,
              })}
              {' · '}
              {dictionary.common.allRightsReserved}
            </p>

            {/* Made with love */}
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {dictionary.common.madeWith}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}