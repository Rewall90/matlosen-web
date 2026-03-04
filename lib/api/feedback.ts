'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/auth/session'
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback'

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const uuidSchema = z.string().uuid('Invalid feedback ID')
const statusSchema = z.enum(['pending', 'resolved', 'dismissed'])

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Get feedback items with optional status filter
 */
export async function getFeedback(status?: FeedbackStatus): Promise<FeedbackItem[]> {
  await requireAuth()

  const supabase = createAdminClient()

  let query = supabase
    .from('product_feedback')
    .select('id, product_gtin, user_id, message, image_url, status, created_at, products(name)')
    .order('created_at', { ascending: false })

  if (status) {
    const validatedStatus = statusSchema.parse(status)
    query = query.eq('status', validatedStatus)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`)
  }

  // Map results to FeedbackItem type, extracting joined product name
  return (data || []).map((row) => {
    const products = row.products as unknown as { name: string } | null
    return {
      id: row.id,
      product_gtin: row.product_gtin,
      product_name: products?.name || 'Unknown product',
      user_id: row.user_id,
      message: row.message,
      image_url: row.image_url,
      status: row.status as FeedbackStatus,
      created_at: row.created_at,
    }
  })
}

/**
 * Update the status of a feedback item
 */
export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<void> {
  await requireAuth()

  // Validate inputs
  const validatedId = uuidSchema.parse(id)
  const validatedStatus = statusSchema.parse(status)

  const supabase = createAdminClient()

  const { error, data: updatedRows } = await supabase
    .from('product_feedback')
    .update({ status: validatedStatus })
    .eq('id', validatedId)
    .select('id')

  if (error) {
    throw new Error(`Failed to update feedback status: ${error.message}`)
  }

  if (!updatedRows || updatedRows.length === 0) {
    throw new Error(`Feedback not found: ${validatedId}`)
  }
}

/**
 * Get count of pending feedback items
 */
export async function getPendingFeedbackCount(): Promise<number> {
  await requireAuth()

  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from('product_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) {
    throw new Error(`Failed to count pending feedback: ${error.message}`)
  }

  return count ?? 0
}
