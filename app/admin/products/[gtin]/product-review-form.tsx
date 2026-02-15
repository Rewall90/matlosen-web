'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateProduct,
  approveProduct,
  rejectProduct,
  updateProductCategory,
  reExtractAdditives,
} from '@/lib/api/products'
import { validateProduct, hasBlockingErrors } from '@/lib/validation/product-warnings'
import { ValidationWarnings } from '@/components/admin/validation-warnings'
import { CategorySelector } from '@/components/admin/category-selector'
import { ImageUploader } from '@/components/admin/image-uploader'
import { RejectDialog } from '@/components/admin/reject-dialog'
import type { Product, NovaScore, NutriScore } from '@/types/product'

type Props = {
  product: Product
  categoryName?: string | null
}

export function ProductReviewForm({ product, categoryName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [extractionResult, setExtractionResult] = useState<{ count: number } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: product.name,
    brand: product.brand || '',
    generic_name: product.generic_name || '',
    ingredients_raw: product.ingredients_raw || '',
    nova_score: product.nova_score,
    nutri_score: product.nutri_score,
    is_renvare: product.is_renvare || false,
    energy_kcal: product.energy_kcal,
    energy_kj: product.energy_kj,
    fat_g: product.fat_g,
    saturated_fat_g: product.saturated_fat_g,
    carbs_g: product.carbs_g,
    sugars_g: product.sugars_g,
    fiber_g: product.fiber_g,
    protein_g: product.protein_g,
    salt_g: product.salt_g,
    origin_country: product.origin_country || '',
    package_size: product.package_size,
    package_unit: product.package_unit || '',
    image_url: product.image_url || '',
    category_id: product.category_id || null,
  })

  // Compute validation warnings
  const warnings = useMemo(() => validateProduct(formData), [formData])
  const hasErrors = useMemo(() => hasBlockingErrors(formData), [formData])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? value === '' ? null : Number(value)
          : value,
    }))
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await updateProduct(product.gtin, {
        ...formData,
        nova_score: formData.nova_score as NovaScore | null,
        nutri_score: formData.nutri_score as NutriScore | null,
      })
      // Also update category if changed
      if (formData.category_id !== product.category_id) {
        await updateProductCategory(product.gtin, formData.category_id)
      }
      setSuccess('Product saved successfully')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    if (hasErrors) {
      setError('Please fix all errors before approving')
      return
    }

    if (!confirm('Are you sure you want to approve this product?')) return

    setLoading(true)
    setError('')

    try {
      // Save any changes first
      await updateProduct(product.gtin, {
        ...formData,
        nova_score: formData.nova_score as NovaScore | null,
        nutri_score: formData.nutri_score as NutriScore | null,
      })
      // Update category if changed
      if (formData.category_id !== product.category_id) {
        await updateProductCategory(product.gtin, formData.category_id)
      }
      // Then approve
      await approveProduct(product.gtin)
      router.push('/admin')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve')
      setLoading(false)
    }
  }

  async function handleReject(reason: string) {
    setLoading(true)
    setError('')

    try {
      await rejectProduct(product.gtin, reason)
      router.push('/admin')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reject')
      setLoading(false)
    }
  }

  async function handleReExtract() {
    if (!formData.ingredients_raw) {
      setError('No ingredients to extract from')
      return
    }

    setExtracting(true)
    setError('')
    setExtractionResult(null)

    try {
      // First save the current ingredients
      await updateProduct(product.gtin, {
        ingredients_raw: formData.ingredients_raw,
      })
      // Then re-extract
      const result = await reExtractAdditives(product.gtin)
      setExtractionResult(result)
      setSuccess(`Extracted ${result.count} additives`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to extract additives')
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Validation Warnings */}
      <ValidationWarnings warnings={warnings} />

      {/* Status messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* AI Raw Response (if available) */}
      {product.ai_raw_response && (
        <details className="bg-surface p-4 rounded-card">
          <summary className="cursor-pointer text-text-secondary font-medium">
            AI Raw Response
          </summary>
          <pre className="mt-4 text-xs overflow-auto max-h-64 bg-surface-muted p-3 rounded">
            {JSON.stringify(product.ai_raw_response, null, 2)}
          </pre>
        </details>
      )}

      {/* Image section */}
      <section className="bg-surface-elevated p-6 rounded-card shadow-card">
        <h2 className="text-lg font-medium text-text-primary mb-4">Product Image</h2>

        <div className="flex gap-6">
          <ImageUploader
            gtin={product.gtin}
            currentUrl={formData.image_url || null}
            onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
          />

          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
              placeholder="https://..."
            />
            <p className="text-xs text-text-muted mt-2">
              Upload an image or enter a URL manually.
            </p>
          </div>
        </div>
      </section>

      {/* Basic info */}
      <section className="bg-surface-elevated p-6 rounded-card shadow-card">
        <h2 className="text-lg font-medium text-text-primary mb-4">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Generic Name
            </label>
            <input
              type="text"
              name="generic_name"
              value={formData.generic_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          {/* Category Selector */}
          <div className="col-span-2">
            <CategorySelector
              value={formData.category_id}
              onChange={(categoryId) => setFormData((prev) => ({ ...prev, category_id: categoryId }))}
              initialCategoryName={categoryName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Origin Country
            </label>
            <input
              type="text"
              name="origin_country"
              value={formData.origin_country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Package Size
              </label>
              <input
                type="number"
                name="package_size"
                value={formData.package_size ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Unit
              </label>
              <input
                type="text"
                name="package_unit"
                value={formData.package_unit}
                onChange={handleChange}
                placeholder="g, ml"
                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="bg-surface-elevated p-6 rounded-card shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-text-primary">Ingredients</h2>
          <div className="flex items-center gap-3">
            {extractionResult && (
              <span className="text-sm text-green-600">
                Found {extractionResult.count} additives
              </span>
            )}
            <button
              type="button"
              onClick={handleReExtract}
              disabled={extracting || !formData.ingredients_raw}
              className="px-3 py-1.5 text-sm bg-surface border border-border rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {extracting ? 'Extracting...' : 'Re-extract Additives'}
            </button>
          </div>
        </div>

        <textarea
          name="ingredients_raw"
          value={formData.ingredients_raw}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
          placeholder="Enter ingredients list..."
        />
      </section>

      {/* Scores */}
      <section className="bg-surface-elevated p-6 rounded-card shadow-card">
        <h2 className="text-lg font-medium text-text-primary mb-4">Scores & Classification</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              NOVA Score
            </label>
            <select
              name="nova_score"
              value={formData.nova_score ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            >
              <option value="">Not set</option>
              <option value="1">1 - Unprocessed</option>
              <option value="2">2 - Processed ingredients</option>
              <option value="3">3 - Processed</option>
              <option value="4">4 - Ultra-processed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Nutri-Score
            </label>
            <select
              name="nutri_score"
              value={formData.nutri_score ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            >
              <option value="">Not set</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <div className="flex items-center pt-7">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_renvare"
                checked={formData.is_renvare}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-text-primary">Is Renvare</span>
            </label>
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="bg-surface-elevated p-6 rounded-card shadow-card">
        <h2 className="text-lg font-medium text-text-primary mb-4">Nutrition (per 100g)</h2>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Energy (kcal)
            </label>
            <input
              type="number"
              name="energy_kcal"
              value={formData.energy_kcal ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Energy (kJ)
            </label>
            <input
              type="number"
              name="energy_kj"
              value={formData.energy_kj ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Fat (g)
            </label>
            <input
              type="number"
              step="0.1"
              name="fat_g"
              value={formData.fat_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Saturated Fat (g)
            </label>
            <input
              type="number"
              step="0.1"
              name="saturated_fat_g"
              value={formData.saturated_fat_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Carbs (g)
            </label>
            <input
              type="number"
              step="0.1"
              name="carbs_g"
              value={formData.carbs_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Sugars (g)
            </label>
            <input
              type="number"
              step="0.1"
              name="sugars_g"
              value={formData.sugars_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Fiber (g)
            </label>
            <input
              type="number"
              step="0.1"
              name="fiber_g"
              value={formData.fiber_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              step="0.1"
              name="protein_g"
              value={formData.protein_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Salt (g)
            </label>
            <input
              type="number"
              step="0.01"
              name="salt_g"
              value={formData.salt_g ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <RejectDialog onReject={handleReject} loading={loading} />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-button hover:bg-surface-muted transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleApprove}
            disabled={loading || hasErrors}
            title={hasErrors ? 'Fix all errors before approving' : ''}
            className="px-5 py-2.5 bg-primary text-text-inverse font-medium rounded-button hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Save & Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}
