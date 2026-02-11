import { Header, Footer, AppStoreButton, PhoneMockup } from '@/components'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-hero-top pb-section px-container">
        <div className="max-w-content mx-auto text-center">
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

          <AppStoreButton />

          {/* Hero Phone Mockup */}
          <div className="mt-16 relative">
            <PhoneMockup label="Skjermbilde 1" />
          </div>
        </div>
      </section>

      {/* Feature 1: Skann og sjekk */}
      <section className="py-section px-container bg-surface">
        <div className="max-w-page mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Skann og sjekk
            </h2>
            <p className="text-lg text-text-secondary">
              Skann strekkoden på et produkt og få umiddelbar oversikt over NOVA-score, Nutri-Score, og alle tilsetningsstoffer. Vit hva du spiser.
            </p>
          </div>
          <PhoneMockup label="Skjermbilde 2" variant="dark" />
        </div>
      </section>

      {/* Feature 2: Finn sunnere alternativer */}
      <section className="py-section px-container">
        <div className="max-w-page mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <PhoneMockup label="Skjermbilde 3" />
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
      <section className="py-section px-container bg-surface">
        <div className="max-w-page mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">
              Oppskrifter uten UPF
            </h2>
            <p className="text-lg text-text-secondary">
              Utforsk hundrevis av oppskrifter laget med rene råvarer. Planlegg ukens måltider og generer handlelister automatisk.
            </p>
          </div>
          <PhoneMockup label="Skjermbilde 4" variant="dark" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section px-container text-center">
        <h2 className="text-3xl font-bold mb-6 text-text-primary">
          Klar til å spise renere?
        </h2>
        <AppStoreButton />
      </section>

      <Footer />
    </main>
  )
}
