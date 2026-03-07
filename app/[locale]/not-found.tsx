import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'

/**
 * 404 Not Found Page for locale routes
 */
export default function LocaleNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <FadeIn direction="up" duration={0.8}>
        <div className="text-center px-6">
          {/* Decorative */}
          <span className="text-6xl md:text-8xl font-heading text-[var(--color-accent-light)]/20 block mb-6">
            404
          </span>

          {/* Icon */}
          <span className="text-3xl mb-6 block text-[var(--color-accent-light)]/40">
            ◇
          </span>

          {/* Title */}
          <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] mb-4">
            Страница не найдена
          </h1>

          {/* Description */}
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-8">
            Такой страницы не существует. Возможно, она была перемещена или удалена.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button href="/ru" variant="primary" size="md">
              На главную
            </Button>
            <Button href="/ru/library" variant="secondary" size="md">
              Библиотека
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}