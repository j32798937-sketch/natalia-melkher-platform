import { NextRequest, NextResponse } from 'next/server'
import {
  getPublishedPosts,
  createPost,
  type PostFilters,
  type PostPagination,
} from '@/lib/services/PostService'
import { getCurrentSession } from '@/lib/services/AuthService'
import { postCreateSchema, validateData, formatZodErrors } from '@/lib/utils/validation'

/**
 * GET /api/posts
 *
 * Get published posts with pagination, filtering, and sorting.
 * Public endpoint — no authentication required.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: PostFilters = {}
    const pagination: PostPagination = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '12'), 50),
      sortBy: (searchParams.get('sort') as 'newest' | 'oldest' | 'popular') || 'newest',
    }

    if (searchParams.get('type')) {
      filters.type = searchParams.get('type')!
    }
    if (searchParams.get('category')) {
      filters.categorySlug = searchParams.get('category')!
    }
    if (searchParams.get('featured') === 'true') {
      filters.featured = true
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }

    const result = await getPublishedPosts(filters, pagination)

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[Melkher] GET /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/posts
 *
 * Create a new post. Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate
    const validation = validateData(postCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.errors) },
        { status: 400 }
      )
    }

    const data = validation.data

    const postId = await createPost({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      type: data.type,
      status: data.status,
      categoryId: data.categoryId,
      coverImage: data.coverImage,
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      authorId: session.userId,
    })

    return NextResponse.json(
      { success: true, id: postId },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Melkher] POST /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}