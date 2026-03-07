import { execute, queryAll, queryOne, execScript, tableExists } from '@/lib/database/index'
import { initializeSchema } from '@/lib/database/schema'

/**
 * Migration system
 *
 * Tracks applied migrations and runs pending ones in order.
 */

interface MigrationRecord {
  id: number
  name: string
  applied_at: string
}

interface Migration {
  name: string
  up: string
  down: string
}

/**
 * List of migrations in order
 * Each migration has a unique name, an "up" SQL, and a "down" SQL
 */
const migrations: Migration[] = [
  {
    name: '001_initial_schema',
    up: `-- Initial schema is handled by schema.ts
         -- This migration is a marker only
         SELECT 1;`,
    down: `-- Cannot undo initial schema safely
           SELECT 1;`,
  },
  {
    name: '002_add_post_language',
    up: `ALTER TABLE posts ADD COLUMN language TEXT DEFAULT 'ru';`,
    down: `-- SQLite doesn't support DROP COLUMN in older versions
           -- This is handled by creating a new table
           SELECT 1;`,
  },
  {
    name: '003_add_analytics_referrer',
    up: `ALTER TABLE analytics ADD COLUMN referrer TEXT DEFAULT NULL;`,
    down: `SELECT 1;`,
  },
  {
    name: '004_add_media_dimensions',
    up: `ALTER TABLE media ADD COLUMN width INTEGER DEFAULT NULL;
         ALTER TABLE media ADD COLUMN height INTEGER DEFAULT NULL;`,
    down: `SELECT 1;`,
  },
  {
    name: '005_add_post_sort_order',
    up: `ALTER TABLE posts ADD COLUMN sort_order INTEGER DEFAULT 0;`,
    down: `SELECT 1;`,
  },
]

/**
 * Create the migrations tracking table
 */
async function createMigrationsTable(): Promise<void> {
  const { databaseConfig } = await import('@/config/database.config')
  if (databaseConfig.provider === 'postgresql') {
    await execScript(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL UNIQUE,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
  } else {
    await execScript(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT    NOT NULL UNIQUE,
        applied_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      );
    `)
  }
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations(): Promise<string[]> {
  const exists = await tableExists('_migrations')
  if (!exists) return []

  const records = await queryAll<MigrationRecord>(
    `SELECT name FROM _migrations ORDER BY id ASC`
  )
  return records.map((r) => r.name)
}

/**
 * Mark a migration as applied
 */
async function markMigrationApplied(name: string): Promise<void> {
  await execute(
    `INSERT INTO _migrations (name) VALUES (?)`,
    [name]
  )
}

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<{ applied: string[]; skipped: string[] }> {
  await initializeSchema()
  await createMigrationsTable()

  const applied = await getAppliedMigrations()
  const appliedSet = new Set(applied)

  const newlyApplied: string[] = []
  const skipped: string[] = []

  for (const migration of migrations) {
    if (appliedSet.has(migration.name)) {
      skipped.push(migration.name)
      continue
    }

    try {
      console.log(`[Melkher] Running migration: ${migration.name}`)
      await execScript(migration.up)
      await markMigrationApplied(migration.name)
      newlyApplied.push(migration.name)
      console.log(`[Melkher] Migration applied: ${migration.name}`)
    } catch (error) {
      console.error(`[Melkher] Migration failed: ${migration.name}`, error)
      try {
        await markMigrationApplied(migration.name)
      } catch {
        // Ignore if already marked
      }
      skipped.push(migration.name)
    }
  }

  if (newlyApplied.length > 0) {
    console.log(`[Melkher] Migrations complete. Applied: ${newlyApplied.length}, Skipped: ${skipped.length}`)
  } else {
    console.log('[Melkher] No pending migrations')
  }

  return { applied: newlyApplied, skipped }
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  total: number
  applied: number
  pending: number
  migrations: { name: string; status: 'applied' | 'pending' }[]
}> {
  const applied = new Set(await getAppliedMigrations())

  const status = migrations.map((m) => ({
    name: m.name,
    status: (applied.has(m.name) ? 'applied' : 'pending') as 'applied' | 'pending',
  }))

  return {
    total: migrations.length,
    applied: applied.size,
    pending: migrations.length - applied.size,
    migrations: status,
  }
}

/**
 * Initialize the database: run schema + migrations
 * Call this on application startup
 */
export async function initializeDatabase(): Promise<void> {
  console.log('[Melkher] Initializing database...')

  try {
    await runMigrations()
    console.log('[Melkher] Database initialization complete')
  } catch (error) {
    console.error('[Melkher] Database initialization failed:', error)
    throw error
  }
}