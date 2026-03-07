'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for persistent state using localStorage
 *
 * @param key - localStorage key
 * @param initialValue - Default value if nothing is stored
 * @returns [value, setValue, removeValue]
 *
 * @example
 * const [fontSize, setFontSize] = useLocalStorage('reading-font-size', 18)
 * const [bookmarks, setBookmarks] = useLocalStorage<string[]>('bookmarks', [])
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`[Melkher] Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Sync with localStorage when key changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item) as T)
      }
    } catch (error) {
      console.warn(`[Melkher] Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  // Set value
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value

          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }

          return valueToStore
        })
      } catch (error) {
        console.warn(`[Melkher] Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  // Remove value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`[Melkher] Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes in other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T)
        } catch {
          // Ignore parse errors
        }
      } else if (event.key === key && event.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}