export type NovaScore = 1 | 2 | 3 | 4
export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E'
export type ProductStatus = 'approved' | 'pending' | 'rejected'

export type Product = {
  gtin: string
  epd_nr: string | null
  name: string
  brand: string | null
  generic_name: string | null
  category_id: string | null
  ingredients_raw: string | null
  nova_score: NovaScore | null
  nutri_score: NutriScore | null
  is_renvare: boolean | null
  allergens: string[] | null
  allergen_traces: string[] | null
  labels: string[] | null
  energy_kcal: number | null
  energy_kj: number | null
  fat_g: number | null
  saturated_fat_g: number | null
  monounsaturated_fat_g: number | null
  polyunsaturated_fat_g: number | null
  carbs_g: number | null
  sugars_g: number | null
  fiber_g: number | null
  protein_g: number | null
  salt_g: number | null
  fruit_veg_percent: number | null
  origin_country: string | null
  image_url: string | null
  package_size: number | null
  package_unit: string | null
  serving_size: string | null
  is_vegan: boolean | null
  is_vegetarian: boolean | null
  has_palm_oil: boolean | null
  ecoscore_grade: NutriScore | null
  data_source: 'vetduat' | 'openfoodfacts' | 'user_submitted' | 'manual' | 'combined' | null
  data_completeness: number | null
  api_category_name: string | null
  company_name: string | null
  company_id: string | null
  company_slug: string | null
  created_at: string | null
  updated_at: string | null

  // Submission tracking
  status: ProductStatus
  submitted_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  ai_raw_response: Record<string, unknown> | null
}

// Pending product for list view
export type PendingProduct = Pick<
  Product,
  | 'gtin'
  | 'name'
  | 'brand'
  | 'image_url'
  | 'nova_score'
  | 'nutri_score'
  | 'is_renvare'
  | 'status'
  | 'created_at'
  | 'data_source'
>

// Form data for editing a product
export type ProductFormData = Omit<
  Product,
  'created_at' | 'updated_at' | 'reviewed_by' | 'reviewed_at' | 'status' | 'submitted_by' | 'ai_raw_response'
>
