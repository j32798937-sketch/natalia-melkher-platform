import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import { generateWebsiteSchema, generatePersonSchema } from '@/lib/config/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { HeroSection } from '@/components/home/HeroSection'
import { AuthorQuote } from '@/components/home/AuthorQuote'
import { FeaturedWorks } from '@/components/home/FeaturedWorks'
import { LatestPublications } from '@/components/home/LatestPublications'
import { InspirationalBanner } from '@/components/home/InspirationalBanner'
import { getFeaturedPosts, getLatestPosts } from '@/lib/services/PostService'
import type { PublicationCardData } from '@/components/library/PublicationCard'
import { ensureDatabaseReady } from '@/lib/database/init'
import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/utils/constants'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  // Initialize database once (singleton check inside)
  await ensureDatabaseReady()

  const dictionary = await getDictionary(locale as Locale)

  let featuredPosts: PublicationCardData[] = []
  let latestPosts: PublicationCardData[] = []

  try {
    featuredPosts = await getFeaturedPosts(3)
    latestPosts = await getLatestPosts(6)
  } catch (error) {
    console.error('[Melkher] Error fetching posts:', error)
  }

  return (
    <>
      <JsonLd data={generateWebsiteSchema()} />
      <JsonLd data={generatePersonSchema()} />

      <HeroSection locale={locale as Locale} dictionary={dictionary} />
      <AuthorQuote dictionary={dictionary} />
      <FeaturedWorks
        posts={featuredPosts}
        locale={locale as Locale}
        dictionary={dictionary}
      />
      <LatestPublications
        posts={latestPosts}
        locale={locale as Locale}
        dictionary={dictionary}
      />
      <InspirationalBanner
        locale={locale as Locale}
        dictionary={dictionary}
      />
    </>
  )
}