export type FeedbackStatus = 'pending' | 'resolved' | 'dismissed'

export type FeedbackItem = {
  id: string
  product_gtin: string
  product_name: string // joined from products table
  user_id: string
  message: string
  image_url: string | null
  status: FeedbackStatus
  created_at: string
}
