'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface SortControlsProps {
  sortBy: 'newest' | 'oldest' | 'popular'
  onSortChange: (sort: 'newest' | 'oldest' | 'popular') => void
  dictionary: Dictionary
}

/**
 * Sort Controls for Library
 */
export function SortControls({ sortBy, onSortChange, dictionary }: SortControlsProps) {
  const options: { value: 'newest' | 'oldest' | 'popular'; label: string }[] = [
    { value: 'newest', label: dictionary.library.sortNewest },
    { value: 'oldest', label: dictionary.library.sortOldest },
    { value: 'popular', label: dictionary.library.sortPopular },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-text-tertiary)] mr-1">
        {dictionary.library.sortBy}:
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-body',
            'transition-all duration-200',
            sortBy === option.value
              ? 'bg-[var(--color-highlight)] text-[var(--color-text-primary)]'
              : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}