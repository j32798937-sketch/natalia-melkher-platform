import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { getPublishedPosts } from '@/lib/services/PostService'
import { getCategoriesWithCounts, getCategoryBySlug, getAllCategorySlugs } from '@/lib/services/CategoryService'
import type { CategoryWithCount } from '@/lib/services/CategoryService'
import { generateCanonicalUrl } from '@/lib/config/seo'
import { LibraryPageClient } from '@/components/library/LibraryPageClient'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils/constants'

/* ── Props ───────────────────────────────────────────── */

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>
}

/* ── Static Params ───────────────────────────────────── */

export async function generateStaticParams() {
  const locales = ['ru', 'en', 'de', 'fr', 'cn', 'kr']
  const categorySlugs = ['poetry', 'prose', 'essays', 'reflections', 'diary']

  const params = []
  for (const locale of locales) {
    for (const category of categorySlugs) {
      params.push({ locale, category })
    }
  }
  return params
}

/* ── Metadata ────────────────────────────────────────── */

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params
  if (!isValidLocale(locale)) return {}

  const cat = await getCategoryBySlug(category)
  if (!cat) return {}

  return {
    title: cat.name,
    description: cat.description || cat.name,
    alternates: {
      canonical: generateCanonicalUrl(`/library/${category}`, locale as Locale),
    },
  }
}

/* ── Page ────────────────────────────────────────────── */

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params

  if (!isValidLocale(locale)) notFound()

  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()

  const dictionary = await getDictionary(locale as Locale)

  let categories: CategoryWithCount[] = []
  let initialPosts: Awaited<ReturnType<typeof getPublishedPosts>> = { data: [], total: 0, page: 1, limit: 12, totalPages: 0 }

  try {
    categories = await getCategoriesWithCounts()
    initialPosts = await getPublishedPosts(
      { categorySlug: category },
      { page: 1, limit: 12, sortBy: 'newest' }
    )
  } catch (error) {
    console.error('[Melkher] Error fetching category data:', error)
  }

  return (
    <LibraryPageClient
      locale={locale as Locale}
      dictionary={dictionary}
      categories={categories}
      initialPosts={initialPosts.data}
      totalPosts={initialPosts.total}
      activeCategory={category}
    />
  )
}