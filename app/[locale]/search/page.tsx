import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { SearchPageClient } from '@/components/search/SearchPageClient'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils/constants'

interface SearchPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const dict = await getDictionary(locale as Locale)

  return {
    title: dict.search.title,
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dictionary = await getDictionary(locale as Locale)

  return <SearchPageClient locale={locale as Locale} dictionary={dictionary} />
}