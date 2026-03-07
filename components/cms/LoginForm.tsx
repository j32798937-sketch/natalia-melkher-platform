'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

/**
 * CMS Login Form
 */
export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/cms'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Введите имя пользователя и пароль')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setError('Слишком много попыток. Подождите 15 минут.')
        } else {
          setError(data.error || 'Неверное имя пользователя или пароль')
        }
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'p-6 rounded-lg',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border)]',
        'shadow-soft'
      )}
      noValidate
    >
      <div className="space-y-4">
        <Input
          label="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="natalia"
          autoComplete="username"
          autoFocus
        />

        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-[var(--color-error)] text-center">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        className="mt-6"
      >
        {loading ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  )
}