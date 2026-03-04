# Product Feedback Admin Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/admin/feedback` page that lists user-submitted product feedback with status filtering and resolve/dismiss actions.

**Architecture:** New Supabase table `product_feedback` with RLS. Server actions in `lib/api/feedback.ts` using the existing `requireAuth()` + `createAdminClient()` pattern. Server component page with URL search param filtering. Nav badge showing pending count.

**Tech Stack:** Next.js 14 App Router, Supabase (service role), Tailwind CSS, Zod validation

---

### Task 1: Create the database table and RLS policies

**Files:**
- Database migration (via Supabase MCP)

**Step 1: Apply the migration**

Use `mcp__supabase__apply_migration` with name `create_product_feedback` and this SQL:

```sql
CREATE TABLE product_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_gtin TEXT NOT NULL REFERENCES products(gtin),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL CHECK (char_length(message) <= 2000),
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_feedback_status ON product_feedback(status);
CREATE INDEX idx_product_feedback_gtin ON product_feedback(product_gtin);
CREATE INDEX idx_product_feedback_created_at ON product_feedback(created_at DESC);

ALTER TABLE product_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON product_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own feedback"
  ON product_feedback FOR SELECT
  USING (auth.uid() = user_id);
```

**Step 2: Verify table exists**

Use `mcp__supabase__execute_sql`:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'product_feedback' ORDER BY ordinal_position;
```

Expected: 6 columns (id, product_gtin, user_id, message, image_url, status, created_at).

**Step 3: Commit**

No file commit needed — migration lives in Supabase.

---

### Task 2: Create TypeScript types

**Files:**
- Create: `types/feedback.ts`

**Step 1: Create the types file**

```typescript
export type FeedbackStatus = 'pending' | 'resolved' | 'dismissed'

export type FeedbackItem = {
  id: string
  product_gtin: string
  product_name: string // joined from products table
  user_id: string
  message: string
  image_url: string | null
  status: FeedbackStatus
  created_at: string
}
```

**Step 2: Commit**

```bash
git add types/feedback.ts
git commit -m "feat: add product feedback types"
```

---

### Task 3: Create server actions

**Files:**
- Create: `lib/api/feedback.ts`
- Reference: `lib/api/products.ts` (for pattern), `lib/auth/session.ts` (for `requireAuth`), `lib/supabase/admin.ts` (for `createAdminClient`)

**Step 1: Create the feedback API file**

```typescript
'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/auth/session'
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback'

const feedbackIdSchema = z.string().uuid('Invalid feedback ID')
const feedbackStatusSchema = z.enum(['pending', 'resolved', 'dismissed'])

/**
 * Get feedback items, optionally filtered by status.
 * Joins product name from the products table.
 */
