import { NextRequest, NextResponse } from 'next/server'
import { execute, queryAll } from '@/lib/database/index'
import { getCurrentSession } from '@/lib/services/AuthService'
import { sanitizeInput } from '@/lib/utils/sanitize'

/**
 * POST /api/analytics
 *
 * Track an analytics event (page view, reading time, etc.)
 * Public endpoint — no auth required.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const event = sanitizeInput(body.event || '')
    const postId = body.postId ? parseInt(body.postId) : null
    const data = body.data ? JSON.stringify(body.data) : null
    const locale = sanitizeInput(body.locale || '')

    if (!event) {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 })
    }

    // Anonymize IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const anonymizedIp = ip ? ip.replace(/\.\d+$/, '.0') : null

    const userAgent = request.headers.get('user-agent')?.substring(0, 255) || null

    await execute(
      `INSERT INTO analytics (post_id, event, data, ip, user_agent, locale)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        postId,
        event,
        data,
        anonymizedIp,
        userAgent,
        locale || null,
      ]
    )

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[Melkher] POST /api/analytics error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

/**
 * GET /api/analytics
 *
 * Get analytics data. Requires authentication.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const daysAgo = `datetime('now', '-${parseInt(period)} days')`

    // Page views by day
    const viewsByDay = await queryAll<{ date: string; count: number }>(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM analytics
       WHERE event = 'page_view' AND created_at >= ${daysAgo}
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    )

    // Top posts
    const topPosts = await queryAll<{ post_id: number; title: string; views: number }>(
      `SELECT a.post_id, p.title, COUNT(*) as views
       FROM analytics a
       JOIN posts p ON a.post_id = p.id
       WHERE a.event = 'page_view' AND a.post_id IS NOT NULL AND a.created_at >= ${daysAgo}
       GROUP BY a.post_id
       ORDER BY views DESC
       LIMIT 10`
    )

    // Locale distribution
    const locales = await queryAll<{ locale: string; count: number }>(
      `SELECT locale, COUNT(*) as count
       FROM analytics
       WHERE event = 'page_view' AND locale IS NOT NULL AND created_at >= ${daysAgo}
       GROUP BY locale
       ORDER BY count DESC`
    )

    // Total events
    const totals = await queryAll<{ event: string; count: number }>(
      `SELECT event, COUNT(*) as count
       FROM analytics
       WHERE created_at >= ${daysAgo}
       GROUP BY event
       ORDER BY count DESC`
    )

    return NextResponse.json(
      {
        period: parseInt(period),
        viewsByDay,
        topPosts,
        locales,
        totals,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Melkher] GET /api/analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}