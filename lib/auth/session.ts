'use server'

import { cookies } from 'next/headers'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE * 1000

/**
 * Get the secret key for signing tokens.
 * Uses ADMIN_PASSWORD as the secret - in production, use a separate SESSION_SECRET.
 */
function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error('ADMIN_PASSWORD not configured')
  }
  return secret
}

/**
 * Create a signed session token.
 * Format: randomId:expiresAt:signature
 */
function createToken(): string {
  const randomId = randomBytes(32).toString('hex')
  const expiresAt = Date.now() + SESSION_MAX_AGE_MS
  const payload = `${randomId}:${expiresAt}`

  const signature = createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex')

  return `${payload}:${signature}`
}

/**
 * Verify a session token is valid and not expired.
 */
function verifyToken(token: string): boolean {
  try {
    const parts = token.split(':')
    if (parts.length !== 3) return false

    const [randomId, expiresAtStr, providedSignature] = parts
    const expiresAt = parseInt(expiresAtStr, 10)

    // Check expiration
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false
    }

    // Verify signature
    const payload = `${randomId}:${expiresAtStr}`
    const expectedSignature = createHmac('sha256', getSecret())
      .update(payload)
      .digest('hex')

    // Use constant-time comparison to prevent timing attacks
    const providedBuffer = Buffer.from(providedSignature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (providedBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(providedBuffer, expectedBuffer)
  } catch {
    return false
  }
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)

    if (bufA.length !== bufB.length) {
      // Still do the comparison to maintain constant time
      timingSafeEqual(bufA, bufA)
      return false
    }

    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

/**
 * Verify the admin password and create a session
 */
export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return { success: false, error: 'Admin password not configured' }
  }

  // Use constant-time comparison to prevent timing attacks
  if (!secureCompare(password, adminPassword)) {
    return { success: false, error: 'Invalid password' }
  }

  // Create cryptographically secure signed token
  const token = createToken()

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return { success: true }
}

/**
 * End the admin session
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Check if there is a valid admin session.
 * Returns the session info if valid, null otherwise.
 */
export async function getSession(): Promise<{ authenticated: true } | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)

  if (!session?.value) {
    return null
  }

  if (!verifyToken(session.value)) {
    return null
  }

  return { authenticated: true }
}

/**
 * Check if there is a valid admin session (boolean helper)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Require authentication - throws if not authenticated.
 * Use this in server actions that need auth.
 */
export async function requireAuth(): Promise<void> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized: Admin authentication required')
  }
}
