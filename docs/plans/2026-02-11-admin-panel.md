# Admin Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an admin panel for reviewing and approving user-submitted products from the Foodle app.

**Architecture:** Next.js 14 App Router with server-side Supabase client using service role key. Simple password authentication via middleware. Admin can view pending products, edit details, upload new images, and approve/reject submissions.

**Tech Stack:** Next.js 14, Supabase (service role), Tailwind CSS, TypeScript

---

## Task 1: Install Supabase Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Supabase packages**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase dependencies"
```

---

## Task 2: Create Environment Configuration

**Files:**
- Create: `.env.local.example`
- Create: `.env.local` (do not commit)

**Step 1: Create example env file**

Create `.env.local.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Auth
ADMIN_PASSWORD=your-secure-password
```

**Step 2: Create actual env file**

Create `.env.local` with real values (get from Supabase dashboard):
```env
NEXT_PUBLIC_SUPABASE_URL=https://wowwfrlvwhrkozbebwnc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get-from-supabase-dashboard>
ADMIN_PASSWORD=<choose-secure-password>
```

**Step 3: Ensure .env.local is in .gitignore**

Check `.gitignore` contains `.env.local` - if not, add it.

**Step 4: Commit**

```bash
git add .env.local.example .gitignore
git commit -m "chore: add environment configuration template"
```

---

## Task 3: Create Supabase Admin Client

**Files:**
- Create: `lib/supabase/admin.ts`

**Step 1: Create admin client**

Create `lib/supabase/admin.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Admin client with service role - bypasses RLS
// Only use in server-side code!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

**Step 2: Commit**

```bash
git add lib/supabase/admin.ts
git commit -m "feat: add supabase admin client with service role"
```

---

## Task 4: Create Product Types

**Files:**
- Create: `lib/types/product.ts`

**Step 1: Create product type definition**

Create `lib/types/product.ts`:
```typescript
export type ProductStatus = 'pending' | 'approved' | 'rejected';

export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E';

export type Product = {
  gtin: string;
  name: string;
  brand: string | null;
  ingredients_raw: string | null;
  nova_score: number | null;
  nutri_score: NutriScore | null;
  nutri_score_points: number | null;
  image_url: string | null;
  status: ProductStatus;
  submitted_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Nutrition per 100g
  kcal: number | null;
  fat: number | null;
  saturated_fat: number | null;
  carbohydrates: number | null;
  sugars: number | null;
  protein: number | null;
  salt: number | null;
  fiber: number | null;
  // Arrays
  allergens: string[] | null;
  allergen_traces: string[] | null;
  labels: string[] | null;
};

export type ProductFormData = Omit<Product, 'gtin' | 'created_at' | 'updated_at' | 'submitted_by'>;
```

**Step 2: Create barrel export**

Create `lib/types/index.ts`:
```typescript
export * from './product';
```

**Step 3: Commit**

```bash
git add lib/types/product.ts lib/types/index.ts
git commit -m "feat: add product type definitions"
```

---

## Task 5: Create Admin API Functions

**Files:**
- Create: `lib/api/products.ts`

**Step 1: Create product API functions**

Create `lib/api/products.ts`:
```typescript
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Product } from '@/lib/types';

/**
 * Get all pending products for review
 */
export async function getPendingProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch pending products: ${error.message}`);
  }

  return data as Product[];
}

/**
 * Get a single product by GTIN for editing
 */
export async function getProductByGtin(gtin: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('gtin', gtin)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data as Product;
}

/**
 * Update product data
 */
export async function updateProduct(
  gtin: string,
  data: Partial<Product>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('gtin', gtin);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

/**
 * Approve a product - sets status to 'approved' and records review time
 */
export async function approveProduct(gtin: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('gtin', gtin);

  if (error) {
    throw new Error(`Failed to approve product: ${error.message}`);
  }
}

/**
 * Delete a product and its image from storage
 */
export async function deleteProduct(gtin: string): Promise<void> {
  // First get the product to find its image
  const product = await getProductByGtin(gtin);

  if (product?.image_url) {
    // Extract path from URL and delete from storage
    const url = new URL(product.image_url);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)/);
    if (pathMatch) {
      await supabaseAdmin.storage
        .from('product-images')
        .remove([pathMatch[1]]);
    }
  }

  // Delete the product
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('gtin', gtin);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

/**
 * Upload a new product image and update the product's image_url
 */
