'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { contactSchema, formatZodErrors } from '@/lib/utils/validation'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface ContactPageClientProps {
  locale: Locale
  dictionary: Dictionary
}

export function ContactPageClient({ locale, dictionary }: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate
    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      setErrors(formatZodErrors(result.error))
      return
    }

    setStatus('sending')

    // Simulate sending (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus('sent')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-12 pb-8 md:pt-20 md:pb-14">
        <div className="container-content">
          <FadeIn direction="up" delay={0.1}>
            <span className="text-caption text-[var(--color-accent)] mb-3 block">
              △ {dictionary.contact.title}
            </span>
          </FadeIn>

          <TextReveal
            as="h1"
            by="word"
            stagger={0.08}
            delay={0.2}
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] mb-4"
          >
            {dictionary.contact.title}
          </TextReveal>

          <FadeIn direction="up" delay={0.5}>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-xl">
              {dictionary.contact.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      <Divider variant="subtle" spacing="sm" />

      {/* Form */}
      <section className="py-12 md:py-20">
        <div className="container-content max-w-2xl">
          <FadeIn direction="up" delay={0.3}>
            {status === 'sent' ? (
              <div className="text-center py-16">
                <span className="text-4xl mb-4 block">✦</span>
                <h2 className="font-heading text-2xl text-[var(--color-text-primary)] mb-3">
                  {dictionary.contact.sent}
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  {locale === 'ru'
                    ? 'Спасибо за ваше сообщение. Я отвечу вам в ближайшее время.'
                    : 'Thank you for your message. I will reply to you soon.'}
                </p>
                <Button
                  onClick={() => setStatus('idle')}
                  variant="secondary"
                  size="md"
                >
                  {locale === 'ru' ? 'Написать ещё' : 'Send another'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={dictionary.contact.name}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    placeholder={locale === 'ru' ? 'Ваше имя' : 'Your name'}
                    required
                  />
                  <Input
                    label={dictionary.contact.email}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <Input
                  label={dictionary.contact.subject}
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  error={errors.subject}
                  placeholder={locale === 'ru' ? 'Тема сообщения' : 'Message subject'}
                  required
                />

                <Textarea
                  label={dictionary.contact.message}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  error={errors.message}
                  placeholder={locale === 'ru' ? 'Ваше сообщение...' : 'Your message...'}
                  autoResize
                  minRows={6}
                  maxRows={15}
                  maxLength={5000}
                  showCount
                  required
                />

                {status === 'error' && (
                  <p className="text-sm text-[var(--color-error)]">
                    {dictionary.contact.error}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={status === 'sending'}
                  fullWidth
                >
                  {status === 'sending' ? dictionary.contact.sending : dictionary.contact.send}
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  )
}