'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import type { Theme } from '@/lib/config/site'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isLoaded: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'melkher-theme'
const THEME_CYCLE: Theme[] = ['light', 'dark', 'sepia']

/**
 * Get the CSS class for a theme
 */
function getThemeClass(theme: Theme): string {
  switch (theme) {
    case 'dark':
      return 'dark'
    case 'sepia':
      return 'sepia-theme'
    default:
      return ''
  }
}

/**
 * Apply theme to the document
 */
function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Remove all theme classes
  root.classList.remove('dark', 'sepia-theme')

  // Add the new theme class
  const themeClass = getThemeClass(theme)
  if (themeClass) {
    root.classList.add(themeClass)
  }

  // Set data attribute
  root.setAttribute('data-theme', theme)

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    const colors: Record<Theme, string> = {
      light: '#FAFAF8',
      dark: '#0A0A0B',
      sepia: '#F4EEDB',
    }
    metaThemeColor.setAttribute('content', colors[theme])
  }
}

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  // Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored && THEME_CYCLE.includes(stored)) {
    return stored
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

/**
 * Theme Provider Hook — use this in the ThemeProvider component
 */
export function useThemeProvider(): ThemeContextType {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme()
    setThemeState(initialTheme)
    applyThemeToDOM(initialTheme)
    setIsLoaded(true)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY)
      // Only auto-switch if user hasn't explicitly chosen a theme
      if (!stored) {
        const newTheme: Theme = e.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        applyThemeToDOM(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToDOM(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentIndex = THEME_CYCLE.indexOf(current)
      const nextIndex = (currentIndex + 1) % THEME_CYCLE.length
      const next = THEME_CYCLE[nextIndex]
      applyThemeToDOM(next)
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme, isLoaded }
}

/**
 * Theme Context Provider
 */
export { ThemeContext }

/**
 * Hook to use theme in any component
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}