export async function uploadProductImage(
  gtin: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const extension = contentType.split('/')[1] || 'jpg';
  const path = `${gtin}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('product-images')
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('product-images')
    .getPublicUrl(path);

  // Update product with new image URL
  await updateProduct(gtin, { image_url: urlData.publicUrl });

  return urlData.publicUrl;
}
```

**Step 2: Commit**

```bash
git add lib/api/products.ts
git commit -m "feat: add admin product API functions"
```

---

## Task 6: Create Auth Utilities

**Files:**
- Create: `lib/auth.ts`

**Step 1: Create auth utilities**

Create `lib/auth.ts`:
```typescript
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify admin password and create session
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }

  return password === adminPassword;
}

/**
 * Create admin session cookie
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Check if admin is authenticated
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === 'authenticated';
}

/**
 * Clear admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
```

**Step 2: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: add admin authentication utilities"
```

---

## Task 7: Create Admin Middleware

**Files:**
- Create: `middleware.ts`

**Step 1: Create middleware for admin route protection**

Create `middleware.ts` in project root:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin login page itself)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const session = request.cookies.get('admin_session');

    if (session?.value !== 'authenticated') {
      // Redirect to admin login
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add admin route protection middleware"
```

---

## Task 8: Create Admin Login Page

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/actions.ts`

**Step 1: Create login server action**

Create `app/admin/actions.ts`:
```typescript
'use server';

import { redirect } from 'next/navigation';
import { verifyAdminPassword, createAdminSession, clearAdminSession } from '@/lib/auth';

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const password = formData.get('password') as string;

  if (!password) {
    return { error: 'Password is required' };
  }

  const isValid = await verifyAdminPassword(password);

  if (!isValid) {
    return { error: 'Invalid password' };
  }

  await createAdminSession();
  redirect('/admin/products');
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect('/admin');
}
```

**Step 2: Create login page**

Create `app/admin/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium
                 hover:bg-primary-dark transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Logger inn...' : 'Logg inn'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface-elevated rounded-card p-8 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Admin
          </h1>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Passord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-border
                         bg-background text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Skriv inn passord"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/admin/page.tsx app/admin/actions.ts
git commit -m "feat: add admin login page"
```

---

## Task 9: Create Admin Layout

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `components/admin/admin-header.tsx`

**Step 1: Create admin header component**

Create `components/admin/admin-header.tsx`:
```typescript
import Link from 'next/link';
import { logoutAction } from '@/app/admin/actions';

