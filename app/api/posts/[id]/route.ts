import { NextRequest, NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost } from '@/lib/services/PostService'
import { getCurrentSession } from '@/lib/services/AuthService'
import { postUpdateSchema, validateData, formatZodErrors } from '@/lib/utils/validation'

/**
 * GET /api/posts/[id]
 *
 * Get a single post by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const post = await getPostById(postId)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ data: post }, { status: 200 })
  } catch (error) {
    console.error('[Melkher] GET /api/posts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/posts/[id]
 *
 * Update a post. Requires authentication.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const postId = parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const existing = await getPostById(postId)
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const body = await request.json()

    const validation = validateData(postUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.errors) },
        { status: 400 }
      )
    }

    const data = validation.data

    await updatePost(postId, {
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
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Melkher] PUT /api/posts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/[id]
 *
 * Delete a post. Requires authentication.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const postId = parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const existing = await getPostById(postId)
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await deletePost(postId)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Melkher] DELETE /api/posts/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}