import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personvernerklæring - Matlosen',
  description: 'Personvernerklæring for Matlosen-appen. Les om hvordan vi samler inn, bruker og beskytter dine personopplysninger.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-lg">Matlosen</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1 className="text-3xl font-bold mb-2 text-text-primary">Personvernerklæring</h1>
          <p className="text-text-muted mb-8">Sist oppdatert: {new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">1. Introduksjon</h2>
            <p className="text-text-secondary mb-4">
              Matlosen («vi», «oss» eller «vår») er forpliktet til å beskytte ditt personvern.
              Denne personvernerklæringen forklarer hvordan vi samler inn, bruker, deler og beskytter
              informasjon når du bruker Matlosen-appen («Tjenesten»).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">2. Informasjon vi samler inn</h2>

            <h3 className="text-lg font-medium mb-2 text-text-primary">2.1 Informasjon du gir oss</h3>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Kontoinformasjon (e-post, navn) hvis du oppretter en konto</li>
              <li>Preferanser og innstillinger du velger i appen</li>
              <li>Tilbakemeldinger og henvendelser du sender til oss</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-text-primary">2.2 Informasjon vi samler automatisk</h3>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Produkter du skanner (strekkoder)</li>
              <li>Anonym bruksstatistikk for å forbedre tjenesten</li>
              <li>Teknisk informasjon om enheten din (operativsystem, app-versjon)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">3. Hvordan vi bruker informasjonen</h2>
            <p className="text-text-secondary mb-4">Vi bruker informasjonen til å:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Levere og forbedre Tjenesten</li>
              <li>Vise produktinformasjon og anbefalinger</li>
              <li>Synkronisere data på tvers av enheter (hvis du har en konto)</li>
              <li>Kommunisere med deg om oppdateringer og støtte</li>
              <li>Analysere bruksmønstre for å forbedre appen</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">4. Deling av informasjon</h2>
            <p className="text-text-secondary mb-4">
              Vi selger ikke dine personopplysninger. Vi kan dele informasjon med:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li><strong>Tjenesteleverandører:</strong> Supabase (database og autentisering) for å drifte Tjenesten</li>
              <li><strong>Lovpålagte krav:</strong> Når vi er pålagt å gjøre det ved lov</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">5. Datasikkerhet</h2>
            <p className="text-text-secondary mb-4">
              Vi bruker bransjestandarder for sikkerhet, inkludert kryptering under overføring (TLS)
              og sikker lagring. Data lagres hos Supabase i EU-regionen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">6. Dine rettigheter</h2>
            <p className="text-text-secondary mb-4">
              I henhold til GDPR og norsk personvernlovgivning har du rett til å:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Be om innsyn i dine personopplysninger</li>
              <li>Be om retting av feilaktige opplysninger</li>
              <li>Be om sletting av dine opplysninger</li>
              <li>Trekke tilbake samtykke</li>
              <li>Klage til Datatilsynet</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">7. Lagring av data</h2>
            <p className="text-text-secondary mb-4">
              Vi lagrer dine opplysninger så lenge du har en aktiv konto, eller så lenge det er
              nødvendig for å levere Tjenesten. Du kan når som helst be om sletting av kontoen din.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">8. Barn</h2>
            <p className="text-text-secondary mb-4">
              Tjenesten er ikke rettet mot barn under 13 år. Vi samler ikke bevisst inn
              personopplysninger fra barn under 13 år.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">9. Endringer i personvernerklæringen</h2>
            <p className="text-text-secondary mb-4">
              Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vi vil varsle deg
              om vesentlige endringer gjennom appen eller via e-post.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">10. Kontakt oss</h2>
            <p className="text-text-secondary mb-4">
              Hvis du har spørsmål om denne personvernerklæringen eller dine personopplysninger,
              kan du kontakte oss på:
            </p>
            <p className="text-text-secondary">
              E-post: <a href="mailto:hei@matlosen.no" className="text-primary hover:underline">hei@matlosen.no</a>
            </p>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Matlosen. Alle rettigheter reservert.
          </p>
          <div className="flex gap-6">
            <Link
              href="/personvern"
              className="text-primary text-sm font-medium"
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
