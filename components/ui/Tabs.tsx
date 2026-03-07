'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface Tab {
  id: string
  label: string
  icon?: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  /** Visual variant */
  variant?: 'underline' | 'pills' | 'bordered'
  /** Full width tabs */
  fullWidth?: boolean
  className?: string
}

/**
 * Tabs Component
 *
 * @example
 * <Tabs
 *   tabs={[
 *     { id: 'all', label: 'All' },
 *     { id: 'poetry', label: 'Poetry', count: 12 },
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 */
export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  fullWidth = false,
  className,
}: TabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Update indicator position
  const updateIndicator = useCallback(() => {
    const activeButton = tabRefs.current.get(activeTab)
    const container = containerRef.current

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      })
    }
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  if (variant === 'pills') {
    return (
      <div
        className={cn(
          'flex flex-wrap gap-2',
          fullWidth && 'w-full',
          className
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-body',
              'transition-all duration-200',
              fullWidth && 'flex-1',
              activeTab === tab.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-highlight)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'ml-1.5 text-xs',
                activeTab === tab.id ? 'opacity-80' : 'opacity-50'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'bordered') {
    return (
      <div
        className={cn(
          'flex border border-[var(--color-border)] rounded-lg overflow-hidden',
          fullWidth && 'w-full',
          className
        )}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-body flex-1',
              'transition-colors duration-200',
              index > 0 && 'border-l border-[var(--color-border)]',
              activeTab === tab.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-highlight)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  // Underline variant (default)
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex border-b border-[var(--color-border)]',
        fullWidth && 'w-full',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.id, el)
          }}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-3 text-sm font-body',
            'transition-colors duration-200',
            fullWidth && 'flex-1',
            activeTab === tab.id
              ? 'text-[var(--color-text-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs opacity-50">
              {tab.count}
            </span>
          )}
        </button>
      ))}

      {/* Animated underline indicator */}
      <motion.div
        className="absolute bottom-0 h-[2px] bg-[var(--color-accent)]"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  )
}