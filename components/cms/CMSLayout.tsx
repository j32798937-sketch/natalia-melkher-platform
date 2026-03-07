'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { CMSSidebar } from '@/components/cms/CMSSidebar'
import { useBreakpoints } from '@/lib/hooks/useMediaQuery'
import type { User } from '@/lib/services/AuthService'

interface CMSLayoutProps {
  children: React.ReactNode
  user: User
}

/**
 * CMS Layout Shell
 *
 * Provides sidebar navigation and main content area
 * for the author's content management system.
 */
export function CMSLayout({ children, user }: CMSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isMobile } = useBreakpoints()

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Sidebar */}
      <CMSSidebar
        user={user}
        isOpen={!isMobile || sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-[var(--color-overlay)]"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          'flex-1 min-h-screen',
          'transition-all duration-300',
          !isMobile ? 'ml-[var(--sidebar-width)]' : ''
        )}
      >
        {/* Top bar (mobile) */}
        {isMobile && (
          <div
            className={cn(
              'sticky top-0 z-20 h-14 px-4',
              'flex items-center justify-between',
              'bg-[var(--color-background)]',
              'border-b border-[var(--color-border)]'
            )}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg',
                'text-[var(--color-text-secondary)]',
                'hover:bg-[var(--color-highlight)]',
                'transition-colors duration-150'
              )}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <span className="font-heading text-lg text-[var(--color-text-primary)]">
              CMS
            </span>

            <div className="w-10" />
          </div>
        )}

        {/* Page content */}
        <div className="p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}