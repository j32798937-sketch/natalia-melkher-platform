import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { generateCanonicalUrl, generatePersonSchema } from '@/lib/config/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { Divider } from '@/components/ui/Divider'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils/constants'

/* ── Props ───────────────────────────────────────────── */

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

/* ── Metadata ────────────────────────────────────────── */

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const dict = await getDictionary(locale as Locale)

  return {
    title: dict.about.title,
    description: dict.about.subtitle,
    alternates: {
      canonical: generateCanonicalUrl('/about', locale as Locale),
    },
  }
}

/* ── Page ────────────────────────────────────────────── */

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dictionary = await getDictionary(locale as Locale)
  const isRu = locale === 'ru'

  return (
    <>
      <JsonLd data={generatePersonSchema()} />

      <div className="min-h-screen">
        {/* Header */}
        <section className="pt-12 pb-8 md:pt-20 md:pb-14">
          <div className="container-content">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-caption text-[var(--color-accent)] mb-3 block">
                ○ {dictionary.about.title}
              </span>
            </FadeIn>

            <TextReveal
              as="h1"
              by="word"
              stagger={0.08}
              delay={0.2}
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] mb-6"
            >
              {dictionary.about.title}
            </TextReveal>

            <FadeIn direction="up" delay={0.5}>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
                {dictionary.about.subtitle}
              </p>
            </FadeIn>
          </div>
        </section>

        <Divider variant="literary" spacing="sm" />

        {/* Content */}
        <section className="py-12 md:py-20">
          <div className="container-content">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Photo column */}
              <FadeIn direction="right" delay={0.2} className="lg:col-span-4">
                <div
                  className={cn(
                    'relative aspect-[3/4] rounded-lg overflow-hidden',
                    'bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-highlight)]',
                    'border border-[var(--color-border)]'
                  )}
                >
                  {/* Placeholder — replace with actual author photo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl text-[var(--color-accent-light)]/30 font-heading block mb-4">✦</span>
                      <span className="text-sm text-[var(--color-text-tertiary)] font-body">
                        {isRu ? 'Наталья Мельхер' : 'Natalia Melkher'}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Text column */}
              <div className="lg:col-span-8">
                <FadeIn direction="up" delay={0.3}>
                  <div className="literary-text literary-text--essay">
                    {isRu ? (
                      <>
                        <p>
                          Наталья Мельхер — писатель, поэт, автор эссе и художественной прозы. Её тексты — это пространство тишины и слова, где каждая строка стремится к точности, а каждый образ — к истине.
                        </p>
                        <p>
                          Литература для Натальи — не профессия, а способ существования. Она пишет о том, что видит, чувствует и понимает: о свете, проходящем сквозь листву, о тишине старых городов, о природе вдохновения и о хрупкости человеческой памяти.
                        </p>
                        <p>
                          Её поэзия сочетает классическую форму с современным содержанием. Проза звучит как музыка — неторопливо, внимательно, с уважением к деталям. Эссе приглашают к размышлению, не навязывая ответов.
                        </p>
                        <p>
                          Эта платформа создана как цифровое пространство для литературы, которая не спешит. Здесь тексты живут так, как они были задуманы — в тишине, в красивой типографике, в атмосфере вдохновения.
                        </p>
                        <p>
                          Добро пожаловать в мир, где слова имеют значение.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Natalia Melkher is a writer, poet, and author of essays and literary prose. Her texts are a space of silence and word, where every line strives for precision and every image strives for truth.
                        </p>
                        <p>
                          Literature for Natalia is not a profession but a way of being. She writes about what she sees, feels, and understands: about light passing through leaves, about the silence of old cities, about the nature of inspiration and the fragility of human memory.
                        </p>
                        <p>
                          Her poetry combines classical form with contemporary content. Her prose sounds like music — unhurried, attentive, with respect for detail. Her essays invite reflection without imposing answers.
                        </p>
                        <p>
                          This platform was created as a digital space for literature that does not rush. Here texts live as they were intended — in silence, in beautiful typography, in an atmosphere of inspiration.
                        </p>
                        <p>
                          Welcome to a world where words matter.
                        </p>
                      </>
                    )}
                  </div>
                </FadeIn>

                {/* CTA */}
                <FadeIn direction="up" delay={0.5}>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Button href={`/${locale}/library`} variant="primary" size="lg">
                      {dictionary.home.hero.cta}
                    </Button>
                    <Button href={`/${locale}/contact`} variant="secondary" size="lg">
                      {dictionary.contact.title}
                    </Button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}