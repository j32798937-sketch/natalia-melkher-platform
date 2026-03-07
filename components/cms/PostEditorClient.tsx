'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { LOCALES, LOCALE_NAMES } from '@/lib/utils/constants'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { slugify } from '@/lib/utils/slugify'
import { POST_TYPES, POST_STATUS } from '@/lib/utils/constants'

/* ── Types ───────────────────────────────────────────── */

interface PostEditorCategory {
  id: number
  name: string
  slug: string
  icon: string
}

interface PostData {
  id?: number
  title: string
  slug: string
  content: string
  excerpt: string
  type: string
  status: string
  categoryId: string
  coverImage: string
  featured: boolean
  metaTitle: string
  metaDescription: string
}

interface PostEditorClientProps {
  mode: 'create' | 'edit'
  categories: PostEditorCategory[]
  initialData?: Partial<PostData>
}

/* ── Component ───────────────────────────────────────── */

export function PostEditorClient({
  mode,
  categories,
  initialData,
}: PostEditorClientProps) {
  const router = useRouter()

  const [data, setData] = useState<PostData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    type: initialData?.type || POST_TYPES.POETRY,
    status: initialData?.status || POST_STATUS.DRAFT,
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
    featured: initialData?.featured || false,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  })

  const [activeTab, setActiveTab] = useState('content')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug)
  const [aiLoading, setAiLoading] = useState<'assistant' | 'translate' | null>(null)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [aiTranslateOpen, setAiTranslateOpen] = useState(false)

  /* ── Handlers ──────────────────────────────────────── */

  const updateField = useCallback(
    <K extends keyof PostData>(field: K, value: PostData[K]) => {
      setData((prev) => {
        const next = { ...prev, [field]: value }

        // Auto-generate slug from title
        if (field === 'title' && autoSlug) {
          next.slug = slugify(value as string)
        }

        return next
      })
    },
    [autoSlug]
  )

  const handleSave = async (publishStatus?: string) => {
    setError('')

    if (!data.title.trim()) {
      setError('Заголовок обязателен')
      return
    }
    if (!data.content.trim()) {
      setError('Содержание обязательно')
      return
    }

    setSaving(true)

    const payload = {
      title: data.title.trim(),
      slug: data.slug || slugify(data.title),
      content: data.content,
      excerpt: data.excerpt || undefined,
      type: data.type,
      status: publishStatus || data.status,
      categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
      coverImage: data.coverImage || undefined,
      featured: data.featured,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
    }

    try {
      const url = mode === 'edit' ? `/api/posts/${initialData?.id}` : '/api/posts'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Ошибка сохранения')
        return
      }

      router.push('/cms/posts')
      router.refresh()
    } catch {
      setError('Ошибка подключения к серверу')
    } finally {
      setSaving(false)
    }
  }

  const handleAiAssistant = async (
    action: 'improve' | 'continue' | 'rephrase' | 'summarize' | 'expand',
    style: 'poetic' | 'prose' | 'essay' | 'neutral'
  ) => {
    const text = data.content.trim()
    if (!text) {
      setError('Добавьте текст для обработки')
      return
    }
    setError('')
    setAiLoading('assistant')
    setAiAssistantOpen(false)
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action, style, postType: data.type }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка AI')
      if (json.result) updateField('content', json.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка AI‑помощника')
    } finally {
      setAiLoading(null)
    }
  }

  const handleAiTranslate = async (
    sourceLang: string,
    targetLang: string
  ) => {
    const text = data.content.trim()
    if (!text) {
      setError('Добавьте текст для перевода')
      return
    }
    setError('')
    setAiLoading('translate')
    setAiTranslateOpen(false)
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
          preserveFormatting: true,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка перевода')
      if (json.result) updateField('content', json.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка перевода')
    } finally {
      setAiLoading(null)
    }
  }

  /* ── Type & Category Options ───────────────────────── */

  const typeOptions = [
    { value: POST_TYPES.POETRY, label: 'Поэзия', icon: '✦' },
    { value: POST_TYPES.PROSE, label: 'Проза', icon: '◈' },
    { value: POST_TYPES.ESSAY, label: 'Эссе', icon: '◇' },
    { value: POST_TYPES.REFLECTION, label: 'Размышления', icon: '○' },
    { value: POST_TYPES.DIARY, label: 'Дневник', icon: '△' },
  ]

  const categoryOptions = [
    { value: '', label: 'Без категории' },
    ...categories.map((c) => ({
      value: String(c.id),
      label: c.name,
      icon: c.icon,
    })),
  ]

  const editorTabs = [
    { id: 'content', label: 'Содержание', icon: '✎' },
    { id: 'settings', label: 'Настройки', icon: '⚙' },
    { id: 'seo', label: 'SEO', icon: '◎' },
  ]

  /* ── Render ────────────────────────────────────────── */

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/cms/posts')}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            }
          >
            Назад
          </Button>

          <h1 className="font-heading text-xl md:text-2xl text-[var(--color-text-primary)]">
            {mode === 'edit' ? 'Редактировать' : 'Новая публикация'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Save as draft */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave(POST_STATUS.DRAFT)}
            loading={saving}
          >
            Сохранить черновик
          </Button>

          {/* Publish */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave(POST_STATUS.PUBLISHED)}
            loading={saving}
          >
            Опубликовать
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <input
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Заголовок публикации..."
          className={cn(
            'w-full bg-transparent border-none outline-none',
            'font-heading text-2xl md:text-3xl',
            'text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-tertiary)]/50'
          )}
          autoFocus
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={editorTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* ── Content Tab ────────────────────────── */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Type selector */}
            <div className="flex gap-2 flex-wrap">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField('type', opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-body',
                    'transition-all duration-200',
                    data.type === opt.value
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-highlight)]'
                  )}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>

            {/* AI actions */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setAiTranslateOpen(false)
                    setAiAssistantOpen((v) => !v)
                  }}
                  loading={aiLoading === 'assistant'}
                  disabled={!!aiLoading}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                    </svg>
                  }
                >
                  AI‑помощник
                </Button>
                {aiAssistantOpen && (
                  <div
                    className={cn(
                      'absolute left-0 top-full mt-1 z-20 min-w-[200px] p-2 rounded-lg',
                      'bg-[var(--color-surface)] border border-[var(--color-border)]',
                      'shadow-lg'
                    )}
                  >
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wider">Действие</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(['improve', 'continue', 'rephrase', 'summarize', 'expand'] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => handleAiAssistant(a, 'neutral')}
                          className="px-2 py-1 rounded text-xs bg-[var(--color-highlight)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white"
                        >
                          {a === 'improve' && 'Улучшить'}
                          {a === 'continue' && 'Продолжить'}
                          {a === 'rephrase' && 'Перефразировать'}
                          {a === 'summarize' && 'Сократить'}
                          {a === 'expand' && 'Расширить'}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-1 uppercase tracking-wider">Стиль</p>
                    <div className="flex flex-wrap gap-1">
                      {(['poetic', 'prose', 'essay', 'neutral'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleAiAssistant('improve', s)}
                          className="px-2 py-1 rounded text-xs bg-[var(--color-highlight)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white"
                        >
                          {s === 'poetic' && 'Поэтичный'}
                          {s === 'prose' && 'Проза'}
                          {s === 'essay' && 'Эссе'}
                          {s === 'neutral' && 'Нейтральный'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setAiAssistantOpen(false)
                    setAiTranslateOpen((v) => !v)
                  }}
                  loading={aiLoading === 'translate'}
                  disabled={!!aiLoading}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 8l6 6 6-6M5 16l6-6 6 6" />
                    </svg>
                  }
                >
                  Перевести
                </Button>
                {aiTranslateOpen && (
                  <div
                    className={cn(
                      'absolute left-0 top-full mt-1 z-20 min-w-[180px] p-2 rounded-lg',
                      'bg-[var(--color-surface)] border border-[var(--color-border)]',
                      'shadow-lg'
                    )}
                  >
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-1 uppercase tracking-wider">Язык перевода</p>
                    <div className="flex flex-wrap gap-1">
                      {LOCALES.filter((l) => l !== 'ru').map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleAiTranslate('ru', lang)}
                          className="px-2 py-1 rounded text-xs bg-[var(--color-highlight)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white"
                        >
                          {LOCALE_NAMES[lang]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content editor */}
            <Textarea
              value={data.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder={
                data.type === POST_TYPES.POETRY
                  ? 'Напишите стихотворение...\n\nКаждая строка — отдельный <p> тег.\nПустая строка — разделитель строф.'
                  : 'Начните писать...\n\nИспользуйте HTML теги для форматирования:\n<p> — абзац\n<em> — курсив\n<strong> — жирный'
              }
              autoResize
              minRows={15}
              maxRows={50}
              className="font-literary text-base leading-relaxed"
            />

            {/* Excerpt */}
            <Textarea
              label="Краткое описание (excerpt)"
              value={data.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              placeholder="Краткое описание публикации для карточек и SEO..."
              autoResize
              minRows={3}
              maxRows={6}
              maxLength={500}
              showCount
            />
          </div>
        )}

        {/* ── Settings Tab ───────────────────────── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <Select
                label="Категория"
                options={categoryOptions}
                value={data.categoryId}
                onChange={(val) => updateField('categoryId', val)}
              />

              {/* Status */}
              <Select
                label="Статус"
                options={[
                  { value: POST_STATUS.DRAFT, label: 'Черновик' },
                  { value: POST_STATUS.PUBLISHED, label: 'Опубликовано' },
                  { value: POST_STATUS.ARCHIVED, label: 'Архив' },
                ]}
                value={data.status}
                onChange={(val) => updateField('status', val)}
              />
            </div>

            {/* Slug */}
            <div>
              <Input
                label="URL (slug)"
                value={data.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  updateField('slug', e.target.value)
                }}
                placeholder="url-publikatsii"
                helper={`Полный URL: /library/.../${data.slug || 'url-publikatsii'}`}
              />
            </div>

            {/* Cover Image */}
            <Input
              label="URL обложки"
              value={data.coverImage}
              onChange={(e) => updateField('coverImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              helper="Прямая ссылка на изображение (необязательно)"
            />

            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className={cn(
                  'w-4 h-4 rounded',
                  'border-[var(--color-border)]',
                  'text-[var(--color-accent)]',
                  'focus:ring-[var(--color-accent)]'
                )}
              />
              <span className="text-sm text-[var(--color-text-primary)]">
                Избранная публикация
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                (отображается на главной)
              </span>
            </label>
          </div>
        )}

        {/* ── SEO Tab ────────────────────────────── */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <Input
              label="SEO заголовок"
              value={data.metaTitle}
              onChange={(e) => updateField('metaTitle', e.target.value)}
              placeholder={data.title || 'Заголовок для поисковых систем'}
              helper={`${(data.metaTitle || data.title).length}/60 символов`}
            />

            <Textarea
              label="SEO описание"
              value={data.metaDescription}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              placeholder={data.excerpt || 'Описание для поисковых систем...'}
              autoResize
              minRows={3}
              maxRows={5}
              maxLength={160}
              showCount
            />

            {/* Preview */}
            <div className={cn(
              'p-4 rounded-lg',
              'bg-[var(--color-surface)]',
              'border border-[var(--color-border)]'
            )}>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wider">
                Предпросмотр в поиске
              </p>
              <p className="text-[#1a0dab] text-base leading-snug mb-1 truncate">
                {data.metaTitle || data.title || 'Заголовок публикации'} — Наталья Мельхер
              </p>
              <p className="text-[#006621] text-xs mb-1 truncate">
                natalia-melkher.com/library/.../{data.slug || 'url'}
              </p>
              <p className="text-[#545454] text-xs leading-relaxed line-clamp-2">
                {data.metaDescription || data.excerpt || 'Описание публикации будет отображаться здесь...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}