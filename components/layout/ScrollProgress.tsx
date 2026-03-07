'use client'

import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Scroll Progress Bar
 *
 * A thin, elegant progress bar at the bottom of the header
 * that shows how far the user has scrolled on the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  // Smooth the progress value
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[1px] origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--color-accent-light), var(--color-accent))',
      }}
      aria-hidden="true"
    />
  )
}