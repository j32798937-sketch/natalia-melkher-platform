'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  /** Width (CSS value or Tailwind class) */
  width?: string
  /** Height (CSS value or Tailwind class) */
  height?: string
  /** Shape */
  variant?: 'text' | 'rectangular' | 'circular'
  /** Additional classes */
  className?: string
  /** Number of skeleton lines (for text variant) */
  lines?: number
}

/**
 * Skeleton Loading Placeholder
 *
 * @example
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="rectangular" height="200px" />
 * <Skeleton variant="circular" width="48px" height="48px" />
 */
export function Skeleton({
  width,
  height,
  variant = 'text',
  className,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = cn(
    'shimmer',
    'bg-[var(--color-highlight)]',
    'rounded'
  )

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full', className)}
        style={{ width: width || '40px', height: height || '40px' }}
        aria-hidden="true"
      />
    )
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-lg', className)}
        style={{ width: width || '100%', height: height || '200px' }}
        aria-hidden="true"
      />
    )
  }

  // Text variant — multiple lines
  if (lines > 1) {
    return (
      <div className={cn('space-y-2.5', className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, 'h-4')}
            style={{
              width: i === lines - 1 ? '60%' : width || '100%',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, 'h-4', className)}
      style={{ width: width || '100%', height }}
      aria-hidden="true"
    />
  )
}

/**
 * Publication Card Skeleton
 */
export function PublicationCardSkeleton() {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        'border border-[var(--color-border)]',
        'bg-[var(--color-card-bg)]'
      )}
      aria-hidden="true"
    >
      {/* Cover image */}
      <Skeleton variant="rectangular" height="180px" />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category badge */}
        <Skeleton width="80px" height="20px" />

        {/* Title */}
        <Skeleton lines={2} />

        {/* Excerpt */}
        <div className="pt-1">
          <Skeleton lines={3} />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 pt-2">
          <Skeleton width="80px" height="14px" />
          <Skeleton width="60px" height="14px" />
        </div>
      </div>
    </div>
  )
}

/**
 * Reading Page Skeleton
 */
export function ReadingPageSkeleton() {
  return (
    <div className="container-literary py-16 space-y-8" aria-hidden="true">
      {/* Back link */}
      <Skeleton width="120px" height="16px" />

      {/* Category */}
      <Skeleton width="80px" height="24px" />

      {/* Title */}
      <Skeleton width="90%" height="40px" />

      {/* Meta */}
      <div className="flex gap-4">
        <Skeleton width="120px" height="16px" />
        <Skeleton width="80px" height="16px" />
      </div>

      {/* Divider */}
      <Skeleton width="100px" height="1px" className="mx-auto" />

      {/* Content */}
      <div className="space-y-6">
        <Skeleton lines={4} />
        <Skeleton lines={4} />
        <Skeleton lines={3} />
        <Skeleton lines={4} />
      </div>
    </div>
  )
}