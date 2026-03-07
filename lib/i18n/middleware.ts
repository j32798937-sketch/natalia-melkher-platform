import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from '@/lib/i18n/config'
import {
  isValidLocale,
  getLocaleFromHeader,
  getLocaleFromPath,
} from '@/lib/i18n/config'
import type { Locale } from '@/lib/utils/constants'

/**
 * i18n Middleware
 *
 * Handles:
 * 1. Locale detection from URL, cookie, or Accept-Language header
 * 2. Redirect to localized URLs
 * 3. Setting locale cookie for future visits
 */

/**
 * Paths that should NOT be processed by i18n middleware
 */
const IGNORED_PATHS = [
  '/api/',
  '/cms/',
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/images/',
  '/fonts/',
  '/icons/',
  '/uploads/',
]

/**
 * Check if a path should be ignored by i18n middleware
 */
function shouldIgnorePath(pathname: string): boolean {
  return IGNORED_PATHS.some((prefix) => pathname.startsWith(prefix))
}

/**
 * Detect the best locale for the request
 */
function detectLocale(request: NextRequest): Locale {
  // 1. Check URL path
  const pathLocale = getLocaleFromPath(request.nextUrl.pathname)
  if (pathLocale) return pathLocale

  // 2. Check cookie
  const cookieLocale = request.cookies.get(i18nConfig.detection.cookieName)?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  return getLocaleFromHeader(acceptLanguage)
}

/**
 * Handle i18n routing in the middleware
 */
export function handleI18nMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Skip ignored paths
  if (shouldIgnorePath(pathname)) {
    return null
  }

  // Check if the path already has a valid locale prefix
  const pathLocale = getLocaleFromPath(pathname)

  if (pathLocale) {
    // Path has a valid locale — set cookie and continue
    const response = NextResponse.next()
    response.cookies.set(i18nConfig.detection.cookieName, pathLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  // Path has no locale — detect and redirect
  const detectedLocale = detectLocale(request)

  // Build the redirect URL
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set(i18nConfig.detection.cookieName, detectedLocale, {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  })

  return response
}