# Product Feedback Admin Section

## Overview

Add a "Product Feedback" section to the admin dashboard that displays user-submitted feedback from a new `product_feedback` table. Admins can view feedback, filter by status, and mark items as resolved or dismissed.

## Database

```sql
CREATE TABLE product_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_gtin TEXT NOT NULL REFERENCES products(gtin),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL CHECK (char_length(message) <= 2000),
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE product_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON product_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own feedback"
  ON product_feedback FOR SELECT
  USING (auth.uid() = user_id);
```

Images stored in Supabase Storage bucket `product-images` under `feedback/{gtin}/{timestamp}.jpg`.

Admin dashboard uses service role key — bypasses RLS, no admin policies needed.

## File Structure

```
app/admin/feedback/
  page.tsx                — Server component, feedback list with status filter
lib/api/
  feedback.ts             — Server actions
types/
  feedback.ts             — TypeScript types
app/admin/
  layout.tsx              — Updated: add Feedback nav link with pending count badge
```

## Navigation

Add "Feedback" link to `layout.tsx` nav with a pending count badge (fetched server-side via `getPendingFeedbackCount()`).

## Feedback Page (`/admin/feedback`)

- **Status filter**: button group — All | Pending | Resolved | Dismissed. Uses URL search params (`?status=pending`) for server component compatibility.
- **List rows** show:
  - Product name (joined from `products` on gtin)
  - Message text (truncated ~200 chars)
  - Image thumbnail (48x48) if present, clickable to open full-size in new tab
  - Status badge (color-coded)
  - Timestamp (formatted date)
  - Action buttons: Resolve / Dismiss (or Reopen if already handled)
- **Empty state** when no feedback matches the filter.
- **Error state** matching existing pattern.

## Server Actions (`lib/api/feedback.ts`)

All actions use `requireAuth()` + `createAdminClient()`:

- `getFeedback(status?: string)` — query with optional status filter, join product name, ordered by `created_at` DESC
- `updateFeedbackStatus(id: string, status: string)` — update status to resolved/dismissed/pending
- `getPendingFeedbackCount()` — count of pending feedback for nav badge

## Not Included

- No detail/drill-down page per feedback item
- No editing of feedback messages
- No reply-to-user functionality
- No bulk actions
