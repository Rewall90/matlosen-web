import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              {/* Placeholder for app icon */}
              <span className="text-primary font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-lg">Matlosen</span>
          </div>
          <a
            href="https://apps.apple.com/app/matlosen"
            className="bg-primary text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary-dark transition-colors"
          >
            Last ned
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* App Icon */}
          <div className="w-24 h-24 bg-primary/10 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            {/* Placeholder - replace with actual app icon */}
            <span className="text-primary font-bold text-4xl">M</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Spis renere. Lev bedre.
          </h1>

          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl mx-auto">
            Matlosen hjelper deg å unngå ultraprosessert mat, finne sunnere alternativer, og lage rene oppskrifter for hele familien.
          </p>

          {/* App Store Button */}
          <a
            href="https://apps.apple.com/app/matlosen"
            className="inline-block"
          >
            <Image
              src="/app-store-badge.svg"
              alt="Last ned på App Store"
              width={180}
              height={60}
              className="hover:opacity-80 transition-opacity"
            />
          </a>

          {/* Hero Phone Mockup */}
          <div className="mt-16 relative">
            <div className="bg-surface rounded-[3rem] p-4 max-w-xs mx-auto shadow-lg border border-border">
              <div className="bg-gray-200 rounded-[2.5rem] aspect-[9/19] flex items-center justify-center">
                <span className="text-text-muted text-sm">Skjermbilde 1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Skann og sjekk */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Skann og sjekk
            </h2>
            <p className="text-lg text-text-secondary">
              Skann strekkoden på et produkt og få umiddelbar oversikt over NOVA-score, Nutri-Score, og alle tilsetningsstoffer. Vit hva du spiser.
            </p>
          </div>
          <div className="bg-white rounded-[3rem] p-4 max-w-xs mx-auto shadow-lg border border-border">
            <div className="bg-gray-200 rounded-[2.5rem] aspect-[9/19] flex items-center justify-center">
              <span className="text-text-muted text-sm">Skjermbilde 2</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Finn sunnere alternativer */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-surface rounded-[3rem] p-4 max-w-xs mx-auto shadow-lg border border-border">
            <div className="bg-gray-200 rounded-[2.5rem] aspect-[9/19] flex items-center justify-center">
              <span className="text-text-muted text-sm">Skjermbilde 3</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Finn sunnere alternativer
            </h2>
            <p className="text-lg text-text-secondary">
              Oppdaget du et ultraprosessert produkt? Matlosen foreslår renere alternativer fra samme kategori, så du enkelt kan bytte til bedre valg.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 3: Oppskrifter uten UPF */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Oppskrifter uten UPF
            </h2>
            <p className="text-lg text-text-secondary">
              Utforsk hundrevis av oppskrifter laget med rene råvarer. Planlegg ukens måltider og generer handlelister automatisk.
            </p>
          </div>
          <div className="bg-white rounded-[3rem] p-4 max-w-xs mx-auto shadow-lg border border-border">
            <div className="bg-gray-200 rounded-[2.5rem] aspect-[9/19] flex items-center justify-center">
              <span className="text-text-muted text-sm">Skjermbilde 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6 text-text-primary">
          Klar til å spise renere?
        </h2>
        <a
          href="https://apps.apple.com/app/matlosen"
          className="inline-block"
        >
          <Image
            src="/app-store-badge.svg"
            alt="Last ned på App Store"
            width={180}
            height={60}
            className="hover:opacity-80 transition-opacity"
          />
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Matlosen. Alle rettigheter reservert.
          </p>
          <div className="flex gap-6">
            <Link
              href="/personvern"
              className="text-text-secondary text-sm hover:text-primary transition-colors"
            >
              Personvernerklæring
            </Link>
            <Link
              href="/vilkar"
              className="text-text-secondary text-sm hover:text-primary transition-colors"
            >
              Bruksvilkår
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
