# Matlosen Web

Landing page and legal pages for the Matlosen app (matlosen.no).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (auto-deploy from `main` branch)
- **Font**: Outfit (same as mobile app)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npx vercel` | Manual deploy |

## Brand

- Primary color: `#2a9d8f` (warm teal)
- Background: `#fdfcfa` (light cream)
- All text in Norwegian

## Design Token System

All design values live in `lib/theme.ts` as the single source of truth. Tailwind is configured to expose these tokens.

### Token Architecture

```
lib/theme.ts (source) → tailwind.config.ts (exposure) → components (usage)
```

**Never hardcode values in components.** Always use semantic tokens from Tailwind.

### Token Categories

| Category | File Location | Tailwind Prefix | Example |
|----------|---------------|-----------------|---------|
| Colors | `colors` | `bg-`, `text-`, `border-` | `bg-primary`, `text-text-secondary` |
| Spacing | `semanticSpacing` | Direct names | `px-container`, `py-section`, `gap-gap-items` |
| Typography | `typography` | `font-` | `font-outfit` |
| Border Radius | `borderRadius` | `rounded-` | `rounded-card`, `rounded-button` |
| Shadows | `shadows` | `shadow-` | `shadow-card`, `shadow-phone` |
| Transitions | `transitions` | `duration-`, `ease-` | `duration-default`, `ease-default` |
| Blur | `blur` | `backdrop-blur-` | `backdrop-blur-header` |
| Component Sizes | `componentSizes` | `w-`, `h-` | `w-logo`, `h-icon-lg` |
| Layout | `layout` | `max-w-`, `z-` | `max-w-page`, `z-header` |

### Semantic Spacing Reference

| Token | Value | Use For |
|-------|-------|---------|
| `container` | 24px | Horizontal page padding |
| `section` | 80px | Vertical section padding |
| `section-sm` | 64px | Smaller section padding |
| `hero-top` | 128px | Hero section top (accounts for header) |
| `footer` | 32px | Footer vertical padding |
| `gap-section` | 48px | Gap between section items |
| `gap-items` | 16px | Gap between small items |
| `mb-heading` | 16px | Margin below headings |
| `mb-heading-lg` | 24px | Margin below large headings |
| `mb-body` | 40px | Margin below body text before CTA |
| `mb-element` | 32px | Margin below UI elements |
| `p-card` | 16px | Card padding |
| `p-button-x` | 20px | Button horizontal padding |
| `p-button-y` | 10px | Button vertical padding |

### Color Tokens

| Token | Usage |
|-------|-------|
| `primary` | Brand color, CTAs |
| `primary-dark` | Hover states |
| `background` | Page background |
| `surface` | Card/section backgrounds |
| `surface-elevated` | Elevated cards |
| `text-primary` | Headings, important text |
| `text-secondary` | Body text |
| `text-muted` | Subtle text, placeholders |
| `text-inverse` | Text on primary buttons |
| `border` | Borders, dividers |
| `placeholder` | Placeholder backgrounds |

### Component Examples

**Good** - Uses semantic tokens:
```tsx
<section className="py-section px-container bg-surface">
  <h2 className="text-3xl font-bold mb-mb-heading text-text-primary">
  <p className="text-lg text-text-secondary">
</section>
```

**Bad** - Hardcoded values:
```tsx
<section className="py-20 px-6 bg-gray-50">
  <h2 className="text-3xl font-bold mb-4 text-gray-900">
  <p className="text-lg text-gray-600">
</section>
```

### Adding New Tokens

1. Add to appropriate object in `lib/theme.ts`
2. Expose in `tailwind.config.ts` under correct `extend` key
3. Use semantic naming: purpose-based, not value-based

### Coding Standards for Tokens

- **Spacing**: Use semantic names (`px-container`) not raw values (`px-6`)
- **Colors**: Use semantic names (`text-text-secondary`) not raw colors (`text-gray-600`)
- **Transitions**: Always include `transition-colors duration-default` for interactive elements
- **Hover states**: Use `hover:opacity-80` or `hover:bg-primary-dark` patterns

## Pages

- `/` - Landing page with App Store link
- `/personvern` - Privacy Policy (required by App Store)
- `/vilkar` - Terms of Use (required by App Store)

## Screenshots

Phone mockups currently show gray placeholders. Replace with real app screenshots in the `<div>` elements in `app/page.tsx`.

## Links

- **Live**: https://matlosen.no
- **Vercel**: https://vercel.com/petters-projects-11c97cd1/matlosen-web
- **GitHub**: https://github.com/Rewall90/matlosen-web

## Related

Mobile app repo: `../foodle` (being renamed to Matlosen)
