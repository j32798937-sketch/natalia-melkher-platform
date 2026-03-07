'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { mainNavigation } from '@/lib/config/navigation'
import { getTranslation, type Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface NavigationProps {
  locale: Locale
  dictionary: Dictionary
}

/**
 * Desktop Navigation Component
 *
 * Features:
 * - Animated underline on hover
 * - Active state indication
 * - Dropdown for Library subcategories
 * - Smooth transitions
 */
export function Navigation({ locale, dictionary }: NavigationProps) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  /**
   * Check if a nav item is currently active
   */
  function isActive(href: string): boolean {
    const localizedHref = `/${locale}${href === '/' ? '' : href}`
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(localizedHref)
  }

  return (
    <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
      {mainNavigation.map((item) => {
        const label = getTranslation(dictionary, item.translationKey, item.label)
        const href = `/${locale}${item.href === '/' ? '' : item.href}`
        const active = isActive(item.href)
        const hasChildren = item.children && item.children.length > 0
        const isOpen = openDropdown === item.href

        if (hasChildren) {
          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={href}
                className={cn(
                  'relative px-3 py-2 text-sm font-body tracking-wide',
                  'transition-colors duration-200',
                  active
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                )}
              >
                {label}

                {/* Active indicator */}
                {active && (
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-[1px] bg-[var(--color-accent)]"
                    layoutId="nav-underline"
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                )}

                {/* Dropdown arrow */}
                <svg
                  className={cn(
                    'inline-block ml-1 w-3 h-3 transition-transform duration-200',
                    isOpen ? 'rotate-180' : ''
                  )}
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" />
                </svg>
              </Link>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cn(
                      'absolute top-full left-0 mt-1 py-2 min-w-[180px]',
                      'bg-[var(--color-background)] border border-[var(--color-border)]',
                      'rounded-lg shadow-elevated',
                      'z-50'
                    )}
                  >
                    {item.children!.map((child) => {
                      const childLabel = getTranslation(
                        dictionary,
                        child.translationKey,
                        child.label
                      )
                      const childHref = `/${locale}${child.href}`
                      const childActive = pathname.startsWith(childHref)

                      return (
                        <Link
                          key={child.href}
                          href={childHref}
                          className={cn(
                            'block px-4 py-2 text-sm',
                            'transition-colors duration-150',
                            childActive
                              ? 'text-[var(--color-accent)] bg-[var(--color-highlight)]'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-highlight)]'
                          )}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {childLabel}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }

        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              'relative px-3 py-2 text-sm font-body tracking-wide',
              'transition-colors duration-200',
              active
                ? 'text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {label}

            {active && (
              <motion.span
                className="absolute bottom-0 left-3 right-3 h-[1px] bg-[var(--color-accent)]"
                layoutId="nav-underline"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}