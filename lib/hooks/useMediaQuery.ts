'use client'

import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/lib/utils/constants'

/**
 * Hook to check if a media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)')
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

/**
 * Responsive breakpoint hooks
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints()
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.MD - 1}px)`)
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  )
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`)
  const isLargeDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.XL}px)`)
  const isSmallMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.SM - 1}px)`)

  return {
    isSmallMobile,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    /** True when screen is tablet or larger */
    isTabletUp: !isMobile,
    /** True when screen is mobile or tablet */
    isMobileOrTablet: isMobile || isTablet,
  }
}

/**
 * Hook to detect reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Hook to detect system color scheme preference
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * Hook to detect if device supports hover
 */
export function useSupportsHover(): boolean {
  return useMediaQuery('(hover: hover)')
}

/**
 * Hook to detect if device has touch capability
 */
export function useIsTouchDevice(): boolean {
  const hasCoarsePointer = useMediaQuery('(pointer: coarse)')
  return hasCoarsePointer
}