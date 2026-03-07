'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  /** Tooltip content */
  content: string
  /** Trigger element */
  children: React.ReactNode
  /** Position */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Delay before showing (ms) */
  delay?: number
  /** Additional classes for the tooltip */
  className?: string
}

/**
 * Tooltip Component
 *
 * @example
 * <Tooltip content="Share this post" position="top">
 *   <button>Share</button>
 * </Tooltip>
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }, [delay])

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }, [])

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const initialPosition: Record<string, { x?: number; y?: number }> = {
    top: { y: 4 },
    bottom: { y: -4 },
    left: { x: 4 },
    right: { x: -4 },
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, ...initialPosition[position] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...initialPosition[position] }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-[150] pointer-events-none',
              positionClasses[position]
            )}
            role="tooltip"
          >
            <div
              className={cn(
                'px-2.5 py-1.5 rounded-md',
                'text-xs font-body whitespace-nowrap',
                'bg-[var(--color-text-primary)]',
                'text-[var(--color-background)]',
                'shadow-elevated',
                className
              )}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}