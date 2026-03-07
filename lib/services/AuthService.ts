import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { queryOne, execute, queryAll } from '@/lib/database/index'
import { databaseConfig } from '@/config/database.config'
import { authConfig } from '@/config/auth.config'
import { cookies } from 'next/headers'

/**
 * Authentication Service
 *
 * Handles user authentication, session management,
 * and password hashing.
 */

/* ── Types ───────────────────────────────────────────── */

export interface User {
  id: number
  username: string
  email: string
  role: string
  avatar: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

interface UserWithPassword extends User {
  password: string
}

export interface SessionPayload extends JWTPayload {
  userId: number
  username: string
  role: string
}

/* ── Secret Key ──────────────────────────────────────── */

function getSecretKey(): Uint8Array {
  const secret = authConfig.secret
  return new TextEncoder().encode(secret)
}

/* ── Password Hashing ────────────────────────────────── */

/**
 * Hash a plaintext password
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, authConfig.password.saltRounds)
}

/**
 * Compare a plaintext password with a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

/* ── JWT Session Tokens ──────────────────────────────── */

/**
 * Create a signed JWT session token
 */
export async function createSessionToken(user: User): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${authConfig.session.maxAge}s`)
    .sign(getSecretKey())

  return token
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as SessionPayload
  } catch {
    return null
  }
}

/* ── Session Management ──────────────────────────────── */

/**
 * Create a session and set the cookie
 */
export async function createSession(user: User): Promise<string> {
  const token = await createSessionToken(user)

  // Store session in database
  const expiresAt = new Date(
    Date.now() + authConfig.session.maxAge * 1000
  ).toISOString()

  await execute(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
    [token.substring(token.length - 32), user.id, expiresAt]
  )

  return token
}

/**
 * Get current session from cookies
 */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(authConfig.session.cookieName)?.value

    if (!token) return null

    const payload = await verifySessionToken(token)
    if (!payload) return null

    return payload
  } catch {
    return null
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession()
  if (!session) return null

  return await getUserById(session.userId)
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(authConfig.session.cookieName)?.value

    if (token) {
      const sessionId = token.substring(token.length - 32)
      await execute(`DELETE FROM sessions WHERE id = ?`, [sessionId])
    }
  } catch {
    // Silent fail
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanExpiredSessions(): Promise<void> {
  const nowExpr = databaseConfig.provider === 'postgresql' ? 'NOW()' : "datetime('now')"
  await execute(
    `DELETE FROM sessions WHERE expires_at < ${nowExpr}`
  )
}

/* ── User Operations ─────────────────────────────────── */

/**
 * Authenticate a user by username and password
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  const user = await queryOne<UserWithPassword>(
    `SELECT * FROM users WHERE username = ? OR email = ?`,
    [username, username]
  )

  if (!user) return null

  const isValid = verifyPassword(password, user.password)
  if (!isValid) return null

  // Return user without password
  const { password: _, ...safeUser } = user
  return safeUser
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const user = await queryOne<UserWithPassword>(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  )

  if (!user) return null

  const { password: _, ...safeUser } = user
  return safeUser
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const user = await queryOne<UserWithPassword>(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  )

  if (!user) return null

  const { password: _, ...safeUser } = user
  return safeUser
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  id: number,
  data: Partial<{
    email: string
    avatar: string
    bio: string
  }>
): Promise<void> {
  const fields: string[] = []
  const params: unknown[] = []

  if (data.email !== undefined) {
    fields.push('email = ?')
    params.push(data.email)
  }
  if (data.avatar !== undefined) {
    fields.push('avatar = ?')
    params.push(data.avatar)
  }
  if (data.bio !== undefined) {
    fields.push('bio = ?')
    params.push(data.bio)
  }

  if (fields.length === 0) return

  params.push(id)
  await execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params)
}

/**
 * Change user password
 */
export async function changePassword(id: number, newPassword: string): Promise<void> {
  const hashed = hashPassword(newPassword)
  await execute(`UPDATE users SET password = ? WHERE id = ?`, [hashed, id])
}

/* ── Rate Limiting (Login Attempts) ──────────────────── */

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

/**
 * Check if login is rate limited for an IP/username
 */
export function isLoginRateLimited(key: string): boolean {
  const record = loginAttempts.get(key)
  if (!record) return false

  const now = Date.now()
  const windowExpired = now - record.lastAttempt > authConfig.rateLimit.windowMs

  if (windowExpired) {
    loginAttempts.delete(key)
    return false
  }

  return record.count >= authConfig.rateLimit.maxAttempts
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(key: string): void {
  const record = loginAttempts.get(key)
  const now = Date.now()

  if (!record || now - record.lastAttempt > authConfig.rateLimit.windowMs) {
    loginAttempts.set(key, { count: 1, lastAttempt: now })
  } else {
    record.count++
    record.lastAttempt = now
  }
}

/**
 * Clear login attempts for a key (after successful login)
 */
export function clearLoginAttempts(key: string): void {
  loginAttempts.delete(key)
}