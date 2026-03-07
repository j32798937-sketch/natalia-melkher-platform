'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/hooks/useInView'
import { cn } from '@/lib/utils/cn'

interface SlideUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
}

/**
 * SlideUp Animation Wrapper
 *
 * Elements slide up and fade in when entering the viewport.
 * Commonly used for section content and cards.
 *
 * @example
 * <SlideUp delay={0.1}>
 *   <PublicationCard />
 * </SlideUp>
 */
export function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.7,
  distance = 40,
  once = true,
}: SlideUpProps) {
  const { ref, inView } = useInView({
    threshold: 0.05,
    triggerOnce: once,
    rootMargin: '0px 0px -30px 0px',
  })

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(className)}
      initial={{ opacity: 0, y: distance }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: distance }
      }
      transition={{
        duration,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  )
}