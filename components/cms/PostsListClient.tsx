'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatDateCompact } from '@/lib/utils/formatDate'
import { CATEGORY_ICONS } from '@/lib/utils/constants'
import type { PostWithCategory } from '@/lib/services/PostService'

interface PostsListClientProps {
  initialPosts: PostWithCategory[]
  totalPosts: number
  categories: { id: number; name: string; slug: string }[]
}

export function PostsListClient({
  initialPosts,
  totalPosts,
  categories,
}: PostsListClientProps) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PostWithCategory | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      const response = await fetch(`/api/posts/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        setDeleteTarget(null)
        router.refresh()
      }
    } catch (error) {
      console.error('[Melkher] Delete error:', error)
    } finally {
      setDeleting(false)
    }
  }

  const filteredPosts = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()))
      )
    : posts

  const statusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" size="sm" dot>Опубликовано</Badge>
      case 'draft':
        return <Badge variant="warning" size="sm" dot>Черновик</Badge>
      case 'archived':
        return <Badge variant="default" size="sm" dot>Архив</Badge>
      default:
        return <Badge variant="default" size="sm">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)]">
            Публикации
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            {totalPosts} публикаций
          </p>
        </div>

        <Button href="/cms/posts/new" variant="primary" size="md">
          + Новая публикация
        </Button>
      </div>

      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по заголовку..."
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
      />

      {/* Posts table */}
      <div
        className={cn(
          'rounded-lg overflow-hidden',
          'border border-[var(--color-border)]',
          'bg-[var(--color-surface)]'
        )}
      >
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[var(--color-border)] text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider">
          <div className="col-span-5">Заголовок</div>
          <div className="col-span-2">Категория</div>
          <div className="col-span-2">Статус</div>
          <div className="col-span-2">Дата</div>
          <div className="col-span-1"></div>
        </div>

        {/* Posts list */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-tertiary)]">
            Публикации не найдены
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={cn(
                  'grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4',
                  'px-5 py-4',
                  'hover:bg-[var(--color-highlight)]',
                  'transition-colors duration-150'
                )}
              >
                {/* Title */}
                <div className="md:col-span-5">
                  <Link
                    href={`/cms/posts/${post.id}/edit`}
                    className={cn(
                      'text-sm font-body font-medium',
                      'text-[var(--color-text-primary)]',
                      'hover:text-[var(--color-accent)]',
                      'transition-colors duration-150',
                      'line-clamp-1 no-underline'
                    )}
                  >
                    {post.featured === 1 && (
                      <span className="text-[var(--color-accent)] mr-1.5">✦</span>
                    )}
                    {post.title}
                  </Link>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 line-clamp-1 md:hidden">
                    {post.category_name || 'Без категории'} · {formatDateCompact(post.created_at)}
                  </p>
                </div>

                {/* Category */}
                <div className="hidden md:flex md:col-span-2 items-center">
                  {post.category_name ? (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {CATEGORY_ICONS[post.category_slug || ''] || '✦'}{' '}
                      {post.category_name}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-tertiary)]">—</span>
                  )}
                </div>

                {/* Status */}
                <div className="hidden md:flex md:col-span-2 items-center">
                  {statusBadge(post.status)}
                </div>

                {/* Date */}
                <div className="hidden md:flex md:col-span-2 items-center text-xs text-[var(--color-text-tertiary)]">
                  {formatDateCompact(post.created_at)}
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center justify-end gap-1">
                  <Link
                    href={`/cms/posts/${post.id}/edit`}
                    className={cn(
                      'p-1.5 rounded-md',
                      'text-[var(--color-text-tertiary)]',
                      'hover:text-[var(--color-accent)]',
                      'hover:bg-[var(--color-accent)]/10',
                      'transition-colors duration-150'
                    )}
                    aria-label="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>

                  <button
                    onClick={() => setDeleteTarget(post)}
                    className={cn(
                      'p-1.5 rounded-md',
                      'text-[var(--color-text-tertiary)]',
                      'hover:text-[var(--color-error)]',
                      'hover:bg-[var(--color-error)]/10',
                      'transition-colors duration-150'
                    )}
                    aria-label="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Удалить публикацию?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Отменить
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>
              Удалить
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Вы уверены, что хотите удалить публикацию{' '}
          <strong className="text-[var(--color-text-primary)]">
            &laquo;{deleteTarget?.title}&raquo;
          </strong>
          ? Это действие необратимо.
        </p>
      </Modal>
    </div>
  )
}