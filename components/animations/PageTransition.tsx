'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

/**
 * Page Transition Wrapper
 *
 * Provides smooth fade transitions between pages.
 * Uses pathname as the animation key for AnimatePresence.
 *
 * @example
 * <PageTransition>
 *   <PageContent />
 * </PageTransition>
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={cn(className)}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
        exit={{
          opacity: 0,
          y: -8,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}