import { NextRequest, NextResponse } from 'next/server'
import { searchPosts, getPublishedPosts } from '@/lib/services/PostService'
import { sanitizeInput } from '@/lib/utils/sanitize'

/**
 * GET /api/search
 *
 * Search published posts using full-text search.
 * Falls back to LIKE search if FTS fails.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')?.trim()
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    if (!query || query.length < 2) {
      return NextResponse.json(
        { data: [], total: 0 },
        { status: 200 }
      )
    }

    const sanitizedQuery = sanitizeInput(query)

    let results = []

    try {
      // Try FTS search first
      results = await searchPosts(sanitizedQuery, limit)
    } catch {
      // Fallback to LIKE search
      const fallback = await getPublishedPosts(
        { search: sanitizedQuery },
        { page: 1, limit, sortBy: 'newest' }
      )
      results = fallback.data
    }

    return NextResponse.json(
      {
        data: results,
        total: results.length,
        query: sanitizedQuery,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (error) {
    console.error('[Melkher] GET /api/search error:', error)
    return NextResponse.json(
      { error: 'Search failed', data: [], total: 0 },
      { status: 500 }
    )
  }
}