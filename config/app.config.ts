/**
 * Application-wide configuration
 */
export const appConfig = {
    /**
     * Application name
     */
    name: 'Natalia Melkher Platform',
  
    /**
     * Version
     */
    version: '1.0.0',
  
    /**
     * Environment
     */
    env: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  
    /**
     * Is production environment
     */
    isProduction: process.env.NODE_ENV === 'production',
  
    /**
     * Is development environment
     */
    isDevelopment: process.env.NODE_ENV !== 'production',
  
    /**
     * API configuration
     */
    api: {
      /**
       * Base API path
       */
      basePath: '/api',
  
      /**
       * Default response format
       */
      defaultFormat: 'json',
  
      /**
       * Enable API logging in development
       */
      logging: process.env.NODE_ENV !== 'production',
  
      /**
       * Rate limiting
       */
      rateLimit: {
        enabled: true,
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      },
  
      /**
       * CORS settings
       */
      cors: {
        allowedOrigins: [
          process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        ],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400,
      },
    },
  
    /**
     * Text-to-Speech configuration
     */
    tts: {
      /**
       * TTS provider: 'browser' or 'openai'
       */
      provider: (process.env.TTS_PROVIDER || 'browser') as 'browser' | 'openai',
  
      /**
       * OpenAI TTS settings
       */
      openai: {
        voice: process.env.TTS_OPENAI_VOICE || 'alloy',
        model: 'tts-1',
        speed: 1.0,
      },
  
      /**
       * Browser TTS settings
       */
      browser: {
        defaultRate: 0.9,
        defaultPitch: 1.0,
        defaultVolume: 1.0,
      },
  
      /**
       * Language-voice mapping for browser TTS
       */
      voiceMap: {
        ru: 'ru-RU',
        en: 'en-US',
        de: 'de-DE',
        fr: 'fr-FR',
        cn: 'zh-CN',
        kr: 'ko-KR',
      } as Record<string, string>,
    },
  
    /**
     * Analytics configuration
     */
    analytics: {
      enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
      trackPageViews: true,
      trackReadingTime: true,
      trackLocale: true,
      anonymizeIp: true,
    },
  
    /**
     * Cache configuration
     */
    cache: {
      /**
       * Static page revalidation time in seconds
       */
      revalidate: {
        home: 60,           // 1 minute
        library: 60,        // 1 minute
        post: 300,          // 5 minutes
        about: 3600,        // 1 hour
        sitemap: 3600,      // 1 hour
      },
  
      /**
       * API response cache headers
       */
      api: {
        public: 'public, s-maxage=60, stale-while-revalidate=300',
        private: 'private, no-cache, no-store, must-revalidate',
      },
    },
  
    /**
     * Logging configuration
     */
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      prefix: '[Melkher]',
    },
  
    /**
     * Feature flags
     */
    features: {
      /**
       * Enable AI features
       */
      ai: true,
  
      /**
       * Enable Text-to-Speech
       */
      tts: true,
  
      /**
       * Enable WebGL effects
       */
      webgl: true,
  
      /**
       * Enable analytics tracking
       */
      analytics: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  
      /**
       * Enable multilingual support
       */
      i18n: true,
  
      /**
       * Enable search functionality
       */
      search: true,
  
      /**
       * Enable dark mode
       */
      darkMode: true,
  
      /**
       * Enable sepia reading mode
       */
      sepiaMode: true,
    },
  } as const
  
  export type AppEnvironment = typeof appConfig.env