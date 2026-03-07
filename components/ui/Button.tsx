'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Show loading spinner */
  loading?: boolean
  /** Full width */
  fullWidth?: boolean
  /** Icon before text */
  icon?: React.ReactNode
  /** Icon after text */
  iconRight?: React.ReactNode
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never
  }

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

/**
 * Button Component
 *
 * Supports rendering as <button> or <a> (via Next.js Link).
 * Multiple variants and sizes with consistent styling.
 *
 * @example
 * <Button variant="primary" size="lg">Click me</Button>
 * <Button href="/about" variant="secondary">Learn more</Button>
 * <Button loading>Saving...</Button>
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    iconRight,
    children,
    className,
    ...rest
  } = props

  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2',
    'font-body font-medium tracking-wide',
    'rounded-elegant',
    'transition-all duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-[var(--color-accent)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none',
    fullWidth && 'w-full'
  )

  const variantStyles: Record<ButtonVariant, string> = {
    primary: cn(
      'bg-[var(--color-button-primary-bg)]',
      'text-[var(--color-button-primary-text)]',
      'hover:bg-[var(--color-button-primary-hover)]',
      'active:scale-[0.98]',
      'shadow-subtle hover:shadow-soft'
    ),
    secondary: cn(
      'bg-[var(--color-button-secondary-bg)]',
      'text-[var(--color-button-secondary-text)]',
      'border border-[var(--color-button-secondary-border)]',
      'hover:bg-[var(--color-button-secondary-hover)]',
      'active:scale-[0.98]'
    ),
    ghost: cn(
      'bg-transparent',
      'text-[var(--color-text-secondary)]',
      'hover:text-[var(--color-text-primary)]',
      'hover:bg-[var(--color-highlight)]'
    ),
    accent: cn(
      'bg-[var(--color-accent)]',
      'text-white',
      'hover:bg-[var(--color-accent-hover)]',
      'active:scale-[0.98]',
      'shadow-subtle hover:shadow-soft'
    ),
    danger: cn(
      'bg-[var(--color-error)]',
      'text-white',
      'hover:opacity-90',
      'active:scale-[0.98]'
    ),
  }

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-5 py-2.5 h-10',
    lg: 'text-base px-7 py-3 h-12',
  }

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  )

  // Loading spinner
  const spinner = loading ? (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  ) : null

  // Render as link
  if ('href' in rest && rest.href) {
    const { href, ...linkRest } = rest as ButtonAsLink
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={combinedClassName}
        {...linkRest}
      >
        {spinner || icon}
        {children}
        {iconRight}
      </Link>
    )
  }

  // Render as button
  const buttonRest = rest as ButtonAsButton
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={combinedClassName}
      disabled={loading || buttonRest.disabled}
      {...buttonRest}
    >
      {spinner || icon}
      {children}
      {iconRight}
    </button>
  )
})