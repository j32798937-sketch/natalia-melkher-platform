import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { databaseConfig } from '@/config/database.config'
import {
  pgQueryAll,
  pgQueryOne,
  pgExecute,
  pgTransaction,
  pgExecScript,
  closePgPool,
} from '@/lib/database/pg'

const isPostgres = databaseConfig.provider === 'postgresql'

/**
 * Database Connection Manager
 *
 * Supports SQLite (development) and PostgreSQL (Vercel/production).
 * Use async API: queryAll, queryOne, execute, transaction.
 */

let dbInstance: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (dbInstance) return dbInstance

  const dbPath = databaseConfig.sqlite.filename
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  dbInstance = new Database(dbPath)

  if (databaseConfig.sqlite.walMode) {
    dbInstance.pragma('journal_mode = WAL')
  }
  if (databaseConfig.sqlite.foreignKeys) {
    dbInstance.pragma('foreign_keys = ON')
  }
  dbInstance.pragma(`busy_timeout = ${databaseConfig.sqlite.busyTimeout}`)
  dbInstance.pragma(`journal_size_limit = ${databaseConfig.sqlite.journalSizeLimit}`)
  dbInstance.pragma('synchronous = NORMAL')
  dbInstance.pragma('cache_size = -64000')
  dbInstance.pragma('temp_store = MEMORY')

  console.log('[Melkher] Database connected (SQLite):', dbPath)
  return dbInstance
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
    console.log('[Melkher] SQLite connection closed')
  }
  if (isPostgres) {
    closePgPool()
  }
}

/** Execute a query and return all results */
export async function queryAll<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  if (isPostgres) return pgQueryAll<T>(sql, params)
  const db = getDatabase()
  const stmt = db.prepare(sql)
  return Promise.resolve(stmt.all(...params) as T[])
}

/** Execute a query and return the first result */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  if (isPostgres) return pgQueryOne<T>(sql, params)
  const db = getDatabase()
  const stmt = db.prepare(sql)
  return Promise.resolve(stmt.get(...params) as T | undefined)
}

/** Execute INSERT/UPDATE/DELETE. Use getInsertId: true for INSERT to get new id. */
export async function execute(
  sql: string,
  params: unknown[] = [],
  options?: { getInsertId?: boolean }
): Promise<{ changes: number; lastInsertRowid?: number }> {
  if (isPostgres) {
    const res = await pgExecute(sql, params, options)
    return res
  }
  const db = getDatabase()
  const stmt = db.prepare(sql)
  const result = stmt.run(...params)
  return Promise.resolve({
    changes: result.changes,
    lastInsertRowid: result.lastInsertRowid as number | undefined,
  })
}

/** Execute multiple statements in a transaction */
export async function transaction<T>(
  fn: () => T | Promise<T>
): Promise<T> {
  if (isPostgres) {
    return pgTransaction(async () => fn())
  }
  const db = getDatabase()
  const transactionFn = db.transaction(() => fn())
  return Promise.resolve(transactionFn())
}

/** Check if a table exists */
export async function tableExists(tableName: string): Promise<boolean> {
  if (isPostgres) {
    const row = await pgQueryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [tableName]
    )
    return Number(row?.count ?? 0) > 0
  }
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName]
  )
  return (result?.count ?? 0) > 0
}

/** Get the count of rows in a table */
export async function getTableCount(tableName: string): Promise<number> {
  const result = await queryOne<{ count: number | string }>(
    isPostgres
      ? `SELECT COUNT(*) as count FROM "${tableName}"`
      : `SELECT COUNT(*) as count FROM "${tableName}"`,
    []
  )
  return Number(result?.count ?? 0)
}

/** Run a raw SQL script (for migrations / schema) */
export async function execScript(sql: string): Promise<void> {
  if (isPostgres) {
    return pgExecScript(sql)
  }
  const db = getDatabase()
  db.exec(sql)
  return Promise.resolve()
}

// Process exit handlers
if (typeof process !== 'undefined') {
  process.on('exit', () => closeDatabase())
  process.on('SIGINT', () => {
    closeDatabase()
    process.exit(0)
  })
  process.on('SIGTERM', () => {
    closeDatabase()
    process.exit(0)
  })
}
