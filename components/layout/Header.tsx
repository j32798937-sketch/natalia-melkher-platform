'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useTheme } from '@/lib/hooks/useTheme'
import { useScrollPosition } from '@/lib/hooks/useScrollPosition'
import { useBreakpoints } from '@/lib/hooks/useMediaQuery'
import { Navigation } from '@/components/layout/Navigation'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface HeaderProps {
  locale: Locale
  dictionary: Dictionary
}

/**
 * Site Header
 *
 * Features:
 * - Glassmorphism background
 * - Hides on scroll down, shows on scroll up
 * - Theme toggle
 * - Language switcher
 * - Mobile hamburger menu
 * - Scroll progress bar
 */
export function Header({ locale, dictionary }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { direction, isScrolled } = useScrollPosition({ threshold: 20 })
  const { isMobile } = useBreakpoints()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      queueMicrotask(() => setMobileMenuOpen(false))
    }
  }, [isMobile, mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const isHeaderVisible = direction !== 'down' || !isScrolled || mobileMenuOpen

  // Theme icon
  const themeIcon = theme === 'dark' ? '☀' : theme === 'sepia' ? '◐' : '☾'
  const themeLabel =
    theme === 'dark'
      ? dictionary.reading.themeLight
      : theme === 'sepia'
        ? dictionary.reading.themeDark
        : dictionary.reading.themeDark

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-shadow duration-300',
          isScrolled ? 'shadow-subtle' : ''
        )}
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Glass background */}
        <div
          className={cn(
            'absolute inset-0 glass',
            'border-b transition-colors duration-300',
            isScrolled
              ? 'border-[var(--color-border)]'
              : 'border-transparent'
          )}
        />

        {/* Header content */}
        <div className="relative container-content pt-[var(--safe-area-top)]">
          <div className="flex items-center justify-between h-[var(--header-height)]">
            {/* ── Logo / Site Name ──────────────────── */}
            <Link
              href={`/${locale}`}
              className="group flex items-center gap-3 no-underline"
            >
              {/* Decorative mark */}
              <span
                className={cn(
                  'text-lg transition-transform duration-500',
                  'group-hover:rotate-45',
                  'text-[var(--color-accent)]'
                )}
                aria-hidden="true"
              >
                ✦
              </span>

              {/* Site name */}
              <span
                className={cn(
                  'font-heading text-xl md:text-2xl font-light tracking-tight',
                  'text-[var(--color-text-primary)]',
                  'transition-colors duration-300'
                )}
              >
                {locale === 'ru' ? 'Наталья Мельхер' : 'Natalia Melkher'}
              </span>
            </Link>

            {/* ── Desktop Navigation ───────────────── */}
            <div className="hidden lg:flex items-center gap-8">
              <Navigation locale={locale} dictionary={dictionary} />

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Search button */}
                <Link
                  href={`/${locale}/search`}
                  className={cn(
                    'p-2 rounded-full',
                    'text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-text-primary)]',
                    'hover:bg-[var(--color-highlight)]',
                    'transition-all duration-200'
                  )}
                  aria-label={dictionary.nav.search}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </Link>

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'p-2 rounded-full',
                    'text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-text-primary)]',
                    'hover:bg-[var(--color-highlight)]',
                    'transition-all duration-200',
                    'text-base'
                  )}
                  aria-label={themeLabel}
                  title={themeLabel}
                >
                  {themeIcon}
                </button>

                {/* Language switcher */}
                <LanguageSwitcher locale={locale} dictionary={dictionary} />
              </div>
            </div>

            {/* ── Mobile Controls ──────────────────── */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Theme toggle (mobile) */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-full',
                  'text-[var(--color-text-secondary)]',
                  'hover:text-[var(--color-text-primary)]',
                  'transition-colors duration-200',
                  'text-base'
                )}
                aria-label={themeLabel}
              >
                {themeIcon}
              </button>

              {/* Hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  'relative w-10 h-10 flex items-center justify-center',
                  'text-[var(--color-text-primary)]',
                  'rounded-full',
                  'hover:bg-[var(--color-highlight)]',
                  'transition-colors duration-200'
                )}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative w-5 h-4">
                  <span
                    className={cn(
                      'absolute left-0 w-full h-[1.5px] bg-current',
                      'transition-all duration-300',
                      mobileMenuOpen
                        ? 'top-1/2 -translate-y-1/2 rotate-45'
                        : 'top-0'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-current',
                      'transition-opacity duration-300',
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 w-full h-[1.5px] bg-current',
                      'transition-all duration-300',
                      mobileMenuOpen
                        ? 'top-1/2 -translate-y-1/2 -rotate-45'
                        : 'bottom-0'
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll progress bar */}
        <ScrollProgress />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            locale={locale}
            dictionary={dictionary}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}