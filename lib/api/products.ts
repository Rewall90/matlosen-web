'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/auth/session'
import type { PendingProduct, Product } from '@/types/product'

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const gtinSchema = z.string().regex(/^\d{8,14}$/, 'Invalid GTIN format')

const productUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(500).optional(),
  brand: z.string().max(200).nullable().optional(),
  generic_name: z.string().max(500).nullable().optional(),
  ingredients_raw: z.string().max(5000).nullable().optional(),
  nova_score: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).nullable().optional(),
  nutri_score: z.enum(['A', 'B', 'C', 'D', 'E']).nullable().optional(),
  is_renvare: z.boolean().nullable().optional(),
  energy_kcal: z.number().min(0).max(10000).nullable().optional(),
  energy_kj: z.number().min(0).max(50000).nullable().optional(),
  fat_g: z.number().min(0).max(100).nullable().optional(),
  saturated_fat_g: z.number().min(0).max(100).nullable().optional(),
  monounsaturated_fat_g: z.number().min(0).max(100).nullable().optional(),
  polyunsaturated_fat_g: z.number().min(0).max(100).nullable().optional(),
  carbs_g: z.number().min(0).max(100).nullable().optional(),
  sugars_g: z.number().min(0).max(100).nullable().optional(),
  fiber_g: z.number().min(0).max(100).nullable().optional(),
  protein_g: z.number().min(0).max(100).nullable().optional(),
  salt_g: z.number().min(0).max(100).nullable().optional(),
  fruit_veg_percent: z.number().min(0).max(100).nullable().optional(),
  origin_country: z.string().max(100).nullable().optional(),
  image_url: z.string().url().max(2000).nullable().or(z.literal('')).optional(),
  package_size: z.number().min(0).max(100000).nullable().optional(),
  package_unit: z.string().max(20).nullable().optional(),
  serving_size: z.string().max(100).nullable().optional(),
  is_vegan: z.boolean().nullable().optional(),
  is_vegetarian: z.boolean().nullable().optional(),
  has_palm_oil: z.boolean().nullable().optional(),
}).strict() // Reject unknown fields

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Get all pending products for admin review
 */
export async function getPendingProducts(): Promise<PendingProduct[]> {
  await requireAuth()

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select('gtin, name, brand, image_url, nova_score, nutri_score, is_renvare, status, created_at, data_source')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch pending products: ${error.message}`)
  }

  return data as PendingProduct[]
}

/**
 * Get a single product for review/editing
 */
export async function getProductForReview(gtin: string): Promise<Product | null> {
  await requireAuth()

  // Validate GTIN format
  const validatedGtin = gtinSchema.parse(gtin)

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('gtin', validatedGtin)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  return data as Product
}

/**
 * Update product data
 */
export async function updateProduct(
  gtin: string,
  updateData: z.infer<typeof productUpdateSchema>
): Promise<void> {
  await requireAuth()

  // Validate inputs
  const validatedGtin = gtinSchema.parse(gtin)
  const validatedData = productUpdateSchema.parse(updateData)

  // Clean empty strings to null for URL fields
  if (validatedData.image_url === '') {
    validatedData.image_url = null
  }

  const supabase = createAdminClient()

  const { error, data: updatedRows } = await supabase
    .from('products')
    .update({
      ...validatedData,
      updated_at: new Date().toISOString(),
    })
    .eq('gtin', validatedGtin)
    .select('gtin')

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }

  if (!updatedRows || updatedRows.length === 0) {
    throw new Error(`Product not found: ${validatedGtin}`)
  }
}

/**
 * Approve a product (make it visible to all users)
 */
export async function approveProduct(gtin: string): Promise<void> {
  await requireAuth()

  // Validate GTIN format
  const validatedGtin = gtinSchema.parse(gtin)

  const supabase = createAdminClient()

  const { error, data: updatedRows } = await supabase
    .from('products')
    .update({
      status: 'approved',
      reviewed_by: 'admin', // Since we use password auth, all reviewers are "admin"
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('gtin', validatedGtin)
    .select('gtin')

  if (error) {
    throw new Error(`Failed to approve product: ${error.message}`)
  }

  if (!updatedRows || updatedRows.length === 0) {
    throw new Error(`Product not found: ${validatedGtin}`)
  }
}

/**
 * Delete a product (remove entirely)
 */
export async function deleteProduct(gtin: string): Promise<void> {
  await requireAuth()

  // Validate GTIN format
  const validatedGtin = gtinSchema.parse(gtin)

  const supabase = createAdminClient()

  // First check if product exists
  const { data: existing } = await supabase
    .from('products')
    .select('gtin')
    .eq('gtin', validatedGtin)
    .single()

  if (!existing) {
    throw new Error(`Product not found: ${validatedGtin}`)
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('gtin', validatedGtin)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }
}

/**
 * Upload product image to Supabase Storage
 */
export async function uploadProductImage(gtin: string, file: File): Promise<string> {
  await requireAuth()

  // Validate GTIN format
  const validatedGtin = gtinSchema.parse(gtin)

  // Validate file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.')
  }

  const supabase = createAdminClient()

  // Generate unique filename with proper extension
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  const ext = extMap[file.type] || 'jpg'
  const filename = `${validatedGtin}-${Date.now()}.${ext}`
  const path = `products/${filename}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return urlData.publicUrl
}
