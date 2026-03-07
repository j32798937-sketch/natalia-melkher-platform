'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface SpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Color — defaults to accent */
  color?: 'accent' | 'primary' | 'white'
  /** Accessible label */
  label?: string
  /** Additional classes */
  className?: string
}

/**
 * Loading Spinner Component
 *
 * @example
 * <Spinner size="lg" />
 * <Spinner size="sm" color="white" />
 */
export function Spinner({
  size = 'md',
  color = 'accent',
  label = 'Loading...',
  className,
}: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-[2.5px]',
  }

  const colorClasses: Record<string, string> = {
    accent: 'border-[var(--color-accent-light)] border-t-[var(--color-accent)]',
    primary: 'border-[var(--color-border)] border-t-[var(--color-text-primary)]',
    white: 'border-white/30 border-t-white',
  }

  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      <span className="visually-hidden">{label}</span>
    </div>
  )
}

/**
 * Full-page loading state
 *
 * @example
 * <PageSpinner />
 */
export function PageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-[var(--color-text-tertiary)] font-body">
          {label}
        </p>
      </div>
    </div>
  )
}