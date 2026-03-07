'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { useInView } from '@/lib/hooks/useInView'
import { cn } from '@/lib/utils/cn'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  once?: boolean
  as?: React.ElementType
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 30,
  once = true,
  as = 'div',
}: FadeInProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: once,
    rootMargin: '0px 0px -40px 0px',
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance }
      case 'down':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      case 'none':
        return {}
      default:
        return { y: distance }
    }
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  // Use standard HTML tags instead of motion() factory
  const Tag = as as keyof typeof motion

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(className)}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}