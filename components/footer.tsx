import Link from 'next/link'

type FooterProps = {
  activeLink?: 'personvern' | 'vilkar'
}

export function Footer({ activeLink }: FooterProps) {
  return (
    <footer className="py-footer px-container border-t border-border">
      <div className="max-w-page mx-auto flex flex-col md:flex-row items-center justify-between gap-gap-items">
        <p className="text-text-muted text-sm">
          © 2025 Matlosen. Alle rettigheter reservert.
        </p>
        <div className="flex gap-gap-links">
          <Link
            href="/personvern"
            className={
              activeLink === 'personvern'
                ? 'text-primary text-sm font-medium'
                : 'text-text-secondary text-sm hover:text-primary transition-colors duration-default'
            }
          >
            Personvernerklæring
          </Link>
          <Link
            href="/vilkar"
            className={
              activeLink === 'vilkar'
                ? 'text-primary text-sm font-medium'
                : 'text-text-secondary text-sm hover:text-primary transition-colors duration-default'
            }
          >
            Bruksvilkår
          </Link>
        </div>
      </div>
    </footer>
  )
}