export async function getFeedback(status?: FeedbackStatus): Promise<FeedbackItem[]> {
  await requireAuth()

  const supabase = createAdminClient()

  let query = supabase
    .from('product_feedback')
    .select('id, product_gtin, user_id, message, image_url, status, created_at, products(name)')
    .order('created_at', { ascending: false })

  if (status) {
    feedbackStatusSchema.parse(status)
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`)
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    product_gtin: row.product_gtin as string,
    product_name: (row.products as { name: string } | null)?.name ?? 'Unknown product',
    user_id: row.user_id as string,
    message: row.message as string,
    image_url: row.image_url as string | null,
    status: row.status as FeedbackStatus,
    created_at: row.created_at as string,
  }))
}

/**
 * Update the status of a feedback item.
 */
export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<void> {
  await requireAuth()

  const validatedId = feedbackIdSchema.parse(id)
  const validatedStatus = feedbackStatusSchema.parse(status)

  const supabase = createAdminClient()

  const { error, data: updatedRows } = await supabase
    .from('product_feedback')
    .update({ status: validatedStatus })
    .eq('id', validatedId)
    .select('id')

  if (error) {
    throw new Error(`Failed to update feedback: ${error.message}`)
  }

  if (!updatedRows || updatedRows.length === 0) {
    throw new Error(`Feedback not found: ${validatedId}`)
  }
}

/**
 * Get count of pending feedback for the nav badge.
 */
export async function getPendingFeedbackCount(): Promise<number> {
  await requireAuth()

  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from('product_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) {
    throw new Error(`Failed to count feedback: ${error.message}`)
  }

  return count ?? 0
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors.

**Step 3: Commit**

```bash
git add lib/api/feedback.ts
git commit -m "feat: add feedback server actions"
```

---

### Task 4: Create the feedback list page

**Files:**
- Create: `app/admin/feedback/page.tsx`
- Reference: `app/admin/page.tsx` (for pattern)

**Step 1: Create the feedback page**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { getFeedback, updateFeedbackStatus } from '@/lib/api/feedback'
import { revalidatePath } from 'next/cache'
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback'

const STATUS_FILTERS: { label: string; value: FeedbackStatus | 'all' }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Ventende', value: 'pending' },
  { label: 'Løst', value: 'resolved' },
  { label: 'Avvist', value: 'dismissed' },
]

const statusColors: Record<FeedbackStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-600',
}

const statusLabels: Record<FeedbackStatus, string> = {
  pending: 'Ventende',
  resolved: 'Løst',
  dismissed: 'Avvist',
}

function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  )
}

function FeedbackRow({ item }: { item: FeedbackItem }) {
  async function handleResolve() {
    'use server'
    await updateFeedbackStatus(item.id, 'resolved')
    revalidatePath('/admin/feedback')
  }

  async function handleDismiss() {
    'use server'
    await updateFeedbackStatus(item.id, 'dismissed')
    revalidatePath('/admin/feedback')
  }

  async function handleReopen() {
    'use server'
    await updateFeedbackStatus(item.id, 'pending')
    revalidatePath('/admin/feedback')
  }

  const isPending = item.status === 'pending'

  return (
    <div className="bg-surface-elevated rounded-card shadow-card p-4">
      <div className="flex gap-4">
        {/* Image thumbnail */}
        {item.image_url && (
          <a
            href={item.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden relative">
              <Image
                src={item.image_url}
                alt="Feedback image"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          </a>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-text-primary text-sm">
              {item.product_name}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-sm text-text-secondary line-clamp-2">
            {item.message}
          </p>
          <p className="text-xs text-text-muted mt-1">
            GTIN: {item.product_gtin} &middot;{' '}
            {new Date(item.created_at).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-start gap-2 flex-shrink-0">
          {isPending ? (
            <>
              <form action={handleResolve}>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-button hover:bg-green-700 transition-colors duration-default"
                >
                  Løs
                </button>
              </form>
              <form action={handleDismiss}>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-surface text-text-secondary border border-border rounded-button hover:bg-gray-100 transition-colors duration-default"
                >
                  Avvis
                </button>
              </form>
            </>
          ) : (
            <form action={handleReopen}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium bg-surface text-text-secondary border border-border rounded-button hover:bg-gray-100 transition-colors duration-default"
              >
                Gjenåpne
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status as FeedbackStatus | undefined
  const activeFilter = statusFilter ?? 'all'

  let items: FeedbackItem[] = []
  let error: string | null = null

  try {
    items = await getFeedback(activeFilter === 'all' ? undefined : (activeFilter as FeedbackStatus))
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load feedback'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">
          Product Feedback
        </h1>
        <span className="text-text-muted">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === 'all'
                ? '/admin/feedback'
                : `/admin/feedback?status=${filter.value}`
            }
            className={`px-3 py-1.5 text-sm font-medium rounded-button transition-colors duration-default ${
              activeFilter === filter.value
                ? 'bg-primary text-text-inverse'
                : 'bg-surface text-text-secondary border border-border hover:bg-gray-100'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {items.length === 0 && !error ? (
        <div className="text-center py-12 bg-surface rounded-card">
          <p className="text-text-secondary">Ingen tilbakemeldinger å vise</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <FeedbackRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: No errors.

**Step 3: Commit**

```bash
git add app/admin/feedback/page.tsx
git commit -m "feat: add feedback list page"
```

---

### Task 5: Update admin layout with feedback nav link and badge

**Files:**
- Modify: `app/admin/layout.tsx`

**Step 1: Update the layout**

Add the `getPendingFeedbackCount` import and a "Feedback" nav link with badge. The full updated file:

```tsx
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
    // Silently fail — badge just won't show
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
```

**Step 2: Verify build**

Run: `npm run build`
Expected: No errors.

**Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add feedback nav link with pending count badge"
```

---

### Task 6: Manual verification

**Step 1: Insert test data**

Use `mcp__supabase__execute_sql` to insert a few test rows (use a real GTIN from the products table):

```sql
-- Find a real product GTIN to use
SELECT gtin, name FROM products LIMIT 1;
```

Then insert test feedback (substitute the GTIN and a valid user_id):

```sql
INSERT INTO product_feedback (product_gtin, user_id, message, status) VALUES
  ('<GTIN>', '00000000-0000-0000-0000-000000000000', 'Ingredienslisten mangler noe viktig', 'pending'),
  ('<GTIN>', '00000000-0000-0000-0000-000000000000', 'Bildet viser feil produkt', 'pending'),
  ('<GTIN>', '00000000-0000-0000-0000-000000000000', 'Næringsinnholdet stemmer ikke', 'resolved');
```

**Step 2: Run dev server and verify**

Run: `npm run dev`

Check:
1. `/admin/feedback` shows the feedback list
2. Status filter tabs work (All/Pending/Resolved/Dismissed)
3. Resolve and Dismiss buttons update the status
4. Reopen button appears for non-pending items
5. Nav badge shows the pending count
6. Product name is displayed (not just GTIN)

**Step 3: Clean up test data**

```sql
DELETE FROM product_feedback WHERE user_id = '00000000-0000-0000-0000-000000000000';
```

**Step 4: Run advisors**

Use `mcp__supabase__get_advisors` with type `security` to check for any RLS issues.
