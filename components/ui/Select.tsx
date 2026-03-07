'use client'

import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface SelectOption {
  value: string
  label: string
  icon?: string
  disabled?: boolean
}

interface SelectProps {
  /** Select options */
  options: SelectOption[]
  /** Current value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Error message */
  error?: string
  /** Full width */
  fullWidth?: boolean
  /** Disabled state */
  disabled?: boolean
  className?: string
}

/**
 * Custom Select Component
 *
 * @example
 * <Select
 *   label="Category"
 *   options={[
 *     { value: 'poetry', label: 'Poetry', icon: '✦' },
 *     { value: 'prose', label: 'Prose', icon: '◈' },
 *   ]}
 *   value={category}
 *   onChange={setCategory}
 * />
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  function Select(
    {
      options,
      value,
      onChange,
      label,
      placeholder = 'Select...',
      error,
      fullWidth = true,
      disabled = false,
      className,
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    // Close on click outside
    useEffect(() => {
      if (!isOpen) return

      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
      if (!isOpen) return

      function handleEscape(e: KeyboardEvent) {
        if (e.key === 'Escape') setIsOpen(false)
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen])

    const handleSelect = useCallback(
      (optionValue: string) => {
        onChange?.(optionValue)
        setIsOpen(false)
      },
      [onChange]
    )

    return (
      <div ref={ref} className={cn(fullWidth && 'w-full', className)}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              'block text-sm font-body mb-1.5',
              'text-[var(--color-text-secondary)]'
            )}
          >
            {label}
          </label>
        )}

        {/* Select container */}
        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full flex items-center justify-between',
              'px-4 py-2.5',
              'bg-[var(--color-input-bg)]',
              'border rounded-elegant',
              'text-sm text-left',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-input-focus)] focus:ring-opacity-30',
              'focus:border-[var(--color-input-focus)]',
              error
                ? 'border-[var(--color-error)]'
                : 'border-[var(--color-input-border)]',
              disabled && 'opacity-50 cursor-not-allowed',
              selectedOption
                ? 'text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-tertiary)]'
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="flex items-center gap-2 truncate">
              {selectedOption?.icon && (
                <span className="text-sm">{selectedOption.icon}</span>
              )}
              {selectedOption?.label || placeholder}
            </span>

            <svg
              className={cn(
                'w-4 h-4 flex-shrink-0 ml-2',
                'text-[var(--color-text-tertiary)]',
                'transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute top-full left-0 right-0 mt-1 py-1 z-50',
                  'bg-[var(--color-background)]',
                  'border border-[var(--color-border)]',
                  'rounded-lg shadow-elevated',
                  'max-h-60 overflow-y-auto',
                  'no-scrollbar'
                )}
                role="listbox"
              >
                {options.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <button
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left',
                        'transition-colors duration-150',
                        option.disabled && 'opacity-40 cursor-not-allowed',
                        option.value === value
                          ? 'text-[var(--color-accent)] bg-[var(--color-highlight)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-highlight)]'
                      )}
                    >
                      {option.icon && (
                        <span className="text-sm flex-shrink-0">{option.icon}</span>
                      )}
                      <span className="flex-1 truncate">{option.label}</span>
                      {option.value === value && (
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-[var(--color-accent)]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)