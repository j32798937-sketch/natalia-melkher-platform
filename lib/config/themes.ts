export interface ThemeColors {
    background: string
    surface: string
    textPrimary: string
    textSecondary: string
    accent: string
    accentLight: string
    border: string
    highlight: string
    shadow: string
  }
  
  export interface ThemeConfig {
    name: string
    label: string
    colors: ThemeColors
    cssClass: string
  }
  
  export const themes: Record<string, ThemeConfig> = {
    light: {
      name: 'light',
      label: 'Светлая',
      cssClass: '',
      colors: {
        background: '#FAFAF8',
        surface: '#F5F5F0',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B6B6B',
        accent: '#8B7355',
        accentLight: '#C4A882',
        border: '#E8E4DC',
        highlight: '#F0EBE0',
        shadow: 'rgba(0, 0, 0, 0.04)',
      },
    },
    dark: {
      name: 'dark',
      label: 'Тёмная',
      cssClass: 'dark',
      colors: {
        background: '#0A0A0B',
        surface: '#141416',
        textPrimary: '#EDEDEC',
        textSecondary: '#8A8A8A',
        accent: '#C4A882',
        accentLight: '#D4BE9C',
        border: '#2A2A2C',
        highlight: '#1E1E20',
        shadow: 'rgba(0, 0, 0, 0.3)',
      },
    },
    sepia: {
      name: 'sepia',
      label: 'Сепия',
      cssClass: 'sepia-theme',
      colors: {
        background: '#F4EEDB',
        surface: '#EDE7D4',
        textPrimary: '#3E3428',
        textSecondary: '#7A6C5B',
        accent: '#8B6914',
        accentLight: '#A6935F',
        border: '#D8CEAF',
        highlight: '#E5DDCA',
        shadow: 'rgba(62, 52, 40, 0.06)',
      },
    },
  }
  
  export const defaultTheme = 'light'
  
  export const themeTransitionDuration = 300
  
  export const cssVariablesFromTheme = (theme: ThemeConfig): Record<string, string> => {
    return {
      '--color-background': theme.colors.background,
      '--color-surface': theme.colors.surface,
      '--color-text-primary': theme.colors.textPrimary,
      '--color-text-secondary': theme.colors.textSecondary,
      '--color-accent': theme.colors.accent,
      '--color-accent-light': theme.colors.accentLight,
      '--color-border': theme.colors.border,
      '--color-highlight': theme.colors.highlight,
      '--color-shadow': theme.colors.shadow,
    }
  }