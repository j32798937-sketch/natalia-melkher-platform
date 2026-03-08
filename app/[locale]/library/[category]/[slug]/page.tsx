import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts, incrementViews } from '@/lib/services/PostService'
import type { PublicationCardData } from '@/components/library/PublicationCard'
import { generateCanonicalUrl, generateArticleSchema } from '@/lib/config/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { ReadingPageClient } from '@/components/reading/ReadingPageClient'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils/constants'

/* ── Props ───────────────────────────────────────────── */

interface ReadingPageProps {
  params: Promise<{ locale: string; category: string; slug: string }>
}

/* ── Metadata ────────────────────────────────────────── */

export async function generateMetadata({ params }: ReadingPageProps): Promise<Metadata> {
  const { locale, category, slug } = await params
  if (!isValidLocale(locale)) return {}

  const post = await getPostBySlug(slug)
  if (!post) return {}

  const canonicalUrl = generateCanonicalUrl(`/library/${category}/${slug}`, locale as Locale)

  return {
    title: post.meta_title || post.title,
    description: post.meta_desc || post.excerpt || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.meta_title || post.title,
      description: post.meta_desc || post.excerpt || '',
      url: canonicalUrl,
      images: post.cover_image
        ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
        : undefined,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      section: post.category_name || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_desc || post.excerpt || '',
    },
  }
}

/* ── Page ────────────────────────────────────────────── */

export default async function ReadingPage({ params }: ReadingPageProps) {
  const { locale, category, slug } = await params

  if (!isValidLocale(locale)) notFound()

  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // Increment views
  try {
    await incrementViews(post.id)
  } catch {
    // Silent fail
  }

  const dictionary = await getDictionary(locale as Locale)

  // Related posts
  let relatedPosts: PublicationCardData[] = []
  try {
    relatedPosts = await getRelatedPosts(post.id, post.category_id, 4)
  } catch {
    // Silent fail
  }

  const canonicalUrl = generateCanonicalUrl(`/library/${category}/${slug}`, locale as Locale)

  // Article schema
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || '',
    url: canonicalUrl,
    image: post.cover_image || undefined,
    publishedTime: post.published_at || post.created_at,
    modifiedTime: post.updated_at,
    section: post.category_name || undefined,
    locale: locale as Locale,
    genre: post.category_name || undefined,
  })

  return (
    <>
      <JsonLd data={articleSchema} />

      <ReadingPageClient
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          type: post.type,
          categoryName: post.category_name,
          categorySlug: post.category_slug,
          categoryIcon: post.category_icon,
          categoryColor: post.category_color,
          coverImage: post.cover_image,
          readingTime: post.reading_time,
          views: post.views,
          publishedAt: post.published_at,
          createdAt: post.created_at,
        }}
        relatedPosts={relatedPosts}
        locale={locale as Locale}
        dictionary={dictionary}
      />
    </>
  )
}