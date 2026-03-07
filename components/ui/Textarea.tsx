'use client'

import React, { forwardRef, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string
  /** Error message */
  error?: string
  /** Helper text */
  helper?: string
  /** Full width (default: true) */
  fullWidth?: boolean
  /** Auto-resize based on content */
  autoResize?: boolean
  /** Minimum height in rows */
  minRows?: number
  /** Maximum height in rows */
  maxRows?: number
  /** Character counter */
  maxLength?: number
  /** Show character count */
  showCount?: boolean
}

/**
 * Textarea Component
 *
 * Supports auto-resize and character counting.
 * Designed for literary content editing.
 *
 * @example
 * <Textarea label="Content" autoResize minRows={6} showCount maxLength={5000} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      helper,
      fullWidth = true,
      autoResize = false,
      minRows = 3,
      maxRows = 20,
      maxLength,
      showCount = false,
      className,
      id,
      value,
      onChange,
      ...rest
    },
    ref
  ) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-') || undefined
    const internalRef = useRef<HTMLTextAreaElement | null>(null)

    // Merge refs
    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
        }
      },
      [ref]
    )

    // Auto-resize logic
    const adjustHeight = useCallback(() => {
      const textarea = internalRef.current
      if (!textarea || !autoResize) return

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'

      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows

      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`

      // Enable scroll if content exceeds maxHeight
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }, [autoResize, minRows, maxRows])

    useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      if (autoResize) {
        adjustHeight()
      }
    }

    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className={cn(fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-body mb-1.5',
              'text-[var(--color-text-secondary)]'
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={setRef}
          id={textareaId}
          value={value}
          onChange={handleChange}
          rows={autoResize ? minRows : rest.rows || minRows}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-3',
            'bg-[var(--color-input-bg)]',
            'border rounded-elegant',
            'text-sm text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-tertiary)]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-input-focus)] focus:ring-opacity-30',
            'focus:border-[var(--color-input-focus)]',
            'resize-none',
            error
              ? 'border-[var(--color-error)]'
              : 'border-[var(--color-input-border)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'font-literary leading-relaxed',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helper ? `${textareaId}-helper` : undefined
          }
          {...rest}
        />

        {/* Bottom row: error/helper + character count */}
        <div className="flex items-start justify-between mt-1.5 gap-4">
          <div className="flex-1">
            {/* Error message */}
            {error && (
              <p
                id={`${textareaId}-error`}
                className="text-xs text-[var(--color-error)]"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* Helper text */}
            {helper && !error && (
              <p
                id={`${textareaId}-helper`}
                className="text-xs text-[var(--color-text-tertiary)]"
              >
                {helper}
              </p>
            )}
          </div>

          {/* Character count */}
          {showCount && maxLength && (
            <p
              className={cn(
                'text-xs flex-shrink-0',
                charCount > maxLength * 0.9
                  ? 'text-[var(--color-error)]'
                  : 'text-[var(--color-text-tertiary)]'
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)