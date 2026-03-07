'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { cmsNavigation } from '@/lib/config/navigation'
import type { User } from '@/lib/services/AuthService'

interface CMSSidebarProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

/**
 * CMS Sidebar Navigation
 */
export function CMSSidebar({ user, isOpen, onClose }: CMSSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/cms/login')
      router.refresh()
    } catch {
      // Force redirect on error
      window.location.href = '/cms/login'
    }
  }

  const isActive = (href: string) => {
    if (href === '/cms') return pathname === '/cms'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40',
        'w-[var(--sidebar-width)] flex flex-col',
        'bg-[var(--color-surface)]',
        'border-r border-[var(--color-border)]',
        'transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      {/* Header */}
      <div className="h-16 px-5 flex items-center border-b border-[var(--color-border)]">
        <Link href="/cms" className="flex items-center gap-2.5 no-underline" onClick={onClose}>
          <span className="text-[var(--color-accent)] text-sm">✦</span>
          <span className="font-heading text-base text-[var(--color-text-primary)] tracking-tight">
            Melkher CMS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {cmsNavigation.map((item) => {
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'text-sm font-body',
                    'transition-all duration-150',
                    active
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-highlight)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  <span className="text-xs w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}

          {/* New post shortcut */}
          <li className="pt-2">
            <Link
              href="/cms/posts/new"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                'text-sm font-body',
                'bg-[var(--color-accent)] text-white',
                'hover:bg-[var(--color-accent-hover)]',
                'transition-colors duration-150'
              )}
            >
              <span className="text-xs w-5 text-center flex-shrink-0">+</span>
              <span>Новая публикация</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* View site link */}
      <div className="px-3 pb-2">
        <a
          href="/ru"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'text-xs font-body',
            'text-[var(--color-text-tertiary)]',
            'hover:bg-[var(--color-highlight)] hover:text-[var(--color-text-secondary)]',
            'transition-colors duration-150'
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>Открыть сайт</span>
        </a>
      </div>

      {/* User section */}
      <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Avatar */}
          <div
            className={cn(
              'w-8 h-8 rounded-full flex-shrink-0',
              'bg-[var(--color-accent)]/10',
              'flex items-center justify-center',
              'text-xs font-bold text-[var(--color-accent)]'
            )}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-text-primary)] truncate">
              {user.username}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] truncate">
              {user.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'text-sm font-body',
            'text-[var(--color-text-tertiary)]',
            'hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]',
            'transition-colors duration-150'
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  )
}