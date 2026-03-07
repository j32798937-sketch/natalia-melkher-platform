'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface UseSmoothScrollOptions {
  /** Enable/disable smooth scroll (default: true) */
  enabled?: boolean
  /** Smooth intensity — higher = smoother (default: 0.1) */
  lerp?: number
  /** Duration of scroll animation in seconds (default: 1.2) */
  duration?: number
  /** Easing function (default: easeOutExpo) */
  easing?: (t: number) => number
  /** Scroll orientation (default: 'vertical') */
  orientation?: 'vertical' | 'horizontal'
  /** Smooth scroll for touch devices (default: false for performance) */
  smoothTouch?: boolean
  /** Infinite scroll (default: false) */
  infinite?: boolean
}

/**
 * Default easing function — easeOutExpo
 * Creates a smooth deceleration effect
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Hook for Lenis smooth scrolling
 *
 * Creates a smooth scrolling experience for the page.
 * Returns the Lenis instance for manual scroll control.
 *
 * @example
 * const lenis = useSmoothScroll()
 *
 * // Scroll to element
 * lenis.current?.scrollTo('#section')
 *
 * // Scroll to top
 * lenis.current?.scrollTo(0)
 */
export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const {
    enabled = true,
    lerp: lerpValue = 0.1,
    duration = 1.2,
    easing = easeOutExpo,
    orientation = 'vertical',
    smoothTouch = false,
    infinite = false,
  } = options

  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Don't initialize on server
    if (typeof window === 'undefined') return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      console.log('[Melkher] Smooth scroll disabled: prefers-reduced-motion')
      return
    }

    // Create Lenis instance
    const lenis = new Lenis({
      lerp: lerpValue,
      duration,
      easing,
      orientation,
      smoothWheel: true,
      infinite,
    })

    lenisRef.current = lenis

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, lerpValue, duration, easing, orientation, infinite])

  return lenisRef
}

/**
 * Hook to scroll to a specific element or position
 *
 * @example
 * const scrollTo = useScrollTo()
 * scrollTo('#about-section')
 * scrollTo(0) // scroll to top
 */
export function useScrollTo() {
  const lenisRef = useSmoothScroll()

  return (
    target: string | number | HTMLElement,
    options?: {
      offset?: number
      duration?: number
      immediate?: boolean
    }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      })
    } else {
      // Fallback for non-smooth scroll
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else if (typeof target === 'string') {
        const element = document.querySelector(target)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}