'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { mainNavigation } from '@/lib/config/navigation'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { getTranslation, type Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface MobileMenuProps {
  locale: Locale
  dictionary: Dictionary
  onClose: () => void
}

/**
 * Mobile Menu Overlay
 *
 * Features:
 * - Full-screen overlay with glass effect
 * - Staggered animation for menu items
 * - Category submenus
 * - Search link
 * - Language switcher
 */
export function MobileMenu({ locale, dictionary, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  function isActive(href: string): boolean {
    const localizedHref = `/${locale}${href === '/' ? '' : href}`
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(localizedHref)
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const menuVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
    exit: {
      x: '100%',
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  }

  // Build flat list of menu items including children
  const menuItems: {
    label: string
    href: string
    translationKey: string
    isChild: boolean
    icon?: string
  }[] = []

  mainNavigation.forEach((item) => {
    menuItems.push({
      label: item.label,
      href: item.href,
      translationKey: item.translationKey,
      isChild: false,
      icon: item.icon,
    })
    if (item.children) {
      item.children.forEach((child) => {
        menuItems.push({
          label: child.label,
          href: child.href,
          translationKey: child.translationKey,
          isChild: true,
        })
      })
    }
  })

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-[var(--color-overlay)]"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <motion.div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50',
          'w-full max-w-sm',
          'bg-[var(--color-background)]',
          'border-l border-[var(--color-border)]',
          'flex flex-col',
          'overflow-y-auto'
        )}
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Close button area / spacer for header */}
        <div className="h-[var(--header-height)] flex-shrink-0" />

        {/* Menu items */}
        <nav className="flex-1 px-6 py-8" role="navigation" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const label = getTranslation(dictionary, item.translationKey, item.label)
              const href = `/${locale}${item.href === '/' ? '' : item.href}`
              const active = isActive(item.href)

              return (
                <motion.li
                  key={item.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      'block py-3 transition-colors duration-200',
                      item.isChild ? 'pl-8 text-sm' : 'text-lg font-heading',
                      active
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    {item.icon && !item.isChild && (
                      <span className="inline-block mr-3 text-sm opacity-50">
                        {item.icon}
                      </span>
                    )}
                    {label}
                  </Link>
                </motion.li>
              )
            })}

            {/* Search */}
            <motion.li
              custom={menuItems.length}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={`/${locale}/search`}
                onClick={onClose}
                className={cn(
                  'block py-3 text-lg font-heading',
                  'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  'transition-colors duration-200'
                )}
              >
                <span className="inline-block mr-3 text-sm opacity-50">◎</span>
                {dictionary.nav.search}
              </Link>
            </motion.li>
          </ul>
        </nav>

        {/* Bottom section: Language switcher */}
        <motion.div
          className="px-6 py-6 border-t border-[var(--color-border)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-caption mb-3">{dictionary.nav.language}</p>
          <LanguageSwitcher locale={locale} dictionary={dictionary} variant="grid" />
        </motion.div>

        {/* Footer quote */}
        <motion.div
          className="px-6 py-6 border-t border-[var(--color-border)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-literary text-sm italic text-[var(--color-text-tertiary)] leading-relaxed">
            &ldquo;{dictionary.home.quote.text}&rdquo;
          </p>
        </motion.div>
      </motion.div>
    </>
  )
}