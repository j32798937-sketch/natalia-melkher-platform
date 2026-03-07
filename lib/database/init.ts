import { initializeDatabase } from '@/lib/database/migrations'
import { seedDatabase } from '@/lib/database/seed'
import { getTableCount } from '@/lib/database/index'

/**
 * Database initialization singleton
 *
 * Ensures the database is initialized only once,
 * even if called from multiple server components.
 */

let isInitialized = false

export async function ensureDatabaseReady(): Promise<void> {
  if (isInitialized) return

  try {
    await initializeDatabase()

    const userCount = await getTableCount('users')
    if (userCount === 0) {
      await seedDatabase()
    }

    isInitialized = true
  } catch (error) {
    console.error('[Melkher] Database initialization error:', error)
    // Don't set isInitialized to true so it retries next time
  }
}