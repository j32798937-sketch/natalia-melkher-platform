export const siteConfig = {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Наталья Мельхер',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'Литературная платформа — поэзия, проза, размышления',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    author: {
      name: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Наталья Мельхер',
      bio: 'Писатель, поэт, автор эссе и художественной прозы',
      social: {
        telegram: '',
        email: 'contact@natalia-melkher.com',
      },
    },
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ru',
    locales: ['ru', 'en', 'de', 'fr', 'cn', 'kr'] as const,
    localeNames: {
      ru: 'Русский',
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      cn: '中文',
      kr: '한국어',
    } as const,
    categories: [
      {
        id: 'poetry',
        icon: '✦',
        color: '#C4A882',
      },
      {
        id: 'prose',
        icon: '◈',
        color: '#8B7355',
      },
      {
        id: 'essays',
        icon: '◇',
        color: '#A6935F',
      },
      {
        id: 'reflections',
        icon: '○',
        color: '#7A6C5B',
      },
      {
        id: 'diary',
        icon: '△',
        color: '#65523B',
      },
    ],
    reading: {
      defaultFontSize: 18,
      minFontSize: 14,
      maxFontSize: 28,
      defaultTheme: 'light' as const,
      themes: ['light', 'dark', 'sepia'] as const,
    },
    pagination: {
      postsPerPage: 12,
      cmsPostsPerPage: 20,
    },
    upload: {
      maxSizeMB: Number(process.env.MAX_UPLOAD_SIZE_MB) || 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
      directory: process.env.UPLOAD_DIR || './public/uploads',
    },
    seo: {
      titleTemplate: '%s — Наталья Мельхер',
      defaultTitle: 'Наталья Мельхер — Литературная платформа',
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        siteName: 'Наталья Мельхер',
      },
      twitter: {
        cardType: 'summary_large_image',
      },
    },
  } as const
  
  export type Locale = (typeof siteConfig.locales)[number]
  export type Theme = (typeof siteConfig.reading.themes)[number]