'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/* ── Types ───────────────────────────────────────────── */

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

/* ── Context ─────────────────────────────────────────── */

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Hook to use toast notifications
 *
 * @example
 * const toast = useToast()
 * toast.success('Saved successfully')
 * toast.error('Something went wrong')
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/* ── Icons ───────────────────────────────────────────── */

const toastIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

/* ── Provider ────────────────────────────────────────── */

interface ToastProviderProps {
  children: React.ReactNode
  /** Maximum number of visible toasts */
  maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      const newToast: Toast = { id, message, type, duration }

      setToasts((prev) => {
        const updated = [...prev, newToast]
        // Keep only maxToasts
        if (updated.length > maxToasts) {
          const removed = updated.shift()
          if (removed) {
            const timer = timersRef.current.get(removed.id)
            if (timer) {
              clearTimeout(timer)
              timersRef.current.delete(removed.id)
            }
          }
        }
        return updated
      })

      // Auto-dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id)
        }, duration)
        timersRef.current.set(id, timer)
      }
    },
    [maxToasts, removeToast]
  )

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast]
  )

  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration ?? 6000),
    [showToast]
  )

  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast]
  )

  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast container */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-[200]',
          'flex flex-col-reverse gap-3',
          'pointer-events-none',
          'max-w-sm w-full'
        )}
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'pointer-events-auto',
                'flex items-start gap-3 px-4 py-3',
                'bg-[var(--color-background)]',
                'border border-[var(--color-border)]',
                'rounded-lg shadow-elevated',
                'text-sm'
              )}
              role="alert"
            >
              {/* Icon */}
              <span
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded-full',
                  'flex items-center justify-center',
                  'text-xs font-bold text-white',
                  toast.type === 'success' && 'bg-[var(--color-success)]',
                  toast.type === 'error' && 'bg-[var(--color-error)]',
                  toast.type === 'warning' && 'bg-[var(--color-warning)]',
                  toast.type === 'info' && 'bg-[var(--color-info)]'
                )}
                aria-hidden="true"
              >
                {toastIcons[toast.type]}
              </span>

              {/* Message */}
              <p className="flex-1 text-[var(--color-text-primary)] leading-snug">
                {toast.message}
              </p>

              {/* Close */}
              <button
                onClick={() => removeToast(toast.id)}
                className={cn(
                  'flex-shrink-0 p-0.5',
                  'text-[var(--color-text-tertiary)]',
                  'hover:text-[var(--color-text-primary)]',
                  'transition-colors duration-150'
                )}
                aria-label="Dismiss"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}