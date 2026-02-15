/**
 * Product validation warnings for admin review
 * Helps admins identify potential issues before approving products
 */

export type ValidationSeverity = 'error' | 'warning' | 'info'

export type ValidationWarning = {
  type: ValidationSeverity
  field: string
  message: string
}

export type ProductFormData = {
  name?: string | null
  nova_score?: number | null
  nutri_score?: string | null
  category_id?: string | null
  image_url?: string | null
  energy_kcal?: number | null
  energy_kj?: number | null
  fat_g?: number | null
  saturated_fat_g?: number | null
  carbs_g?: number | null
  sugars_g?: number | null
  fiber_g?: number | null
  protein_g?: number | null
  salt_g?: number | null
  ingredients_raw?: string | null
}

type ValidationRule = {
  id: string
  field: string
  severity: ValidationSeverity
  check: (data: ProductFormData) => boolean
  message: string | ((data: ProductFormData) => string)
}

const validationRules: ValidationRule[] = [
  // =============================================================================
  // ERRORS - Must be fixed before approval
  // =============================================================================
  {
    id: 'sugars_exceeds_carbs',
    field: 'sugars_g',
    severity: 'error',
    check: (d) => {
      if (d.sugars_g == null || d.carbs_g == null) return false
      return d.sugars_g > d.carbs_g
    },
    message: 'Sugars cannot exceed total carbohydrates',
  },
  {
    id: 'saturated_exceeds_fat',
    field: 'saturated_fat_g',
    severity: 'error',
    check: (d) => {
      if (d.saturated_fat_g == null || d.fat_g == null) return false
      return d.saturated_fat_g > d.fat_g
    },
    message: 'Saturated fat cannot exceed total fat',
  },
  {
    id: 'energy_mismatch',
    field: 'energy_kcal',
    severity: 'error',
    check: (d) => {
      if (d.energy_kcal == null || d.energy_kj == null) return false
      const expectedKcal = d.energy_kj / 4.184
      const diff = Math.abs(d.energy_kcal - expectedKcal)
      return diff > 50 // Allow 50kcal tolerance
    },
    message: 'Energy kcal/kJ mismatch (should be ~4.184 kJ per kcal)',
  },
  {
    id: 'missing_name',
    field: 'name',
    severity: 'error',
    check: (d) => !d.name || d.name.trim().length === 0,
    message: 'Product name is required',
  },

  // =============================================================================
  // WARNINGS - Suspicious but might be valid
  // =============================================================================
  {
    id: 'high_protein',
    field: 'protein_g',
    severity: 'warning',
    check: (d) => (d.protein_g ?? 0) > 50,
    message: (d) => `Unusually high protein (${d.protein_g}g). Typical max is ~40g for lean meats.`,
  },
  {
    id: 'high_energy',
    field: 'energy_kcal',
    severity: 'warning',
    check: (d) => (d.energy_kcal ?? 0) > 900,
    message: (d) => `Very high energy (${d.energy_kcal}kcal). Pure fats are ~900kcal max.`,
  },
  {
    id: 'high_salt',
    field: 'salt_g',
    severity: 'warning',
    check: (d) => (d.salt_g ?? 0) > 10,
    message: (d) => `Very high salt (${d.salt_g}g). Check if correct per 100g.`,
  },
  {
    id: 'macros_over_100',
    field: 'nutrition',
    severity: 'warning',
    check: (d) => {
      const sum =
        (d.protein_g ?? 0) +
        (d.fat_g ?? 0) +
        (d.carbs_g ?? 0) +
        (d.fiber_g ?? 0)
      return sum > 105 // Allow 5g tolerance for rounding
    },
    message: (d) => {
      const sum =
        (d.protein_g ?? 0) +
        (d.fat_g ?? 0) +
        (d.carbs_g ?? 0) +
        (d.fiber_g ?? 0)
      return `Macros sum to ${sum.toFixed(1)}g (exceeds 100g per 100g serving)`
    },
  },
  {
    id: 'high_fat',
    field: 'fat_g',
    severity: 'warning',
    check: (d) => (d.fat_g ?? 0) > 90,
    message: (d) => `Very high fat (${d.fat_g}g). Only pure oils should be this high.`,
  },
  {
    id: 'high_sugar',
    field: 'sugars_g',
    severity: 'warning',
    check: (d) => (d.sugars_g ?? 0) > 80,
    message: (d) => `Very high sugar (${d.sugars_g}g). Only pure sugar should be this high.`,
  },

  // =============================================================================
  // INFO - Recommendations for completeness
  // =============================================================================
  {
    id: 'missing_nova',
    field: 'nova_score',
    severity: 'info',
    check: (d) => d.nova_score == null,
    message: 'No NOVA score set. Consider classifying the product.',
  },
  {
    id: 'missing_category',
    field: 'category_id',
    severity: 'info',
    check: (d) => !d.category_id,
    message: 'No category assigned. Improves search and recommendations.',
  },
  {
    id: 'missing_image',
    field: 'image_url',
    severity: 'info',
    check: (d) => !d.image_url,
    message: 'No product image. Upload for better user experience.',
  },
  {
    id: 'missing_ingredients',
    field: 'ingredients_raw',
    severity: 'info',
    check: (d) => !d.ingredients_raw || d.ingredients_raw.trim().length === 0,
    message: 'No ingredients listed. Required for additive detection.',
  },
  {
    id: 'missing_nutri_score',
    field: 'nutri_score',
    severity: 'info',
    check: (d) => !d.nutri_score,
    message: 'No Nutri-Score set.',
  },
]

/**
 * Validate product data and return all warnings
 */
export function validateProduct(data: ProductFormData): ValidationWarning[] {
  return validationRules
    .filter((rule) => rule.check(data))
    .map((rule) => ({
      type: rule.severity,
      field: rule.field,
      message: typeof rule.message === 'function' ? rule.message(data) : rule.message,
    }))
}

/**
 * Check if product has any blocking errors
 */
export function hasBlockingErrors(data: ProductFormData): boolean {
  return validationRules
    .filter((rule) => rule.severity === 'error')
    .some((rule) => rule.check(data))
}

/**
 * Get warnings grouped by severity
 */
export function getGroupedWarnings(data: ProductFormData): {
  errors: ValidationWarning[]
  warnings: ValidationWarning[]
  info: ValidationWarning[]
} {
  const all = validateProduct(data)
  return {
    errors: all.filter((w) => w.type === 'error'),
    warnings: all.filter((w) => w.type === 'warning'),
    info: all.filter((w) => w.type === 'info'),
  }
}
