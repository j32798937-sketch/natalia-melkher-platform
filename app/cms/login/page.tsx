import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/services/AuthService'
import { LoginForm } from '@/components/cms/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход — CMS',
  robots: { index: false, follow: false },
}

export default async function CMSLoginPage() {
  // Redirect if already authenticated
  const session = await getCurrentSession()
  if (session) {
    redirect('/cms')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-2xl text-[var(--color-accent-light)] mb-4 block">✦</span>
          <h1 className="font-heading text-2xl text-[var(--color-text-primary)] mb-1">
            Наталья Мельхер
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Панель управления
          </p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-[var(--color-highlight)]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}