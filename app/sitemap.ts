import type { MetadataRoute } from 'next'
import { queryAll } from '@/lib/database/index'
import { LOCALES } from '@/lib/utils/constants'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://natalia-melkher.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  let posts: { slug: string; category_slug: string | null; updated_at: string }[] = []
  let categorySlugs: string[] = []

  try {
    posts = await queryAll<{ slug: string; category_slug: string | null; updated_at: string }>(
      `SELECT p.slug, c.slug as category_slug, p.updated_at
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC`
    )
  } catch {
    // Silent fail
  }

  try {
    categorySlugs = (
      await queryAll<{ slug: string }>(`SELECT slug FROM categories ORDER BY sort_order ASC`)
    ).map((c) => c.slug)
  } catch {
    categorySlugs = ['poetry', 'prose', 'essays', 'reflections', 'diary']
  }

  for (const locale of LOCALES) {
    const base = `${SITE_URL}/${locale}`

    entries.push({
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })
    entries.push({
      url: `${base}/library`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    for (const catSlug of categorySlugs) {
      entries.push({
        url: `${base}/library/${catSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    for (const post of posts) {
      const catPath = post.category_slug || 'all'
      entries.push({
        url: `${base}/library/${catPath}/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    entries.push({
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
    entries.push({
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  }

  return entries
}
