import { NextRequest, NextResponse } from 'next/server'
import { handleI18nMiddleware } from '@/lib/i18n/middleware'

/**
 * Next.js Middleware
 *
 * Handles:
 * 1. Internationalization (i18n) routing
 * 2. CMS authentication checks
 * 3. Security headers
 * 4. API rate limiting (basic)
 */

/**
 * CMS routes that require authentication
 */
const CMS_PROTECTED_PATHS = [
  '/cms',
  '/cms/posts',
  '/cms/media',
  '/cms/categories',
  '/cms/analytics',
  '/cms/settings',
]

/**
 * Check if CMS path requires authentication
 */
function isCmsProtectedPath(pathname: string): boolean {
  // Allow login page without auth
  if (pathname === '/cms/login') return false

  return CMS_PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
}

/**
 * Handle CMS authentication check
 */
function handleCmsAuth(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  if (!isCmsProtectedPath(pathname)) {
    return null
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('melkher-session')

  if (!sessionCookie?.value) {
    // No session — redirect to login
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/cms/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session exists — allow access (actual validation happens in API routes)
  return null
}

/**
 * Basic API rate limiting using in-memory counter
 * Note: This resets on server restart. For production,
 * use a proper rate limiter with Redis or similar.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 100

function handleRateLimit(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Only rate-limit API routes
  if (!pathname.startsWith('/api/')) return null

  // Skip rate limiting for GET requests to public endpoints
  if (request.method === 'GET') return null

  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const key = `${ip}:${pathname}`
  const now = Date.now()

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return null
  }

  record.count++

  if (record.count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
        },
      }
    )
  }

  return null
}

/**
 * Add security headers to API responses
 */
function addApiSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // ── 1. API Rate Limiting ────────────────────────────
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = handleRateLimit(request)
    if (rateLimitResponse) return rateLimitResponse

    // Continue to API route with security headers
    const response = NextResponse.next()
    return addApiSecurityHeaders(response)
  }

  // ── 2. CMS Authentication ──────────────────────────
  if (pathname.startsWith('/cms')) {
    const authResponse = handleCmsAuth(request)
    if (authResponse) return authResponse
    return NextResponse.next()
  }

  // ── 3. Static files — skip middleware ───────────────
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/uploads/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next()
  }

  // ── 4. i18n Routing ────────────────────────────────
  const i18nResponse = handleI18nMiddleware(request)
  if (i18nResponse) return i18nResponse

  // ── 5. Default — continue ─────────────────────────
  return NextResponse.next()
}

/**
 * Middleware matcher configuration
 *
 * Run middleware on all routes except:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files with extensions
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}