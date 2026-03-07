import Link from 'next/link'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'

/**
 * Global 404 Not Found Page
 *
 * Shown when no route matches at the root level.
 */
export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <FadeIn direction="up" duration={0.8}>
        <div className="text-center px-6">
          {/* Large 404 */}
          <div className="relative mb-8">
            <span className="text-[8rem] md:text-[12rem] font-heading font-light text-[var(--color-accent-light)]/10 leading-none select-none">
              404
            </span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-[var(--color-accent-light)]/30">
              ◇
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] mb-4">
            Страница не найдена
          </h1>

          {/* Description */}
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-8 leading-relaxed">
            Такой страницы не существует. Возможно, она была перемещена, удалена,
            или вы ввели неверный адрес.
          </p>

          {/* Decorative quote */}
          <p className="font-literary italic text-sm text-[var(--color-text-tertiary)] max-w-sm mx-auto mb-10">
            &ldquo;Не все, кто блуждает, потеряны&rdquo;
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button href="/ru" variant="primary" size="lg">
              На главную
            </Button>
            <Button href="/ru/library" variant="secondary" size="lg">
              Библиотека
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}