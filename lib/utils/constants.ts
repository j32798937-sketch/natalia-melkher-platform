/**
 * Application-wide constants
 */

// ── Post Types ──────────────────────────────────────────
export const POST_TYPES = {
    POETRY: 'poetry',
    PROSE: 'prose',
    ESSAY: 'essay',
    REFLECTION: 'reflection',
    DIARY: 'diary',
  } as const
  
  export type PostType = (typeof POST_TYPES)[keyof typeof POST_TYPES]
  
  // ── Post Statuses ───────────────────────────────────────
  export const POST_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  } as const
  
  export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS]
  
  // ── User Roles ──────────────────────────────────────────
  export const USER_ROLES = {
    ADMIN: 'admin',
    AUTHOR: 'author',
  } as const
  
  export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
  
  // ── Supported Locales ───────────────────────────────────
  export const LOCALES = ['ru', 'en', 'de', 'fr', 'cn', 'kr'] as const
  export type Locale = (typeof LOCALES)[number]
  
  export const DEFAULT_LOCALE: Locale = 'ru'
  
  export const LOCALE_NAMES: Record<Locale, string> = {
    ru: 'Русский',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    cn: '中文',
    kr: '한국어',
  }
  
  export const LOCALE_FLAGS: Record<Locale, string> = {
    ru: '🇷🇺',
    en: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    cn: '🇨🇳',
    kr: '🇰🇷',
  }
  
  // ── Reading Settings ────────────────────────────────────
  export const READING = {
    DEFAULT_FONT_SIZE: 18,
    MIN_FONT_SIZE: 14,
    MAX_FONT_SIZE: 28,
    FONT_SIZE_STEP: 2,
    DEFAULT_THEME: 'light' as const,
    WORDS_PER_MINUTE: 200,
  } as const
  
  // ── Pagination ──────────────────────────────────────────
  export const PAGINATION = {
    POSTS_PER_PAGE: 12,
    CMS_POSTS_PER_PAGE: 20,
    MAX_PAGE_SIZE: 50,
  } as const
  
  // ── Upload Constraints ──────────────────────────────────
  export const UPLOAD = {
    MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ] as const,
    MAX_FILENAME_LENGTH: 255,
  } as const
  
  // ── API Rate Limiting ───────────────────────────────────
  export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    AUTH_MAX_ATTEMPTS: 5,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  } as const
  
  // ── Animation Durations (ms) ────────────────────────────
  export const ANIMATION = {
    FAST: 200,
    NORMAL: 400,
    SLOW: 600,
    VERY_SLOW: 800,
    PAGE_TRANSITION: 600,
    TEXT_REVEAL: 1200,
    THEME_SWITCH: 300,
  } as const
  
  // ── Breakpoints (px) ───────────────────────────────────
  export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  } as const
  
  // ── Category Icons ──────────────────────────────────────
  export const CATEGORY_ICONS: Record<string, string> = {
    poetry: '✦',
    prose: '◈',
    essays: '◇',
    reflections: '○',
    diary: '△',
  }

  /** Symbols before publication titles (emoji-like) */
  export const TITLE_SYMBOLS: Record<string, string> = {
    poetry: '✨',
    prose: '◈',
    essays: '◇',
    reflections: '○',
    diary: '△',
  }
  
  // ── Meta Defaults ───────────────────────────────────────
  export const META = {
    TITLE_SEPARATOR: ' — ',
    DEFAULT_OG_IMAGE: '/images/og/default.jpg',
    MAX_TITLE_LENGTH: 60,
    MAX_DESCRIPTION_LENGTH: 160,
  } as const
  
  // ── Session ─────────────────────────────────────────────
  export const SESSION = {
    COOKIE_NAME: 'melkher-session',
    MAX_AGE: 24 * 60 * 60, // 24 hours in seconds
  } as const