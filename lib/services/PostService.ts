import { queryAll, queryOne, execute, transaction } from '@/lib/database/index'
import { databaseConfig } from '@/config/database.config'
import { slugify, uniqueSlug } from '@/lib/utils/slugify'
import { calculateReadingTime, generateExcerpt } from '@/lib/utils/helpers'
import type { PublicationCardData } from '@/components/library/PublicationCard'

/**
 * Post Service
 *
 * Handles all database operations for literary publications.
 */

/* ── Types ───────────────────────────────────────────── */

export interface Post {
  id: number
  title: string
  slug: string
  author_id: number
  category_id: number | null
  content: string
  excerpt: string | null
  cover_image: string | null
  type: string
  status: string
  featured: number
  reading_time: number
  views: number
  meta_title: string | null
  meta_desc: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostWithCategory extends Post {
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  category_icon: string | null
}

export interface PostFilters {
  status?: string
  type?: string
  categorySlug?: string
  featured?: boolean
  search?: string
  locale?: string
}

export interface PostPagination {
  page: number
  limit: number
  sortBy?: 'newest' | 'oldest' | 'popular'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/* ── Helper: Map DB row to card data ─────────────────── */

function mapToCardData(row: PostWithCategory): PublicationCardData {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    type: row.type,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    coverImage: row.cover_image,
    readingTime: row.reading_time,
    views: row.views,
    publishedAt: row.published_at,
    featured: row.featured === 1,
  }
}

/* ── Public Methods ──────────────────────────────────── */

/**
 * Get published posts with pagination and filters
 */
export async function getPublishedPosts(
  filters: PostFilters = {},
  pagination: PostPagination = { page: 1, limit: 12 }
): Promise<PaginatedResult<PublicationCardData>> {
  const { page, limit, sortBy = 'newest' } = pagination
  const offset = (page - 1) * limit

  let whereClause = `WHERE p.status = 'published'`
  const params: unknown[] = []

  if (filters.type) {
    whereClause += ` AND p.type = ?`
    params.push(filters.type)
  }

  if (filters.categorySlug) {
    whereClause += ` AND c.slug = ?`
    params.push(filters.categorySlug)
  }

  if (filters.featured) {
    whereClause += ` AND p.featured = 1`
  }

  if (filters.search) {
    whereClause += ` AND (p.title LIKE ? OR p.excerpt LIKE ?)`
    const searchTerm = `%${filters.search}%`
    params.push(searchTerm, searchTerm)
  }

  let orderClause = 'ORDER BY p.published_at DESC'
  if (sortBy === 'oldest') {
    orderClause = 'ORDER BY p.published_at ASC'
  } else if (sortBy === 'popular') {
    orderClause = 'ORDER BY p.views DESC'
  }

  // Count total
  const countResult = await queryOne<{ total: number }>(
    `SELECT COUNT(*) as total FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}`,
    params
  )
  const total = Number(countResult?.total ?? 0)

  // Fetch page
  const rows = await queryAll<PostWithCategory>(
    `SELECT p.*,
            c.name as category_name,
            c.slug as category_slug,
            c.color as category_color,
            c.icon as category_icon
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  return {
    data: rows.map(mapToCardData),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit = 3): Promise<PublicationCardData[]> {
  const rows = await queryAll<PostWithCategory>(
    `SELECT p.*,
            c.name as category_name,
            c.slug as category_slug,
            c.color as category_color,
            c.icon as category_icon
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.status = 'published' AND p.featured = 1
     ORDER BY p.published_at DESC
     LIMIT ?`,
    [limit]
  )

  return rows.map(mapToCardData)
}

/**
 * Get latest posts
 */
export async function getLatestPosts(limit = 6): Promise<PublicationCardData[]> {
  const rows = await queryAll<PostWithCategory>(
    `SELECT p.*,
            c.name as category_name,
            c.slug as category_slug,
            c.color as category_color,
            c.icon as category_icon
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.status = 'published'
     ORDER BY p.published_at DESC
     LIMIT ?`,
    [limit]
  )

  return rows.map(mapToCardData)
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const row = await queryOne<PostWithCategory>(
    `SELECT p.*,
            c.name as category_name,
            c.slug as category_slug,
            c.color as category_color,
            c.icon as category_icon
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.status = 'published'`,
    [slug]
  )

  return row || null
}

/**
 * Get a single post by ID (for CMS)
 */
export async function getPostById(id: number): Promise<PostWithCategory | null> {
  const row = await queryOne<PostWithCategory>(
    `SELECT p.*,
            c.name as category_name,
            c.slug as category_slug,
            c.color as category_color,
            c.icon as category_icon
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  )

  return row || null
}

/**
 * Get related posts
 */
export async function getRelatedPosts(
  postId: number,
  categoryId: number | null,
  limit = 4
): Promise<PublicationCardData[]> {
  let query = `
    SELECT p.*,
           c.name as category_name,
           c.slug as category_slug,
           c.color as category_color,
           c.icon as category_icon
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' AND p.id != ?`

  const params: unknown[] = [postId]

  if (categoryId) {
    query += ` AND p.category_id = ?`
    params.push(categoryId)
  }

  query += ` ORDER BY p.published_at DESC LIMIT ?`
  params.push(limit)

  const rows = await queryAll<PostWithCategory>(query, params)
  return rows.map(mapToCardData)
}

/**
 * Increment post view counter
 */
export async function incrementViews(postId: number): Promise<void> {
  await execute(
    `UPDATE posts SET views = views + 1 WHERE id = ?`,
    [postId]
  )
}

/**
 * Create a new post
 */
export async function createPost(data: {
  title: string
  content: string
  excerpt?: string
  type: string
  status?: string
  categoryId?: number
  coverImage?: string
  featured?: boolean
  metaTitle?: string
  metaDescription?: string
  authorId: number
}): Promise<number> {
  const slugRows = await queryAll<{ slug: string }>(`SELECT slug FROM posts`)
  const existingSlugs = slugRows.map((r) => r.slug)

  const slug = uniqueSlug(data.title, existingSlugs)
  const readingTime = calculateReadingTime(data.content)
  const excerpt = data.excerpt || generateExcerpt(data.content)
  const now = new Date().toISOString()
  const publishedAt = data.status === 'published' ? now : null

  const result = await execute(
    `INSERT INTO posts (title, slug, author_id, category_id, content, excerpt, cover_image, type, status, featured, reading_time, meta_title, meta_desc, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      slug,
      data.authorId,
      data.categoryId || null,
      data.content,
      excerpt,
      data.coverImage || null,
      data.type,
      data.status || 'draft',
      data.featured ? 1 : 0,
      readingTime,
      data.metaTitle || null,
      data.metaDescription || null,
      publishedAt,
      now,
      now,
    ],
    { getInsertId: true }
  )

  return Number(result.lastInsertRowid ?? 0)
}

/**
 * Update a post
 */
export async function updatePost(
  id: number,
  data: Partial<{
    title: string
    slug: string
    content: string
    excerpt: string
    type: string
    status: string
    categoryId: number
    coverImage: string
    featured: boolean
    metaTitle: string
    metaDescription: string
  }>
): Promise<void> {
  const fields: string[] = []
  const params: unknown[] = []

  if (data.title !== undefined) {
    fields.push('title = ?')
    params.push(data.title)
  }
  if (data.slug !== undefined) {
    fields.push('slug = ?')
    params.push(data.slug)
  }
  if (data.content !== undefined) {
    fields.push('content = ?')
    params.push(data.content)

    fields.push('reading_time = ?')
    params.push(calculateReadingTime(data.content))
  }
  if (data.excerpt !== undefined) {
    fields.push('excerpt = ?')
    params.push(data.excerpt)
  }
  if (data.type !== undefined) {
    fields.push('type = ?')
    params.push(data.type)
  }
  if (data.status !== undefined) {
    fields.push('status = ?')
    params.push(data.status)

    if (data.status === 'published') {
      const nowFn = databaseConfig.provider === 'postgresql' ? 'NOW()' : 'datetime(\'now\')'
      fields.push(`published_at = COALESCE(published_at, ${nowFn})`)
    }
  }
  if (data.categoryId !== undefined) {
    fields.push('category_id = ?')
    params.push(data.categoryId)
  }
  if (data.coverImage !== undefined) {
    fields.push('cover_image = ?')
    params.push(data.coverImage)
  }
  if (data.featured !== undefined) {
    fields.push('featured = ?')
    params.push(data.featured ? 1 : 0)
  }
  if (data.metaTitle !== undefined) {
    fields.push('meta_title = ?')
    params.push(data.metaTitle)
  }
  if (data.metaDescription !== undefined) {
    fields.push('meta_desc = ?')
    params.push(data.metaDescription)
  }

  if (fields.length === 0) return

  params.push(id)
  await execute(
    `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`,
    params
  )
}

/**
 * Delete a post
 */
export async function deletePost(id: number): Promise<void> {
  await transaction(async () => {
    await execute(`DELETE FROM post_tags WHERE post_id = ?`, [id])
    await execute(`DELETE FROM translations WHERE post_id = ?`, [id])
    await execute(`DELETE FROM posts WHERE id = ?`, [id])
  })
}

/**
 * Get all posts for CMS
 */
export async function getAllPosts(
  pagination: PostPagination = { page: 1, limit: 20 },
  filters: PostFilters = {}
): Promise<PaginatedResult<PostWithCategory>> {
  const { page, limit, sortBy = 'newest' } = pagination
  const offset = (page - 1) * limit

  let whereClause = 'WHERE 1=1'
  const params: unknown[] = []

  if (filters.status) {
    whereClause += ` AND p.status = ?`
    params.push(filters.status)
  }
  if (filters.type) {
    whereClause += ` AND p.type = ?`
    params.push(filters.type)
  }
  if (filters.search) {
    whereClause += ` AND (p.title LIKE ? OR p.content LIKE ?)`
    const term = `%${filters.search}%`
    params.push(term, term)
  }

  let orderClause = 'ORDER BY p.updated_at DESC'
  if (sortBy === 'oldest') orderClause = 'ORDER BY p.created_at ASC'
  if (sortBy === 'popular') orderClause = 'ORDER BY p.views DESC'

  const countResult = await queryOne<{ total: number }>(
    `SELECT COUNT(*) as total FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}`,
    params
  )
  const total = Number(countResult?.total ?? 0)

  const rows = await queryAll<PostWithCategory>(
    `SELECT p.*,
            c.name as category_name,
            c.slug as category_slug,
            c.color as category_color,
            c.icon as category_icon
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  return {
    data: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Full-text search posts
 */
export async function searchPosts(
  q: string,
  limit = 20
): Promise<PublicationCardData[]> {
  let rows: PostWithCategory[]
  if (databaseConfig.provider === 'postgresql') {
    const term = q.trim().replace(/\s+/g, ' & ')
    rows = await queryAll<PostWithCategory>(
      `SELECT p.*,
              c.name as category_name,
              c.slug as category_slug,
              c.color as category_color,
              c.icon as category_icon
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.search_vector @@ plainto_tsquery('simple', ?) AND p.status = 'published'
       ORDER BY ts_rank(p.search_vector, plainto_tsquery('simple', ?)) DESC
       LIMIT ?`,
      [q, q, limit]
    )
  } else {
    rows = await queryAll<PostWithCategory>(
      `SELECT p.*,
              c.name as category_name,
              c.slug as category_slug,
              c.color as category_color,
              c.icon as category_icon
       FROM posts p
       INNER JOIN posts_fts ON posts_fts.rowid = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE posts_fts MATCH ? AND p.status = 'published'
       ORDER BY rank
       LIMIT ?`,
      [q, limit]
    )
  }
  return rows.map(mapToCardData)
}

/**
 * Get post statistics for dashboard
 */
export async function getPostStats(): Promise<{
  total: number
  published: number
  drafts: number
  totalViews: number
}> {
  const stats = await queryOne<{
    total: number
    published: number
    drafts: number
    total_views: number
  }>(
    `SELECT
       COUNT(*) as total,
       SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
       SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
       SUM(views) as total_views
     FROM posts`
  )

  return {
    total: Number(stats?.total ?? 0),
    published: Number(stats?.published ?? 0),
    drafts: Number(stats?.drafts ?? 0),
    totalViews: Number(stats?.total_views ?? 0),
  }
}