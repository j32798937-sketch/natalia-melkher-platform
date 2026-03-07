import { NextRequest, NextResponse } from 'next/server'
import { queryAll } from '@/lib/database/index'
import { LOCALES } from '@/lib/utils/constants'

/**
 * GET /api/seo/sitemap
 *
 * Generates a dynamic XML sitemap.
 */
export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://natalia-melkher.com'

  // Get all published posts
  let posts: { slug: string; category_slug: string | null; updated_at: string }[] = []
  try {
    posts = await queryAll<{ slug: string; category_slug: string | null; updated_at: string }>(
      `SELECT p.slug, c.slug as category_slug, p.updated_at
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC`
    )
  } catch {
    // Silent fail — empty sitemap
  }

  // Get all category slugs
  let categorySlugs: string[] = []
  try {
    categorySlugs = (await queryAll<{ slug: string }>(`SELECT slug FROM categories`))
      .map((c) => c.slug)
  } catch {
    categorySlugs = ['poetry', 'prose', 'essays', 'reflections', 'diary']
  }

  const now = new Date().toISOString().split('T')[0]

  // Build sitemap entries
  let urls = ''

  for (const locale of LOCALES) {
    // Home page
    urls += `
  <url>
    <loc>${siteUrl}/${locale}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

    // Library
    urls += `
  <url>
    <loc>${siteUrl}/${locale}/library</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`

    // Categories
    for (const catSlug of categorySlugs) {
      urls += `
  <url>
    <loc>${siteUrl}/${locale}/library/${catSlug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    }

    // Individual posts
    for (const post of posts) {
      const catPath = post.category_slug || 'all'
      urls += `
  <url>
    <loc>${siteUrl}/${locale}/library/${catPath}/${post.slug}</loc>
    <lastmod>${post.updated_at?.split('T')[0] || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    }

    // About
    urls += `
  <url>
    <loc>${siteUrl}/${locale}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`

    // Contact
    urls += `
  <url>
    <loc>${siteUrl}/${locale}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}