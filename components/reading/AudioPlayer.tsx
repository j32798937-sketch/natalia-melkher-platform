'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface AudioPlayerProps {
  content: string
  locale: Locale
  dictionary: Dictionary
}

/**
 * Audio Player Component
 *
 * Full-featured TTS player with play/pause, speed control,
 * and progress tracking using the Web Speech API.
 */
export function AudioPlayer({ content, locale, dictionary }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const [progress, setProgress] = useState(0)
  const [isSupported, setIsSupported] = useState(false)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  // Strip HTML from content
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  // Estimated duration in seconds
  const wordsCount = plainText.split(/\s+/).length
  const estimatedDuration = (wordsCount / 150) * 60 // 150 wpm avg for TTS

  // Check support
  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const voiceMap: Record<string, string> = {
    ru: 'ru-RU',
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    cn: 'zh-CN',
    kr: 'ko-KR',
  }

  const startProgress = useCallback(() => {
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const adjustedDuration = estimatedDuration / speed
      const prog = Math.min(elapsed / adjustedDuration, 1)
      setProgress(prog)

      if (prog >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 200)
  }, [estimatedDuration, speed])

  const play = useCallback(() => {
    if (!isSupported) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(plainText)
    utterance.lang = voiceMap[locale] || 'ru-RU'
    utterance.rate = speed
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
      startProgress()
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isSupported, plainText, locale, speed, startProgress])

  const pause = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.pause()
    setIsPaused(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [isSupported])

  const resume = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.resume()
    setIsPaused(false)
    startProgress()
  }, [isSupported, startProgress])

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [isSupported])

  const togglePlayPause = () => {
    if (!isPlaying) {
      play()
    } else if (isPaused) {
      resume()
    } else {
      pause()
    }
  }

  const changeSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5]
    const currentIndex = speeds.indexOf(speed)
    const nextIndex = (currentIndex + 1) % speeds.length
    setSpeed(speeds[nextIndex])

    // Restart with new speed if currently playing
    if (isPlaying) {
      stop()
      setTimeout(() => play(), 100)
    }
  }

  if (!isSupported) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-3',
        'px-4 py-3 rounded-lg',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border)]'
      )}
    >
      {/* Play/Pause */}
      <button
        onClick={togglePlayPause}
        className={cn(
          'w-9 h-9 flex items-center justify-center rounded-full',
          'bg-[var(--color-accent)] text-white',
          'hover:bg-[var(--color-accent-hover)]',
          'transition-colors duration-200',
          'flex-shrink-0'
        )}
        aria-label={isPlaying && !isPaused ? dictionary.tts.pause : dictionary.tts.play}
      >
        {isPlaying && !isPaused ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--color-accent)] rounded-full"
          style={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Speed */}
      <button
        onClick={changeSpeed}
        className={cn(
          'px-2 py-1 rounded text-xs font-mono',
          'text-[var(--color-text-secondary)]',
          'hover:bg-[var(--color-highlight)]',
          'transition-colors duration-150',
          'flex-shrink-0'
        )}
        aria-label={dictionary.tts.speed}
      >
        {speed}×
      </button>

      {/* Stop */}
      {isPlaying && (
        <button
          onClick={stop}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-md',
            'text-[var(--color-text-tertiary)]',
            'hover:text-[var(--color-text-primary)]',
            'hover:bg-[var(--color-highlight)]',
            'transition-colors duration-150',
            'flex-shrink-0'
          )}
          aria-label={dictionary.tts.stop}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}