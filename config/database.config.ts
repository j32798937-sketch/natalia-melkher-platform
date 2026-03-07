import path from 'path'

/**
 * Database configuration
 */
export const databaseConfig = {
  /**
   * Database provider: 'sqlite' or 'postgresql'
   */
  provider: (process.env.DATABASE_PROVIDER || (process.env.DATABASE_URL?.startsWith('postgres') ? 'postgresql' : 'sqlite')) as 'sqlite' | 'postgresql',

  /**
   * SQLite configuration
   */
  sqlite: {
    /**
     * Path to the SQLite database file
     */
    filename: process.env.DATABASE_URL?.replace('file:', '') ||
      path.join(process.cwd(), 'database', 'melkher.db'),

    /**
     * Enable WAL mode for better concurrent read performance
     */
    walMode: true,

    /**
     * Enable foreign keys
     */
    foreignKeys: true,

    /**
     * Journal size limit in bytes (-1 for unlimited)
     */
    journalSizeLimit: 64 * 1024 * 1024, // 64MB

    /**
     * Busy timeout in milliseconds
     */
    busyTimeout: 5000,
  },

  /**
   * PostgreSQL configuration (for production)
   */
  postgresql: {
    connectionString: process.env.DATABASE_URL || '',
    ssl: process.env.NODE_ENV === 'production',
    maxConnections: 10,
    idleTimeoutMs: 30000,
  },

  /**
   * Migration settings
   */
  migrations: {
    /**
     * Directory for migration files
     */
    directory: path.join(process.cwd(), 'lib', 'database'),

    /**
     * Auto-run migrations on startup
     */
    autoRun: true,
  },

  /**
   * Seed settings
   */
  seed: {
    /**
     * Auto-seed on first run (when database is empty)
     */
    autoSeed: true,
  },
} as const

export type DatabaseProvider = typeof databaseConfig.provider