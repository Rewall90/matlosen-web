'use client'

import { useState } from 'react'

type Props = {
  onReject: (reason: string) => Promise<void>
  loading: boolean
}

const PREDEFINED_REASONS = [
  'Duplicate product',
  'Incorrect barcode/GTIN',
  'Unreadable images',
  'Non-food product',
  'Incomplete nutrition data',
  'Incorrect product data',
  'Test/spam submission',
]

export function RejectDialog({ onReject, loading }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const finalReason = reason === 'custom' ? customReason : reason

  async function handleSubmit() {
    if (!finalReason.trim()) return
    await onReject(finalReason)
    setIsOpen(false)
    setReason('')
    setCustomReason('')
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-button transition-colors"
      >
        Reject
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-surface-elevated rounded-xl shadow-xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Reject Product
          </h3>

          <div className="space-y-4">
            {/* Predefined reasons */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Select reason:
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setReason(r)
                      setCustomReason('')
                    }}
                    className={`
                      px-3 py-1.5 text-sm rounded-full border transition-colors
                      ${
                        reason === r
                          ? 'bg-red-100 border-red-300 text-red-800'
                          : 'border-border hover:bg-surface-muted text-text-secondary'
                      }
                    `}
                  >
                    {r}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setReason('custom')}
                  className={`
                    px-3 py-1.5 text-sm rounded-full border transition-colors
                    ${
                      reason === 'custom'
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'border-border hover:bg-surface-muted text-text-secondary'
                    }
                  `}
                >
                  Other...
                </button>
              </div>
            </div>

            {/* Custom reason input */}
            {reason === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Custom reason:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary resize-none"
                  placeholder="Enter rejection reason..."
                  autoFocus
                />
              </div>
            )}

            {/* Selected reason preview */}
            {finalReason && reason !== 'custom' && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-800">
                  <span className="font-medium">Reason:</span> {finalReason}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setReason('')
                setCustomReason('')
              }}
              className="px-4 py-2 text-text-secondary hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !finalReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Rejecting...' : 'Reject Product'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
