import Link from 'next/link'
import { logout } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { getPendingFeedbackCount } from '@/lib/api/feedback'

async function handleLogout() {
  'use server'
  await logout()
  redirect('/admin/login')
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pendingCount = 0
  try {
    pendingCount = await getPendingFeedbackCount()
  } catch {
    // Silently fail - badge just won't show
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-border">
        <div className="max-w-page mx-auto px-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="text-xl font-semibold text-text-primary hover:text-primary transition-colors"
            >
              Matlosen Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Pending Products
              </Link>
              <Link
                href="/admin/feedback"
                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
              >
                Feedback
                {pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          <form action={handleLogout}>
            <button
              type="submit"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-page mx-auto px-container py-8">
        {children}
      </main>
    </div>
  )
}
