import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'

// Routes that don't require authentication
const publicRoutes = ['/admin/login', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public routes and non-admin routes
  if (!pathname.startsWith('/admin') || publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for session cookie
  const session = request.cookies.get(SESSION_COOKIE_NAME)

  if (!session?.value) {
    // Redirect to login
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
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
