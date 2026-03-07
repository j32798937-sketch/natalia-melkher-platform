import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { generateCanonicalUrl } from '@/lib/config/seo'
import { ContactPageClient } from '@/components/contact/ContactPageClient'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils/constants'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const dict = await getDictionary(locale as Locale)

  return {
    title: dict.contact.title,
    description: dict.contact.subtitle,
    alternates: {
      canonical: generateCanonicalUrl('/contact', locale as Locale),
    },
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dictionary = await getDictionary(locale as Locale)

  return <ContactPageClient locale={locale as Locale} dictionary={dictionary} />
}