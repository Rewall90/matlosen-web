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

## Pages

- `/` - Landing page with App Store link
- `/personvern` - Privacy Policy (required by App Store)
- `/vilkar` - Terms of Use (required by App Store)

## Screenshots

Phone mockups currently show gray placeholders. Replace with real app screenshots in the `<div>` elements in `app/page.tsx`.

## Related

Mobile app repo: `../foodle` (being renamed to Matlosen)
