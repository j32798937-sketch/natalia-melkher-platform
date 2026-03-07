import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateUser,
  createSession,
  isLoginRateLimited,
  recordFailedLogin,
  clearLoginAttempts,
} from '@/lib/services/AuthService'
import { loginSchema, validateData, formatZodErrors } from '@/lib/utils/validation'
import { authConfig } from '@/config/auth.config'

/**
 * POST /api/auth/login
 *
 * Authenticate a user and create a session.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateData(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.errors) },
        { status: 400 }
      )
    }

    const { username, password } = validation.data

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `${ip}:${username}`

    if (isLoginRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Authenticate
    const user = await authenticateUser(username, password)

    if (!user) {
      recordFailedLogin(rateLimitKey)
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create session
    const token = await createSession(user)
    clearLoginAttempts(rateLimitKey)

    // Set cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    )

    response.cookies.set(authConfig.session.cookieName, token, {
      httpOnly: authConfig.session.cookie.httpOnly,
      secure: authConfig.session.cookie.secure,
      sameSite: authConfig.session.cookie.sameSite,
      path: authConfig.session.cookie.path,
      maxAge: authConfig.session.maxAge,
    })

    return response
  } catch (error) {
    console.error('[Melkher] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}