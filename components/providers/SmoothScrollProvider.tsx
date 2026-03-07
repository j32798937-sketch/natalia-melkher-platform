'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from '@/lib/hooks/useMediaQuery'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * Smooth Scroll Provider
 *
 * Initializes Lenis smooth scrolling for the entire application.
 * Automatically disables when user prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}