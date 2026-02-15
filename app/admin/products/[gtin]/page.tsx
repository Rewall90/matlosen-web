import { notFound } from 'next/navigation'
import { getProductForReview } from '@/lib/api/products'
import { ProductReviewForm } from './product-review-form'

type Props = {
  params: Promise<{ gtin: string }>
}

export default async function ProductReviewPage({ params }: Props) {
  const { gtin } = await params
  const product = await getProductForReview(gtin)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">
          Review Product
        </h1>
        <p className="text-text-secondary mt-1">
          GTIN: {product.gtin} | Status: {product.status}
        </p>
      </div>

      <ProductReviewForm product={product} />
    </div>
  )
}
