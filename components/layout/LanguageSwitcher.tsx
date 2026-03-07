'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useLocale } from '@/lib/hooks/useLocale'
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from '@/lib/utils/constants'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface LanguageSwitcherProps {
  locale: Locale
  dictionary: Dictionary
  /** 'dropdown' for header, 'grid' for mobile menu */
  variant?: 'dropdown' | 'grid'
}

/**
 * Language Switcher Component
 *
 * Two variants:
 * - dropdown: compact dropdown for header
 * - grid: grid of language buttons for mobile menu
 */
export function LanguageSwitcher({
  locale,
  dictionary,
  variant = 'dropdown',
}: LanguageSwitcherProps) {
  const { switchLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close dropdown on Escape
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // ── Grid Variant (for mobile menu) ────────────────
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            onClick={() => {
              if (loc !== locale) {
                switchLocale(loc)
              }
            }}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2.5',
              'rounded-lg text-sm font-body',
              'transition-all duration-200',
              loc === locale
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-highlight)] hover:text-[var(--color-text-primary)]'
            )}
            aria-label={LOCALE_NAMES[loc]}
            aria-current={loc === locale ? 'true' : undefined}
          >
            <span className="text-base" aria-hidden="true">
              {LOCALE_FLAGS[loc]}
            </span>
            <span className="uppercase tracking-wider text-xs">
              {loc}
            </span>
          </button>
        ))}
      </div>
    )
  }

  // ── Dropdown Variant (for header) ─────────────────
  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5',
          'rounded-full text-sm font-body',
          'text-[var(--color-text-secondary)]',
          'hover:text-[var(--color-text-primary)]',
          'hover:bg-[var(--color-highlight)]',
          'transition-all duration-200'
        )}
        aria-label={dictionary.nav.language}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm" aria-hidden="true">
          {LOCALE_FLAGS[locale]}
        </span>
        <span className="uppercase tracking-wider text-xs">
          {locale}
        </span>
        <svg
          className={cn(
            'w-3 h-3 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'absolute top-full right-0 mt-2 py-2',
              'min-w-[160px]',
              'bg-[var(--color-background)]',
              'border border-[var(--color-border)]',
              'rounded-lg shadow-elevated',
              'z-50'
            )}
            role="listbox"
            aria-label={dictionary.nav.language}
          >
            {LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  if (loc !== locale) {
                    switchLocale(loc)
                  }
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5',
                  'text-sm text-left',
                  'transition-colors duration-150',
                  loc === locale
                    ? 'text-[var(--color-accent)] bg-[var(--color-highlight)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-highlight)]'
                )}
                role="option"
                aria-selected={loc === locale}
              >
                <span className="text-base" aria-hidden="true">
                  {LOCALE_FLAGS[loc]}
                </span>
                <span className="flex-1">{LOCALE_NAMES[loc]}</span>
                {loc === locale && (
                  <svg
                    className="w-4 h-4 text-[var(--color-accent)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}