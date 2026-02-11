import Link from 'next/link'

type FooterProps = {
  activeLink?: 'personvern' | 'vilkar'
}

export function Footer({ activeLink }: FooterProps) {
  return (
    <footer className="py-8 px-container border-t border-border">
      <div className="max-w-page mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">
          © 2025 Matlosen. Alle rettigheter reservert.
        </p>
        <div className="flex gap-6">
          <Link
            href="/personvern"
            className={
              activeLink === 'personvern'
                ? 'text-primary text-sm font-medium'
                : 'text-text-secondary text-sm hover:text-primary transition-colors'
            }
          >
            Personvernerklæring
          </Link>
          <Link
            href="/vilkar"
            className={
              activeLink === 'vilkar'
                ? 'text-primary text-sm font-medium'
                : 'text-text-secondary text-sm hover:text-primary transition-colors'
            }
          >
            Bruksvilkår
          </Link>
        </div>
      </div>
    </footer>
  )
}
