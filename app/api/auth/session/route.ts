import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession, getUserById } from '@/lib/services/AuthService'

/**
 * GET /api/auth/session
 *
 * Check if the current session is valid and return user data.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    const user = await getUserById(session.userId)

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Melkher] Session check error:', error)
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    )
  }
}