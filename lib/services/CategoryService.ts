import { queryAll, queryOne, execute } from '@/lib/database/index'

/**
 * Category Service
 *
 * Handles all database operations for literary categories.
 */

/* ── Types ───────────────────────────────────────────── */

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string
  icon: string
  sort_order: number
  created_at: string
}

export interface CategoryWithCount extends Category {
  post_count: number
}

/* ── Public Methods ──────────────────────────────────── */

/**
 * Get all categories ordered by sort_order
 */
export async function getAllCategories(): Promise<Category[]> {
  return queryAll<Category>(
    `SELECT * FROM categories ORDER BY sort_order ASC`
  )
}

/**
 * Get all categories with post counts
 */
export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  return queryAll<CategoryWithCount>(
    `SELECT c.*,
            COUNT(CASE WHEN p.status = 'published' THEN 1 END) as post_count
     FROM categories c
     LEFT JOIN posts p ON p.category_id = c.id
     GROUP BY c.id
     ORDER BY c.sort_order ASC`
  )
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await queryOne<Category>(
    `SELECT * FROM categories WHERE slug = ?`,
    [slug]
  )
  return row || null
}

/**
 * Get a category by ID
 */
export async function getCategoryById(id: number): Promise<Category | null> {
  const row = await queryOne<Category>(
    `SELECT * FROM categories WHERE id = ?`,
    [id]
  )
  return row || null
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  sortOrder?: number
}): Promise<number> {
  const result = await execute(
    `INSERT INTO categories (name, slug, description, color, icon, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.slug,
      data.description || null,
      data.color || '#8B7355',
      data.icon || '✦',
      data.sortOrder ?? 0,
    ],
    { getInsertId: true }
  )
  return Number(result.lastInsertRowid ?? 0)
}

/**
 * Update a category
 */
export async function updateCategory(
  id: number,
  data: Partial<{
    name: string
    slug: string
    description: string
    color: string
    icon: string
    sortOrder: number
  }>
): Promise<void> {
  const fields: string[] = []
  const params: unknown[] = []

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name) }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug) }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description) }
  if (data.color !== undefined) { fields.push('color = ?'); params.push(data.color) }
  if (data.icon !== undefined) { fields.push('icon = ?'); params.push(data.icon) }
  if (data.sortOrder !== undefined) { fields.push('sort_order = ?'); params.push(data.sortOrder) }

  if (fields.length === 0) return

  params.push(id)
  await execute(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, params)
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<void> {
  await execute(`UPDATE posts SET category_id = NULL WHERE category_id = ?`, [id])
  await execute(`DELETE FROM categories WHERE id = ?`, [id])
}

/**
 * Get all category slugs (for static generation)
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  const rows = await queryAll<{ slug: string }>(`SELECT slug FROM categories`)
  return rows.map((r) => r.slug)
}