'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/lib/utils/helpers'

interface DashboardClientProps {
  stats: {
    total: number
    published: number
    drafts: number
    totalViews: number
  }
  categories: {
    name: string
    post_count: number
    icon: string
  }[]
}

export function DashboardClient({ stats, categories }: DashboardClientProps) {
  const statCards = [
    {
      label: 'Всего публикаций',
      value: stats.total,
      icon: '◈',
      color: 'text-[var(--color-accent)]',
      href: '/cms/posts',
    },
    {
      label: 'Опубликовано',
      value: stats.published,
      icon: '✓',
      color: 'text-[var(--color-success)]',
      href: '/cms/posts?status=published',
    },
    {
      label: 'Черновики',
      value: stats.drafts,
      icon: '✎',
      color: 'text-[var(--color-warning)]',
      href: '/cms/posts?status=draft',
    },
    {
      label: 'Просмотры',
      value: stats.totalViews,
      icon: '◎',
      color: 'text-[var(--color-info)]',
      href: '/cms/analytics',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)]">
            Панель управления
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Добро пожаловать в систему управления контентом
          </p>
        </div>

        <Button href="/cms/posts/new" variant="primary" size="md">
          + Новая публикация
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={cn(
              'block p-5 rounded-lg no-underline',
              'bg-[var(--color-surface)]',
              'border border-[var(--color-border)]',
              'hover:border-[var(--color-accent-light)]/30',
              'hover:shadow-soft',
              'transition-all duration-200'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={cn('text-lg', card.color)}>{card.icon}</span>
            </div>
            <p className="text-2xl font-heading text-[var(--color-text-primary)] mb-1">
              {formatNumber(card.value)}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Categories overview */}
      <div
        className={cn(
          'p-6 rounded-lg',
          'bg-[var(--color-surface)]',
          'border border-[var(--color-border)]'
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg text-[var(--color-text-primary)]">
            Категории
          </h2>
          <Link
            href="/cms/categories"
            className="text-xs text-[var(--color-accent)] hover:underline"
          >
            Управление
          </Link>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-accent-light)]">
                  {category.icon}
                </span>
                <span className="text-sm text-[var(--color-text-primary)]">
                  {category.name}
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-highlight)] px-2 py-0.5 rounded-full">
                {category.post_count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/cms/posts/new"
          className={cn(
            'p-5 rounded-lg no-underline text-center',
            'border border-dashed border-[var(--color-border)]',
            'hover:border-[var(--color-accent)]',
            'hover:bg-[var(--color-accent)]/5',
            'transition-all duration-200 group'
          )}
        >
          <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">✦</span>
          <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]">
            Написать стихотворение
          </span>
        </Link>

        <Link
          href="/cms/posts/new"
          className={cn(
            'p-5 rounded-lg no-underline text-center',
            'border border-dashed border-[var(--color-border)]',
            'hover:border-[var(--color-accent)]',
            'hover:bg-[var(--color-accent)]/5',
            'transition-all duration-200 group'
          )}
        >
          <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">◈</span>
          <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]">
            Написать прозу
          </span>
        </Link>

        <Link
          href="/cms/posts/new"
          className={cn(
            'p-5 rounded-lg no-underline text-center',
            'border border-dashed border-[var(--color-border)]',
            'hover:border-[var(--color-accent)]',
            'hover:bg-[var(--color-accent)]/5',
            'transition-all duration-200 group'
          )}
        >
          <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">◇</span>
          <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]">
            Написать эссе
          </span>
        </Link>
      </div>
    </div>
  )
}