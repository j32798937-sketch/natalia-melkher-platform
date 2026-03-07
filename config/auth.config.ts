/**
 * Authentication configuration
 */
export const authConfig = {
    /**
     * Secret key for JWT / session signing
     * MUST be changed in production
     */
    secret: process.env.AUTH_SECRET || 'change-this-in-production',
  
    /**
     * Session configuration
     */
    session: {
      /**
       * Maximum session age in seconds (default: 24 hours)
       */
      maxAge: Number(process.env.AUTH_SESSION_MAX_AGE) || 86400,
  
      /**
       * Cookie name for the session
       */
      cookieName: 'melkher-session',
  
      /**
       * Cookie settings
       */
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      },
    },
  
    /**
     * Password hashing
     */
    password: {
      /**
       * bcrypt salt rounds
       */
      saltRounds: 12,
  
      /**
       * Minimum password length
       */
      minLength: 8,
  
      /**
       * Maximum password length
       */
      maxLength: 128,
    },
  
    /**
     * Rate limiting for authentication attempts
     */
    rateLimit: {
      /**
       * Maximum login attempts before lockout
       */
      maxAttempts: 5,
  
      /**
       * Lockout window in milliseconds (15 minutes)
       */
      windowMs: 15 * 60 * 1000,
  
      /**
       * Lockout duration in milliseconds (30 minutes)
       */
      lockoutDurationMs: 30 * 60 * 1000,
    },
  
    /**
     * Default admin account (created on first run)
     */
    defaultAdmin: {
      username: process.env.ADMIN_USERNAME || 'natalia',
      email: process.env.ADMIN_EMAIL || 'admin@natalia-melkher.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    },
  
    /**
     * Protected route patterns
     */
    protectedRoutes: [
      '/cms',
      '/cms/(.*)',
      '/api/posts',
      '/api/categories',
      '/api/tags',
      '/api/media',
      '/api/ai/(.*)',
      '/api/analytics',
    ],
  
    /**
     * Public API routes (no auth required)
     */
    publicRoutes: [
      '/api/posts', // GET only
      '/api/search',
      '/api/seo/(.*)',
      '/api/auth/login',
      '/api/auth/session',
    ],
  } as const