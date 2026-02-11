import Link from 'next/link'

type HeaderProps = {
  showDownloadButton?: boolean
}

export function Header({ showDownloadButton = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-background/80 backdrop-blur-header border-b border-border">
      <div className="max-w-page mx-auto px-container py-gap-items flex items-center justify-between">
        <Link href="/" className="flex items-center gap-gap-items">
          <div className="w-logo h-logo bg-primary/10 rounded-icon flex items-center justify-center">
            <span className="text-primary font-bold text-lg">M</span>
          </div>
          <span className="font-semibold text-lg">Matlosen</span>
        </Link>
        {showDownloadButton && (
          <a
            href="https://apps.apple.com/app/matlosen"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Last ned Matlosen (åpner App Store i nytt vindu)"
            className="bg-primary text-text-inverse px-p-button-x py-p-button-y rounded-button font-medium text-sm hover:bg-primary-dark transition-colors duration-default"
          >
            Last ned
          </a>
        )}
      </div>
    </header>
  )
}
