'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/lib/hooks/useInView'
import { cn } from '@/lib/utils/cn'

interface TextRevealProps {
  children: string
  className?: string
  /** Delay before animation starts */
  delay?: number
  /** Animate by 'word' or 'letter' */
  by?: 'word' | 'letter'
  /** Stagger delay between each word/letter */
  stagger?: number
  /** HTML tag to render */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  /** Only animate once */
  once?: boolean
}

/**
 * Text Reveal Animation
 *
 * Splits text into words or letters and animates each one
 * sequentially with a stagger effect.
 *
 * @example
 * <TextReveal as="h1" by="word" stagger={0.08}>
 *   Пространство тишины и слова
 * </TextReveal>
 */
export function TextReveal({
  children,
  className,
  delay = 0,
  by = 'word',
  stagger = 0.05,
  as: Tag = 'span',
  once = true,
}: TextRevealProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: once,
  })

  const elements = by === 'word' ? children.split(' ') : children.split('')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const elementVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  }

  const MotionTag = motion(Tag)

  return (
    <MotionTag
      ref={ref as React.Ref<HTMLParagraphElement>}
      className={cn('inline-block', className)}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      aria-label={children}
    >
      {elements.map((element, index) => (
        <motion.span
          key={`${element}-${index}`}
          className="inline-block"
          variants={elementVariants}
        >
          {element}
          {by === 'word' && index < elements.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </motion.span>
      ))}
    </MotionTag>
  )
}