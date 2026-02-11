import Link from 'next/link'

type HeaderProps = {
  showDownloadButton?: boolean
}

export function Header({ showDownloadButton = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-page mx-auto px-container py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-primary font-bold text-lg">M</span>
          </div>
          <span className="font-semibold text-lg">Matlosen</span>
        </Link>
        {showDownloadButton && (
          <a
            href="https://apps.apple.com/app/matlosen"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-text-inverse px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary-dark transition-colors"
          >
            Last ned
          </a>
        )}
      </div>
    </header>
  )
}
