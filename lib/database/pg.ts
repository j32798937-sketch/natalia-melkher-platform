import { Pool, PoolClient } from 'pg'
import { AsyncLocalStorage } from 'async_hooks'
import { databaseConfig } from '@/config/database.config'

/**
 * PostgreSQL connection pool for serverless (Vercel)
 */
let pool: Pool | null = null

/** Current transaction client (when inside pgTransaction) */
const txClientStorage = new AsyncLocalStorage<PoolClient>()

function getPool(): Pool {
  if (pool) return pool

  const connStr = databaseConfig.postgresql.connectionString
  if (!connStr) {
    throw new Error('[Melkher] DATABASE_URL is required for PostgreSQL')
  }

  pool = new Pool({
    connectionString: connStr,
    ssl: databaseConfig.postgresql.ssl ? { rejectUnauthorized: false } : false,
    max: databaseConfig.postgresql.maxConnections,
    idleTimeoutMillis: databaseConfig.postgresql.idleTimeoutMs,
  })

  console.log('[Melkher] PostgreSQL pool created')
  return pool
}

async function getClient(): Promise<PoolClient> {
  const tx = txClientStorage.getStore()
  if (tx) return tx
  return getPool().connect()
}

function releaseClient(client: PoolClient): void {
  if (!txClientStorage.getStore()) {
    client.release()
  }
}

/** Convert ? placeholders to $1, $2, ... */
function toPgPlaceholders(sql: string, params: unknown[]): string {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

export interface PgExecuteResult {
  changes: number
  lastInsertRowid?: number
}

/**
 * Execute a query and return all rows
 */
export async function pgQueryAll<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const pgSql = toPgPlaceholders(sql, params)
  const client = await getClient()
  try {
    const res = await client.query(pgSql, params)
    return (res.rows || []) as T[]
  } finally {
    releaseClient(client)
  }
}

/**
 * Execute a query and return the first row
 */
export async function pgQueryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  const rows = await pgQueryAll<T>(sql, params)
  return rows[0]
}

/**
 * Execute an INSERT/UPDATE/DELETE
 * When getInsertId is true (for INSERT), appends RETURNING id and returns it
 */
export async function pgExecute(
  sql: string,
  params: unknown[] = [],
  options?: { getInsertId?: boolean }
): Promise<PgExecuteResult> {
  let runSql = sql
  if (options?.getInsertId && /^\s*INSERT\s+INTO/i.test(sql) && !/RETURNING\s+/i.test(sql)) {
    runSql = sql.replace(/;?\s*$/, '') + ' RETURNING id'
  }

  const pgSql = toPgPlaceholders(runSql, params)
  const client = await getClient()
  try {
    const res = await client.query(pgSql, params)
    const changes = res.rowCount ?? 0
    let lastInsertRowid: number | undefined
    if (options?.getInsertId && res.rows?.[0] && 'id' in res.rows[0]) {
      lastInsertRowid = Number((res.rows[0] as { id: number }).id)
    }
    return { changes, lastInsertRowid }
  } finally {
    releaseClient(client)
  }
}

/**
 * Run multiple statements in a transaction
 */
export async function pgTransaction<T>(fn: () => Promise<T>): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await txClientStorage.run(client, () => fn())
    await client.query('COMMIT')
    return result
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

/**
 * Run a raw SQL script (multiple statements)
 * Handles $$...$$ dollar-quoted strings (e.g. in CREATE FUNCTION)
 */
export async function pgExecScript(sql: string): Promise<void> {
  const statements: string[] = []
  let current = ''
  let inDollarQuote = false
  let i = 0
  while (i < sql.length) {
    if (inDollarQuote) {
      const end = sql.indexOf('$$', i)
      if (end === -1) {
        current += sql.slice(i)
        break
      }
      current += sql.slice(i, end + 2)
      i = end + 2
      inDollarQuote = false
    } else if (sql.slice(i, i + 2) === '$$') {
      current += '$$'
      i += 2
      inDollarQuote = true
    } else if (sql[i] === ';') {
      const stmt = current.trim()
      if (stmt && !stmt.startsWith('--')) statements.push(stmt + ';')
      current = ''
      i++
    } else {
      current += sql[i]
      i++
    }
  }
  const stmt = current.trim()
  if (stmt && !stmt.startsWith('--')) statements.push(stmt + (stmt.endsWith(';') ? '' : ';'))

  const client = await getClient()
  try {
    for (const s of statements) {
      if (s) await client.query(s)
    }
  } finally {
    releaseClient(client)
  }
}

/** Close the pool (e.g. on process exit) */
export function closePgPool(): void {
  if (pool) {
    pool.end()
    pool = null
    console.log('[Melkher] PostgreSQL pool closed')
  }
}
