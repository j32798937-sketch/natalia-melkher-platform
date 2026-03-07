'use client'

import React from 'react'
import { ThemeContext, useThemeProvider } from '@/lib/hooks/useTheme'

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * Theme Provider Component
 *
 * Wraps the application and provides theme context
 * to all child components via useTheme() hook.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useThemeProvider()

  return (
    <ThemeContext.Provider value={themeValue}>
      {/* Prevent flash of unstyled content before theme loads */}
      <div
        style={{
          visibility: themeValue.isLoaded ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}