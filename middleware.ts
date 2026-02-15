import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'

// Routes that don't require authentication
const publicRoutes = ['/admin/login', '/']

/**
 * Basic token validation for middleware.
 * Checks format and expiration without cryptographic verification.
 * Full signature verification happens in server actions.
 */
function isTokenFormatValid(token: string): boolean {
  try {
    const parts = token.split(':')
    if (parts.length !== 3) return false

    const [randomId, expiresAtStr, signature] = parts
    if (!randomId || !expiresAtStr || !signature) return false

    // Check randomId is 64 hex chars (32 bytes)
    if (!/^[a-f0-9]{64}$/.test(randomId)) return false

    // Check expiration
    const expiresAt = parseInt(expiresAtStr, 10)
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false

    // Check signature is 64 hex chars (32 bytes SHA256)
    if (!/^[a-f0-9]{64}$/.test(signature)) return false

    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public routes and non-admin routes
  if (!pathname.startsWith('/admin') || publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for session cookie
  const session = request.cookies.get(SESSION_COOKIE_NAME)

  if (!session?.value || !isTokenFormatValid(session.value)) {
    // Redirect to login with safe redirect parameter
    const loginUrl = new URL('/admin/login', request.url)
    // Only allow admin routes as redirect targets
    if (pathname.startsWith('/admin')) {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
  ],
}
