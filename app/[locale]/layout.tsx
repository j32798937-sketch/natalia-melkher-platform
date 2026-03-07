import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, getHtmlLang } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { defaultMetaByLocale, ogLocaleMap } from '@/lib/config/seo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Locale } from '@/lib/utils/constants'

/* ── Props ───────────────────────────────────────────── */

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/* ── Generate Metadata ───────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const meta = defaultMetaByLocale[locale as Locale]
  const ogLocale = ogLocaleMap[locale as Locale]

  return {
    title: {
      default: meta.title,
      template: `%s — ${locale === 'ru' ? 'Наталья Мельхер' : 'Natalia Melkher'}`,
    },
    description: meta.description,
    openGraph: {
      locale: ogLocale,
      title: meta.title,
      description: meta.description,
    },
  }
}

/* ── Generate Static Params ──────────────────────────── */

export async function generateStaticParams() {
  return [
    { locale: 'ru' },
    { locale: 'en' },
    { locale: 'de' },
    { locale: 'fr' },
    { locale: 'cn' },
    { locale: 'kr' },
  ]
}

/* ── Layout Component ────────────────────────────────── */

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound()
  }

  // Load dictionary for this locale
  const dictionary = await getDictionary(locale as Locale)
  const htmlLang = getHtmlLang(locale as Locale)

  return (
    <>
      {/* Update html lang attribute */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = "${htmlLang}";`,
        }}
      />

      {/* Header */}
      <Header locale={locale as Locale} dictionary={dictionary} />

      {/* Main content */}
      <main className="page-content" id="main-content">
        {children}
      </main>

      {/* Footer */}
      <Footer locale={locale as Locale} dictionary={dictionary} />
    </>
  )
}