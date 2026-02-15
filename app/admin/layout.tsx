import Link from 'next/link'
import { logout } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

async function handleLogout() {
  'use server'
  await logout()
  redirect('/admin/login')
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
