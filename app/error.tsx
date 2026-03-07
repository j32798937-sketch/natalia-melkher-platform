'use client'

import React, { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global Error Page
 *
 * Catches unhandled errors in the application
 * and provides a recovery option.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[Melkher] Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FadeIn direction="up" duration={0.6}>
        <div className="text-center px-6 max-w-md">
          {/* Icon */}
          <span className="text-5xl mb-6 block text-[var(--color-accent-light)]/30">
            ◈
          </span>

          {/* Title */}
          <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] mb-4">
            Что-то пошло не так
          </h1>

          {/* Description */}
          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова
            или вернитесь на главную страницу.
          </p>

          {/* Error digest (dev only) */}
          {process.env.NODE_ENV === 'development' && error.digest && (
            <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-6 break-all">
              Error: {error.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button onClick={reset} variant="primary" size="md">
              Попробовать снова
            </Button>
            <Button href="/ru" variant="secondary" size="md">
              На главную
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}