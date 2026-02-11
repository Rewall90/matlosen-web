import { Header, Footer, AppStoreButton } from '@/components'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

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

          <AppStoreButton />

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
        <AppStoreButton />
      </section>

      <Footer />
    </main>
  )
}
