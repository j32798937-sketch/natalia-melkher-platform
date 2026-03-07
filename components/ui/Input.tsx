'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string
  /** Error message */
  error?: string
  /** Helper text */
  helper?: string
  /** Icon at the start */
  icon?: React.ReactNode
  /** Full width (default: true) */
  fullWidth?: boolean
}

/**
 * Input Component
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="Search" icon={<SearchIcon />} error="Required" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      helper,
      icon,
      fullWidth = true,
      className,
      id,
      ...rest
    },
    ref
  ) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || undefined

    return (
      <div className={cn(fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-body mb-1.5',
              'text-[var(--color-text-secondary)]'
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'text-[var(--color-text-tertiary)]',
                'pointer-events-none'
              )}
            >
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5',
              'bg-[var(--color-input-bg)]',
              'border rounded-elegant',
              'text-sm text-[var(--color-text-primary)]',
              'placeholder:text-[var(--color-text-tertiary)]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-input-focus)] focus:ring-opacity-30',
              'focus:border-[var(--color-input-focus)]',
              error
                ? 'border-[var(--color-error)]'
                : 'border-[var(--color-input-border)]',
              icon && 'pl-10',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
            }
            {...rest}
          />
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-xs text-[var(--color-error)]"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helper && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-xs text-[var(--color-text-tertiary)]"
          >
            {helper}
          </p>
        )}
      </div>
    )
  }
)