'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useTheme } from '@/lib/hooks/useTheme'
import { Tooltip } from '@/components/ui/Tooltip'
import { READING } from '@/lib/utils/constants'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/utils/constants'

interface ReadingControlsProps {
  fontSize: number
  onFontSizeChange: (size: number) => void
  locale: Locale
  dictionary: Dictionary
  postContent: string
  postTitle: string
}

/**
 * Reading Controls Panel
 *
 * Provides font size adjustment, theme switching,
 * and TTS controls for the reading page.
 */
export function ReadingControls({
  fontSize,
  onFontSizeChange,
  locale,
  dictionary,
  postContent,
  postTitle,
}: ReadingControlsProps) {
  const { theme, setTheme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Font size handlers
  const decreaseFontSize = () => {
    const newSize = Math.max(READING.MIN_FONT_SIZE, fontSize - READING.FONT_SIZE_STEP)
    onFontSizeChange(newSize)
  }

  const increaseFontSize = () => {
    const newSize = Math.min(READING.MAX_FONT_SIZE, fontSize + READING.FONT_SIZE_STEP)
    onFontSizeChange(newSize)
  }

  // TTS handlers
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Strip HTML for speech
    const plainText = postContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

    const utterance = new SpeechSynthesisUtterance(plainText)

    const voiceMap: Record<string, string> = {
      ru: 'ru-RU',
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      cn: 'zh-CN',
      kr: 'ko-KR',
    }

    utterance.lang = voiceMap[locale] || 'ru-RU'
    utterance.rate = 0.9
    utterance.pitch = 1.0

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  // Share handler
  const handleShare = async () => {
    const shareData = {
      title: postTitle,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch {
      // User cancelled or error
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 flex-wrap',
        'px-3 py-2 rounded-lg',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border)]',
        'inline-flex'
      )}
    >
      {/* Font size controls */}
      <Tooltip content={dictionary.reading.fontSize} position="top">
        <div className="flex items-center gap-1">
          <button
            onClick={decreaseFontSize}
            disabled={fontSize <= READING.MIN_FONT_SIZE}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-md',
              'text-sm font-body',
              'text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-highlight)]',
              'hover:text-[var(--color-text-primary)]',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'transition-all duration-150'
            )}
            aria-label="Decrease font size"
          >
            A<span className="text-[0.6rem]">−</span>
          </button>

          <span className="w-8 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
            {fontSize}
          </span>

          <button
            onClick={increaseFontSize}
            disabled={fontSize >= READING.MAX_FONT_SIZE}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-md',
              'text-sm font-body',
              'text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-highlight)]',
              'hover:text-[var(--color-text-primary)]',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'transition-all duration-150'
            )}
            aria-label="Increase font size"
          >
            A<span className="text-[0.6rem]">+</span>
          </button>
        </div>
      </Tooltip>

      {/* Separator */}
      <div className="w-[1px] h-5 bg-[var(--color-border)] mx-1" />

      {/* Theme buttons */}
      <Tooltip content={dictionary.reading.theme} position="top">
        <div className="flex items-center gap-0.5">
          {(['light', 'dark', 'sepia'] as const).map((t) => {
            const colors: Record<string, string> = {
              light: '#FAFAF8',
              dark: '#0A0A0B',
              sepia: '#F4EEDB',
            }
            const labels: Record<string, string> = {
              light: dictionary.reading.themeLight,
              dark: dictionary.reading.themeDark,
              sepia: dictionary.reading.themeSepia,
            }

            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center',
                  'transition-all duration-200',
                  'border-2',
                  theme === t
                    ? 'border-[var(--color-accent)] scale-110'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent-light)]'
                )}
                aria-label={labels[t]}
                title={labels[t]}
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[t] }}
                />
              </button>
            )
          })}
        </div>
      </Tooltip>

      {/* Separator */}
      <div className="w-[1px] h-5 bg-[var(--color-border)] mx-1" />

      {/* TTS button */}
      <Tooltip
        content={isSpeaking ? dictionary.reading.stopListening : dictionary.reading.listen}
        position="top"
      >
        <button
          onClick={toggleSpeech}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-md',
            'transition-all duration-200',
            isSpeaking
              ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-highlight)] hover:text-[var(--color-text-primary)]'
          )}
          aria-label={isSpeaking ? dictionary.reading.stopListening : dictionary.reading.listen}
        >
          {isSpeaking ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
            </svg>
          )}
        </button>
      </Tooltip>

      {/* Share button */}
      <Tooltip content={dictionary.reading.share} position="top">
        <button
          onClick={handleShare}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-md',
            'text-[var(--color-text-secondary)]',
            'hover:bg-[var(--color-highlight)]',
            'hover:text-[var(--color-text-primary)]',
            'transition-all duration-200'
          )}
          aria-label={dictionary.reading.share}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </Tooltip>
    </div>
  )
}