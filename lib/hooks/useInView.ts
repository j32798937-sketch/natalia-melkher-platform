'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInViewOptions {
  /** Intersection threshold (0-1) */
  threshold?: number | number[]
  /** Root margin (CSS margin string) */
  rootMargin?: string
  /** Only trigger once */
  triggerOnce?: boolean
  /** Delay before setting inView (ms) */
  delay?: number
}

interface UseInViewReturn {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLElement | null>
  /** Whether the element is in the viewport */
  inView: boolean
  /** The IntersectionObserverEntry */
  entry: IntersectionObserverEntry | null
}

/**
 * Hook to detect when an element enters the viewport
 *
 * @example
 * const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
 *
 * return (
 *   <div ref={ref} className={inView ? 'animate-in' : 'opacity-0'}>
 *     Content
 *   </div>
 * )
 */
export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const {
    threshold = 0,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = false,
    delay = 0,
  } = options

  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const hasTriggered = useRef(false)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [observerEntry] = entries
      setEntry(observerEntry)

      if (triggerOnce && hasTriggered.current) return

      if (observerEntry.isIntersecting) {
        if (delay > 0) {
          setTimeout(() => {
            setInView(true)
            hasTriggered.current = true
          }, delay)
        } else {
          setInView(true)
          hasTriggered.current = true
        }
      } else if (!triggerOnce) {
        setInView(false)
      }
    },
    [triggerOnce, delay]
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setInView(true))
      return
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, handleIntersection])

  return { ref, inView, entry }
}