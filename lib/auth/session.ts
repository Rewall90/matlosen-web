'use server'

import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Verify the admin password and create a session
 */
export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return { success: false, error: 'Admin password not configured' }
  }

  if (password !== adminPassword) {
    return { success: false, error: 'Invalid password' }
  }

  // Create session token (simple timestamp-based for now)
  const token = Buffer.from(`admin:${Date.now()}`).toString('base64')

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
 * Check if there is a valid admin session
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  return !!session?.value
}

/**
 * Get the session token (for middleware)
 */
export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME
}
