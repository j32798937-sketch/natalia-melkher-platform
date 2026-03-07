import { NextRequest, NextResponse } from 'next/server'
import {
  getCategoriesWithCounts,
  createCategory,
} from '@/lib/services/CategoryService'
import { getCurrentSession } from '@/lib/services/AuthService'
import { categoryCreateSchema, validateData, formatZodErrors } from '@/lib/utils/validation'
import { slugify } from '@/lib/utils/slugify'

/**
 * GET /api/categories
 *
 * Get all categories with post counts.
 * Public endpoint.
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await getCategoriesWithCounts()

    return NextResponse.json(
      { data: categories },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('[Melkher] GET /api/categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/categories
 *
 * Create a new category. Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const validation = validateData(categoryCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.errors) },
        { status: 400 }
      )
    }

    const data = validation.data
    const slug = data.slug || slugify(data.name)

    const categoryId = await createCategory({
      name: data.name,
      slug,
      description: data.description,
      color: data.color,
      icon: data.icon,
      sortOrder: data.sortOrder,
    })

    return NextResponse.json(
      { success: true, id: categoryId },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Melkher] POST /api/categories error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}