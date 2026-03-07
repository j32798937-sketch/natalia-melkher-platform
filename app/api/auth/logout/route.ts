import { NextRequest, NextResponse } from 'next/server'
import { destroySession } from '@/lib/services/AuthService'
import { authConfig } from '@/config/auth.config'

/**
 * POST /api/auth/logout
 *
 * Destroy the current session and clear the cookie.
 */
export async function POST(request: NextRequest) {
  try {
    await destroySession()

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    )

    // Clear cookie
    response.cookies.set(authConfig.session.cookieName, '', {
      httpOnly: true,
      secure: authConfig.session.cookie.secure,
      sameSite: authConfig.session.cookie.sameSite,
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('[Melkher] Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}