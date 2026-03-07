'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: React.ReactNode
  /** Link destination */
  href?: string
  /** Hover lift effect */
  hoverable?: boolean
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Border */
  bordered?: boolean
  /** Background style */
  variant?: 'default' | 'surface' | 'transparent'
  /** Click handler */
  onClick?: () => void
  className?: string
}

/**
 * Card Component
 *
 * Versatile card container for publications, features, etc.
 *
 * @example
 * <Card href="/post/1" hoverable>
 *   <Card.Image src="/cover.jpg" alt="Cover" />
 *   <Card.Body>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description</Card.Description>
 *   </Card.Body>
 * </Card>
 */
export function Card({
  children,
  href,
  hoverable = false,
  padding = 'none',
  bordered = true,
  variant = 'default',
  onClick,
  className,
}: CardProps) {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  }

  const variantClasses: Record<string, string> = {
    default: 'bg-[var(--color-card-bg)]',
    surface: 'bg-[var(--color-surface)]',
    transparent: 'bg-transparent',
  }

  const baseClasses = cn(
    'rounded-lg overflow-hidden',
    'transition-all duration-300',
    variantClasses[variant],
    bordered && 'border border-[var(--color-card-border)]',
    hoverable && 'hover:shadow-soft hover:border-[var(--color-accent-light)]/30',
    hoverable && 'hover:-translate-y-0.5',
    paddingClasses[padding],
    onClick && 'cursor-pointer',
    className
  )

  const content = (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    )
  }

  return content
}

/* ── Card Sub-components ─────────────────────────────── */

function CardImage({
  src,
  alt,
  aspectRatio = '16/9',
  className,
}: {
  src: string
  alt: string
  aspectRatio?: string
  className?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  )
}

function CardBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('p-5', className)}>{children}</div>
}

function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={cn(
        'font-heading text-lg md:text-xl',
        'text-[var(--color-text-primary)]',
        'leading-tight mb-2',
        className
      )}
    >
      {children}
    </h3>
  )
}

function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-sm text-[var(--color-text-secondary)]',
        'leading-relaxed line-clamp-3',
        className
      )}
    >
      {children}
    </p>
  )
}

function CardMeta({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-3',
        'text-xs text-[var(--color-text-tertiary)]',
        className
      )}
    >
      {children}
    </div>
  )
}

function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-[var(--color-border)]',
        className
      )}
    >
      {children}
    </div>
  )
}

Card.Image = CardImage
Card.Body = CardBody
Card.Title = CardTitle
Card.Description = CardDescription
Card.Meta = CardMeta
Card.Footer = CardFooter