import Link from 'next/link'
import { AppStoreButton } from '@/components'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-container relative overflow-hidden">
      {/* Warm gradient glow - the memorable element */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] animate-glow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(42, 157, 143, 0.4) 0%, rgba(42, 157, 143, 0.1) 50%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-narrow">
        {/* App Icon */}
        <div className="animate-fade-up animate-delay-1">
          <div className="w-24 h-24 bg-primary rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-float">
            <span className="text-white font-bold text-4xl">M</span>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 animate-fade-up animate-delay-2">
          Matlosen
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-text-secondary mb-10 animate-fade-up animate-delay-3">
          Spis renere. Lev bedre.
        </p>

        {/* App Store Button */}
        <div className="animate-fade-up animate-delay-4">
          <AppStoreButton />
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center animate-fade-up animate-delay-5">
        <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
          <Link
            href="/personvern"
            className="hover:text-primary transition-colors duration-default"
          >
            Personvern
          </Link>
          <span className="text-border">•</span>
          <Link
            href="/vilkar"
            className="hover:text-primary transition-colors duration-default"
          >
            Vilkår
          </Link>
        </div>
        <p className="text-xs text-text-muted mt-3">
          © 2025 Matlosen
        </p>
      </footer>
    </main>
  )
}
