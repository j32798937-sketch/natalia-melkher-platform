import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { getPublishedPosts } from '@/lib/services/PostService'
import { getCategoriesWithCounts } from '@/lib/services/CategoryService'
import type { CategoryWithCount } from '@/lib/services/CategoryService'
import { generateTitle, generateCanonicalUrl } from '@/lib/config/seo'
import { LibraryPageClient } from '@/components/library/LibraryPageClient'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils/constants'

/* ── Props ───────────────────────────────────────────── */

interface LibraryPageProps {
  params: Promise<{ locale: string }>
}

/* ── Metadata ────────────────────────────────────────── */

export async function generateMetadata({ params }: LibraryPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const dict = await getDictionary(locale as Locale)

  return {
    title: dict.library.title,
    description: dict.library.subtitle,
    alternates: {
      canonical: generateCanonicalUrl('/library', locale as Locale),
    },
  }
}

/* ── Page ────────────────────────────────────────────── */

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale as Locale)

  // Fetch data
  let categories: CategoryWithCount[] = []
  let initialPosts: Awaited<ReturnType<typeof getPublishedPosts>> = { data: [], total: 0, page: 1, limit: 12, totalPages: 0 }

  try {
    categories = await getCategoriesWithCounts()
    initialPosts = await getPublishedPosts({}, { page: 1, limit: 12, sortBy: 'newest' })
  } catch (error) {
    console.error('[Melkher] Error fetching library data:', error)
  }

  return (
    <LibraryPageClient
      locale={locale as Locale}
      dictionary={dictionary}
      categories={categories}
      initialPosts={initialPosts.data}
      totalPosts={initialPosts.total}
    />
  )
}