'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { throttle } from '@/lib/utils/helpers'

interface ScrollPosition {
  /** Current scroll Y position in pixels */
  y: number
  /** Current scroll X position in pixels */
  x: number
  /** Scroll direction: 'up', 'down', or 'idle' */
  direction: 'up' | 'down' | 'idle'
  /** Scroll progress from 0 to 1 */
  progress: number
  /** Whether the page has been scrolled past a threshold */
  isScrolled: boolean
  /** Whether the user is currently scrolling */
  isScrolling: boolean
  /** Whether we've reached the bottom of the page */
  isAtBottom: boolean
}

interface UseScrollPositionOptions {
  /** Threshold in pixels to consider "scrolled" (default: 50) */
  threshold?: number
  /** Throttle interval in ms (default: 50) */
  throttleMs?: number
  /** Bottom detection offset in pixels (default: 100) */
  bottomOffset?: number
}

/**
 * Hook to track scroll position and direction
 *
 * @example
 * const { y, direction, progress, isScrolled } = useScrollPosition()
 *
 * // Hide header on scroll down
 * const headerVisible = direction !== 'down' || !isScrolled
 */
export function useScrollPosition(
  options: UseScrollPositionOptions = {}
): ScrollPosition {
  const { threshold = 50, throttleMs = 50, bottomOffset = 100 } = options

  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    y: 0,
    x: 0,
    direction: 'idle',
    progress: 0,
    isScrolled: false,
    isScrolling: false,
    isAtBottom: false,
  })

  const previousY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return

    const currentY = window.scrollY
    const currentX = window.scrollX
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min(currentY / docHeight, 1) : 0

    let direction: 'up' | 'down' | 'idle' = 'idle'
    if (currentY > previousY.current + 2) {
      direction = 'down'
    } else if (currentY < previousY.current - 2) {
      direction = 'up'
    }

    previousY.current = currentY

    const isAtBottom = currentY + window.innerHeight >= document.documentElement.scrollHeight - bottomOffset

    setScrollPosition({
      y: currentY,
      x: currentX,
      direction,
      progress,
      isScrolled: currentY > threshold,
      isScrolling: true,
      isAtBottom,
    })

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Set scrolling to false after a delay
    scrollTimeout.current = setTimeout(() => {
      setScrollPosition((prev) => ({
        ...prev,
        isScrolling: false,
        direction: 'idle',
      }))
    }, 150)
  }, [threshold, bottomOffset])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const throttledUpdate = throttle(updatePosition, throttleMs)

    window.addEventListener('scroll', throttledUpdate, { passive: true })

    // Initial position
    updatePosition()

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [updatePosition, throttleMs])

  return scrollPosition
}