'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { PendingProduct, Product, ProductFormData } from '@/types/product'

/**
 * Get all pending products for admin review
 */
export async function getPendingProducts(): Promise<PendingProduct[]> {
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
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('gtin', gtin)
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
export async function updateProduct(gtin: string, data: Partial<ProductFormData>): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('gtin', gtin)

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }
}

/**
 * Approve a product (make it visible to all users)
 */
export async function approveProduct(gtin: string, reviewerId: string): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .update({
      status: 'approved',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('gtin', gtin)

  if (error) {
    throw new Error(`Failed to approve product: ${error.message}`)
  }
}

/**
 * Delete a product (remove entirely)
 */
export async function deleteProduct(gtin: string): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('gtin', gtin)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }
}

/**
 * Upload product image to Supabase Storage
 */
export async function uploadProductImage(gtin: string, file: File): Promise<string> {
  const supabase = createAdminClient()

  // Generate unique filename
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${gtin}-${Date.now()}.${ext}`
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
