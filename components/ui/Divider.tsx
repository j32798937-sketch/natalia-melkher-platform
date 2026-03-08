'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface DividerProps {
  /** Decorative symbol in the center */
  symbol?: string
  /** Variant */
  variant?: 'default' | 'subtle' | 'literary' | 'ornamental' | 'gradient'
  /** Spacing */
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Decorative Divider Component
 *
 * Used to separate sections with an elegant, literary feel.
 *
 * @example
 * <Divider />
 * <Divider symbol="◈" variant="literary" />
 * <Divider variant="ornamental" />
 */
export function Divider({
  symbol,
  variant = 'default',
  spacing = 'md',
  className,
}: DividerProps) {
  const spacingClasses: Record<string, string> = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
  }

  if (variant === 'gradient') {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-3 py-4',
          spacingClasses[spacing],
          className
        )}
        role="separator"
        aria-hidden="true"
      >
        <div className="h-px flex-1 max-w-[8rem] md:max-w-[12rem] bg-gradient-to-r from-transparent to-[var(--color-accent-light)]/60" />
        <span className="text-[var(--color-accent-light)]/90 text-xl">
          {symbol || '✦'}
        </span>
        <div className="h-px flex-1 max-w-[8rem] md:max-w-[12rem] bg-gradient-to-l from-transparent to-[var(--color-accent-light)]/60" />
      </div>
    )
  }

  if (variant === 'ornamental') {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          spacingClasses[spacing],
          className
        )}
        role="separator"
        aria-hidden="true"
      >
        <span className="text-[var(--color-accent-light)] text-sm tracking-[0.5em] opacity-60">
          ✦ ✦ ✦
        </span>
      </div>
    )
  }

  if (variant === 'literary') {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-4',
          spacingClasses[spacing],
          className
        )}
        role="separator"
        aria-hidden="true"
      >
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[var(--color-border)]" />
        <span className="text-[var(--color-accent-light)] text-xs">
          {symbol || '✦'}
        </span>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[var(--color-border)]" />
      </div>
    )
  }

  if (variant === 'subtle') {
    return (
      <div
        className={cn(
          'h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent',
          spacingClasses[spacing],
          className
        )}
        role="separator"
        aria-hidden="true"
      />
    )
  }

  // Default
  return (
    <div
      className={cn(
        'divider',
        spacingClasses[spacing],
        className
      )}
      role="separator"
      aria-hidden="true"
    >
      {symbol || '✦'}
    </div>
  )
}