import Link from 'next/link'
import Image from 'next/image'
import { getPendingProducts } from '@/lib/api/products'
import type { PendingProduct } from '@/types/product'

function NovaScoreBadge({ score }: { score: number | null }) {
  if (!score) return <span className="text-text-muted">-</span>

  const colors: Record<number, string> = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-lime-100 text-lime-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[score] || ''}`}>
      NOVA {score}
    </span>
  )
}

function NutriScoreBadge({ score }: { score: string | null }) {
  if (!score) return <span className="text-text-muted">-</span>

  const colors: Record<string, string> = {
    A: 'bg-green-600 text-white',
    B: 'bg-lime-500 text-white',
    C: 'bg-yellow-400 text-black',
    D: 'bg-orange-500 text-white',
    E: 'bg-red-600 text-white',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-bold rounded ${colors[score] || ''}`}>
      {score}
    </span>
  )
}

function ProductCard({ product }: { product: PendingProduct }) {
  return (
    <Link
      href={`/admin/products/${product.gtin}`}
      className="block bg-surface-elevated rounded-card shadow-card hover:shadow-lg transition-shadow p-4"
    >
      <div className="flex gap-4">
        {/* Product image */}
        <div className="w-20 h-20 bg-surface rounded-lg flex-shrink-0 overflow-hidden relative">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
              No image
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate">
            {product.name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            {product.brand || 'Unknown brand'}
          </p>
          <p className="text-xs text-text-muted mt-1">
            GTIN: {product.gtin}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <NovaScoreBadge score={product.nova_score} />
            <NutriScoreBadge score={product.nutri_score} />
            {product.is_renvare && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-subtle text-primary rounded">
                Renvare
              </span>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-text-muted text-right">
          <div>
            {product.created_at
              ? new Date(product.created_at).toLocaleDateString('nb-NO')
              : '-'}
          </div>
          <div className="mt-1 capitalize">
            {product.data_source?.replace('_', ' ') || 'Unknown'}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function AdminDashboardPage() {
  let products: PendingProduct[] = []
  let error: string | null = null

  try {
    products = await getPendingProducts()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load products'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">
          Pending Products
        </h1>
        <span className="text-text-muted">
          {products.length} product{products.length !== 1 ? 's' : ''} to review
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="text-center py-12 bg-surface rounded-card">
          <p className="text-text-secondary">No pending products to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.gtin} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
