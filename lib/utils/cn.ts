import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function for merging Tailwind CSS classes.
 * Combines clsx for conditional classes with tailwind-merge
 * to properly handle conflicting Tailwind classes.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-bronze-300', className)
 * cn('text-lg font-bold', { 'text-red-500': hasError })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}