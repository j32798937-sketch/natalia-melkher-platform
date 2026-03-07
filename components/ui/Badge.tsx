'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  /** Decorative dot before text */
  dot?: boolean
  /** Clickable badge */
  onClick?: () => void
  /** Remove button callback */
  onRemove?: () => void
  className?: string
}

/**
 * Badge Component
 *
 * Used for tags, categories, status indicators.
 *
 * @example
 * <Badge variant="accent">Poetry</Badge>
 * <Badge variant="success" dot>Published</Badge>
 * <Badge onRemove={() => removeTag(id)}>тишина</Badge>
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  onClick,
  onRemove,
  className,
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-[var(--color-highlight)] text-[var(--color-text-secondary)]',
    accent: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
    outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)]',
  }

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-[0.65rem] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  const isClickable = !!onClick

  const Component = isClickable ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-full font-body tracking-wide',
        'transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        isClickable && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            variant === 'success' && 'bg-[var(--color-success)]',
            variant === 'warning' && 'bg-[var(--color-warning)]',
            variant === 'error' && 'bg-[var(--color-error)]',
            variant === 'accent' && 'bg-[var(--color-accent)]',
            variant === 'default' && 'bg-[var(--color-text-tertiary)]',
            variant === 'outline' && 'bg-[var(--color-text-tertiary)]'
          )}
          aria-hidden="true"
        />
      )}

      {children}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            'ml-0.5 -mr-1 p-0.5 rounded-full',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'transition-colors duration-150'
          )}
          aria-label="Remove"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </Component>
  )
}