export function AdminHeader() {
  return (
    <header className="bg-surface-elevated border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/products"
              className="text-xl font-bold text-primary"
            >
              Matlosen Admin
            </Link>
            <nav className="hidden sm:flex gap-4">
              <Link
                href="/admin/products"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Produkter
              </Link>
            </nav>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Logg ut
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
```

**Step 2: Create admin layout**

Create `app/admin/layout.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check auth for all admin routes except login
  const isAuthenticated = await isAdminAuthenticated();

  // The login page handles its own layout
  // This layout is only for authenticated admin pages

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <AdminHeader />}
      <main>{children}</main>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/admin/layout.tsx components/admin/admin-header.tsx
git commit -m "feat: add admin layout with header"
```

---

## Task 10: Create Pending Products List Page

**Files:**
- Create: `app/admin/products/page.tsx`
- Create: `components/admin/product-card.tsx`

**Step 1: Create product card component**

Create `components/admin/product-card.tsx`:
```typescript
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

type ProductCardProps = {
  product: Product;
};

function getNovaBadgeColor(score: number | null): string {
  if (!score) return 'bg-gray-200 text-gray-600';
  if (score <= 2) return 'bg-green-100 text-green-800';
  if (score === 3) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function getNutriBadgeColor(score: string | null): string {
  if (!score) return 'bg-gray-200 text-gray-600';
  switch (score) {
    case 'A': return 'bg-green-600 text-white';
    case 'B': return 'bg-lime-500 text-white';
    case 'C': return 'bg-yellow-400 text-gray-800';
    case 'D': return 'bg-orange-400 text-white';
    case 'E': return 'bg-red-500 text-white';
    default: return 'bg-gray-200 text-gray-600';
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/admin/products/${product.gtin}`}
      className="block bg-surface-elevated rounded-card p-4 shadow-sm
                 hover:shadow-card transition-shadow duration-200
                 border border-border hover:border-primary"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0 bg-surface rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <span className="text-2xl">📦</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-text-secondary truncate">
              {product.brand}
            </p>
          )}
          <p className="text-xs text-text-muted mt-1">
            {product.gtin}
          </p>

          {/* Badges */}
          <div className="flex gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getNovaBadgeColor(product.nova_score)}`}>
              NOVA {product.nova_score ?? '?'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getNutriBadgeColor(product.nutri_score)}`}>
              {product.nutri_score ?? '?'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

**Step 2: Create products list page**

Create `app/admin/products/page.tsx`:
```typescript
import { getPendingProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/admin/product-card';

export const dynamic = 'force-dynamic';

export default async function PendingProductsPage() {
  const products = await getPendingProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Ventende produkter
        </h1>
        <p className="text-text-secondary mt-1">
          {products.length} produkt{products.length !== 1 ? 'er' : ''} venter på godkjenning
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">
            Ingen ventende produkter
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.gtin} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/admin/products/page.tsx components/admin/product-card.tsx
git commit -m "feat: add pending products list page"
```

---

## Task 11: Create Product Review Page

**Files:**
- Create: `app/admin/products/[gtin]/page.tsx`
- Create: `app/admin/products/[gtin]/actions.ts`
- Create: `components/admin/product-form.tsx`

**Step 1: Create server actions for product review**

Create `app/admin/products/[gtin]/actions.ts`:
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateProduct, approveProduct, deleteProduct, uploadProductImage } from '@/lib/api/products';
import type { Product } from '@/lib/types';

export async function saveProductAction(
  gtin: string,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const data: Partial<Product> = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string || null,
      ingredients_raw: formData.get('ingredients_raw') as string || null,
      nova_score: formData.get('nova_score') ? Number(formData.get('nova_score')) : null,
      nutri_score: formData.get('nutri_score') as Product['nutri_score'] || null,
      kcal: formData.get('kcal') ? Number(formData.get('kcal')) : null,
      fat: formData.get('fat') ? Number(formData.get('fat')) : null,
      saturated_fat: formData.get('saturated_fat') ? Number(formData.get('saturated_fat')) : null,
      carbohydrates: formData.get('carbohydrates') ? Number(formData.get('carbohydrates')) : null,
      sugars: formData.get('sugars') ? Number(formData.get('sugars')) : null,
      protein: formData.get('protein') ? Number(formData.get('protein')) : null,
      salt: formData.get('salt') ? Number(formData.get('salt')) : null,
      fiber: formData.get('fiber') ? Number(formData.get('fiber')) : null,
      allergens: formData.get('allergens')
        ? (formData.get('allergens') as string).split(',').map(s => s.trim()).filter(Boolean)
        : null,
      labels: formData.get('labels')
        ? (formData.get('labels') as string).split(',').map(s => s.trim()).filter(Boolean)
        : null,
    };

    await updateProduct(gtin, data);
    revalidatePath(`/admin/products/${gtin}`);
    revalidatePath('/admin/products');

    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to save product' };
  }
}

export async function approveProductAction(gtin: string): Promise<void> {
  await approveProduct(gtin);
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProductAction(gtin: string): Promise<void> {
  await deleteProduct(gtin);
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function uploadImageAction(
  gtin: string,
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get('image') as File;
    if (!file || file.size === 0) {
      return { error: 'No file provided' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadProductImage(gtin, buffer, file.type);

    revalidatePath(`/admin/products/${gtin}`);
    return { url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to upload image' };
  }
}
```

**Step 2: Create product form component**

Create `components/admin/product-form.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  saveProductAction,
  approveProductAction,
  deleteProductAction,
  uploadImageAction
} from '@/app/admin/products/[gtin]/actions';

type ProductFormProps = {
  product: Product;
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-primary text-white rounded-lg font-medium
                 hover:bg-primary-dark transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Lagrer...' : children}
    </button>
  );
}

export function ProductForm({ product }: ProductFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imageUrl, setImageUrl] = useState(product.image_url);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleSave(formData: FormData) {
    const result = await saveProductAction(product.gtin, formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Produkt lagret!' });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const result = await uploadImageAction(product.gtin, formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.url) {
      setImageUrl(result.url);
      setMessage({ type: 'success', text: 'Bilde lastet opp!' });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className="space-y-8">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column - Image */}
        <div className="space-y-4">
          <h2 className="font-semibold text-text-primary">Produktbilde</h2>

          <div className="aspect-square bg-surface rounded-lg overflow-hidden border border-border">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>

          <label className="block">
            <span className="sr-only">Last opp nytt bilde</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-text-secondary
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark
                        file:cursor-pointer"
            />
          </label>
        </div>

        {/* Right columns - Form */}
        <div className="lg:col-span-2">
          <form action={handleSave} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="font-semibold text-text-primary">Produktinformasjon</h2>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  GTIN
                </label>
                <input
                  type="text"
                  value={product.gtin}
                  disabled
                  className="w-full px-3 py-2 bg-surface rounded-lg text-text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Navn *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={product.name}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Merke
                </label>
                <input
                  type="text"
                  name="brand"
                  defaultValue={product.brand ?? ''}
                  className="w-full px-3 py-2 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Scores */}
            <div className="space-y-4">
              <h2 className="font-semibold text-text-primary">Score</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    NOVA (1-4)
                  </label>
                  <select
                    name="nova_score"
                    defaultValue={product.nova_score ?? ''}
                    className="w-full px-3 py-2 border border-border rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Ikke satt</option>
                    <option value="1">1 - Ubearbeidet</option>
                    <option value="2">2 - Bearbeidet ingrediens</option>
                    <option value="3">3 - Bearbeidet</option>
                    <option value="4">4 - Ultraprosessert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Nutri-Score
                  </label>
                  <select
                    name="nutri_score"
                    defaultValue={product.nutri_score ?? ''}
                    className="w-full px-3 py-2 border border-border rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Ikke satt</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Nutrition */}
            <div className="space-y-4">
              <h2 className="font-semibold text-text-primary">Næring per 100g</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'kcal', label: 'Kalorier', unit: 'kcal' },
                  { name: 'fat', label: 'Fett', unit: 'g' },
                  { name: 'saturated_fat', label: 'Mettet fett', unit: 'g' },
                  { name: 'carbohydrates', label: 'Karbo', unit: 'g' },
                  { name: 'sugars', label: 'Sukker', unit: 'g' },
                  { name: 'protein', label: 'Protein', unit: 'g' },
                  { name: 'salt', label: 'Salt', unit: 'g' },
                  { name: 'fiber', label: 'Fiber', unit: 'g' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name={field.name}
                        step="0.1"
                        defaultValue={(product as any)[field.name] ?? ''}
                        className="w-full px-3 py-2 border border-border rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="absolute right-3 top-2 text-text-muted text-sm">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h2 className="font-semibold text-text-primary">Ingredienser</h2>

              <textarea
                name="ingredients_raw"
                rows={4}
                defaultValue={product.ingredients_raw ?? ''}
                placeholder="Ingrediensliste..."
                className="w-full px-3 py-2 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Allergens & Labels */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Allergener (kommaseparert)
                </label>
                <input
                  type="text"
                  name="allergens"
                  defaultValue={product.allergens?.join(', ') ?? ''}
                  placeholder="melk, egg, gluten..."
                  className="w-full px-3 py-2 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Merker (kommaseparert)
                </label>
                <input
                  type="text"
                  name="labels"
                  defaultValue={product.labels?.join(', ') ?? ''}
                  placeholder="økologisk, nøkkelhullet..."
                  className="w-full px-3 py-2 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              <SubmitButton>Lagre endringer</SubmitButton>

              <button
                type="button"
                onClick={() => approveProductAction(product.gtin)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium
                         hover:bg-green-700 transition-colors"
              >
                Godkjenn
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                         hover:bg-red-700 transition-colors"
              >
                Slett
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-elevated rounded-card p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Slett produkt?
            </h3>
            <p className="text-text-secondary mb-4">
              Er du sikker på at du vil slette dette produktet? Dette kan ikke angres.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg
                         hover:bg-surface transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => deleteProductAction(product.gtin)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg
                         hover:bg-red-700 transition-colors"
              >
                Slett
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Create product review page**

Create `app/admin/products/[gtin]/page.tsx`:
```typescript
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductByGtin } from '@/lib/api/products';
import { ProductForm } from '@/components/admin/product-form';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ gtin: string }>;
};

export default async function ProductReviewPage({ params }: Props) {
  const { gtin } = await params;
  const product = await getProductByGtin(gtin);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          ← Tilbake til liste
        </Link>
        <h1 className="text-2xl font-bold text-text-primary mt-4">
          {product.name}
        </h1>
        <p className="text-text-secondary">
          {product.brand ?? 'Ukjent merke'} · {product.gtin}
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add app/admin/products/[gtin]/page.tsx app/admin/products/[gtin]/actions.ts components/admin/product-form.tsx
git commit -m "feat: add product review and edit page"
```

---

## Task 12: Configure Next.js for Images

**Files:**
- Modify: `next.config.js`

**Step 1: Add Supabase storage domain to allowed images**

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wowwfrlvwhrkozbebwnc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

**Step 2: Commit**

```bash
git add next.config.js
git commit -m "chore: configure next.js for supabase storage images"
```

---

## Task 13: Verify Build Passes

**Step 1: Run build**

```bash
npm run build
```

Expected: Build completes successfully

**Step 2: If build fails, fix issues before proceeding**

---

## Task 14: Final Commit and Summary

**Step 1: Verify all changes**

```bash
git status
git log --oneline -15
```

Expected: ~12 commits for the admin panel feature

---

## Success Criteria

After implementation:

- [ ] Admin can log in with password at `/admin`
- [ ] Admin sees pending products list at `/admin/products`
- [ ] Admin can click a product to edit it
- [ ] Admin can edit all product fields
- [ ] Admin can upload new product image
- [ ] Admin can approve product → status changes to 'approved'
- [ ] Admin can delete product → removed from database
- [ ] Non-authenticated users redirected to login
- [ ] Build passes
