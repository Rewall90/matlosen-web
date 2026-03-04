import Link from 'next/link'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'
import { getFeedback, updateFeedbackStatus } from '@/lib/api/feedback'
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback'

// =============================================================================
// STATUS BADGE
// =============================================================================

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const styles: Record<FeedbackStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-600',
  }

  const labels: Record<FeedbackStatus, string> = {
    pending: 'Ventende',
    resolved: 'Løst',
    dismissed: 'Avvist',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

// =============================================================================
// FEEDBACK CARD
// =============================================================================

function FeedbackCard({ item }: { item: FeedbackItem }) {
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
            <div className="w-12 h-12 rounded overflow-hidden relative">
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
          {/* Header: product name + status */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-text-primary truncate">
              {item.product_name}
            </span>
            <StatusBadge status={item.status} />
          </div>

          {/* Message */}
          <p className="text-sm text-text-secondary line-clamp-2 mb-1">
            {item.message}
          </p>

          {/* Meta: GTIN + date */}
          <p className="text-xs text-text-muted">
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
          {item.status === 'pending' ? (
            <>
              <form action={handleResolve}>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors duration-default"
                >
                  Løs
                </button>
              </form>
              <form action={handleDismiss}>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary hover:bg-gray-100 transition-colors duration-default"
                >
                  Avvis
                </button>
              </form>
            </>
          ) : (
            <form action={handleReopen}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary hover:bg-gray-100 transition-colors duration-default"
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

// =============================================================================
// FILTER BUTTONS
// =============================================================================

const filterOptions: { label: string; value: string | undefined }[] = [
  { label: 'Alle', value: undefined },
  { label: 'Ventende', value: 'pending' },
  { label: 'Løst', value: 'resolved' },
  { label: 'Avvist', value: 'dismissed' },
]

function FilterButtons({ activeStatus }: { activeStatus: string | undefined }) {
  return (
    <div className="flex gap-2 mb-6">
      {filterOptions.map((option) => {
        const isActive = activeStatus === option.value
        const href = option.value
          ? `/admin/feedback?status=${option.value}`
          : '/admin/feedback'

        return (
          <Link
            key={option.label}
            href={href}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors duration-default ${
              isActive
                ? 'bg-primary text-text-inverse'
                : 'bg-surface text-text-secondary border border-border hover:bg-gray-100'
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}

// =============================================================================
// PAGE
// =============================================================================

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status as FeedbackStatus | undefined

  let feedbackItems: FeedbackItem[] = []
  let error: string | null = null

  try {
    feedbackItems = await getFeedback(statusFilter)
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
          {feedbackItems.length} item{feedbackItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      <FilterButtons activeStatus={statusFilter} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {feedbackItems.length === 0 && !error ? (
        <div className="text-center py-12 bg-surface rounded-card">
          <p className="text-text-secondary">Ingen tilbakemeldinger funnet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
