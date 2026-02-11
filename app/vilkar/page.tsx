import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bruksvilkår - Matlosen',
  description: 'Bruksvilkår for Matlosen-appen. Les om vilkårene for bruk av tjenesten.',
}

export default function TermsOfUse() {
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
          <h1 className="text-3xl font-bold mb-2 text-text-primary">Bruksvilkår</h1>
          <p className="text-text-muted mb-8">Sist oppdatert: {new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">1. Aksept av vilkår</h2>
            <p className="text-text-secondary mb-4">
              Ved å laste ned, installere eller bruke Matlosen-appen («Tjenesten»), godtar du
              å være bundet av disse bruksvilkårene («Vilkårene»). Hvis du ikke godtar Vilkårene,
              skal du ikke bruke Tjenesten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">2. Beskrivelse av tjenesten</h2>
            <p className="text-text-secondary mb-4">
              Matlosen er en app som hjelper brukere med å identifisere ultraprosessert mat,
              finne sunnere alternativer, og oppdage rene oppskrifter. Tjenesten gir informasjon
              basert på offentlig tilgjengelige data om matvarer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">3. Bruk av tjenesten</h2>
            <p className="text-text-secondary mb-4">Du samtykker til å:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Bruke Tjenesten kun til lovlige formål</li>
              <li>Ikke misbruke, hacke eller forstyrre Tjenesten</li>
              <li>Ikke bruke automatiserte verktøy for å hente data fra Tjenesten</li>
              <li>Oppgi korrekt informasjon når du oppretter en konto</li>
              <li>Holde påloggingsinformasjon konfidensiell</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">4. Informasjonens nøyaktighet</h2>
            <p className="text-text-secondary mb-4">
              Produktinformasjon i Tjenesten er hentet fra offentlige kilder og kan inneholde
              feil eller være utdatert. Matlosen gir ingen garantier for nøyaktigheten av
              informasjonen. Du bør alltid verifisere produktinformasjon mot produktets faktiske
              emballasje, spesielt ved allergier eller kostholdsrestriksjoner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">5. Helseinformasjon</h2>
            <p className="text-text-secondary mb-4">
              Informasjonen i Tjenesten er kun ment for generelle opplysningsformål og utgjør
              ikke medisinsk rådgivning. Rådfør deg alltid med kvalifisert helsepersonell før
              du gjør endringer i kostholdet ditt, spesielt hvis du har helseproblemer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">6. Immaterielle rettigheter</h2>
            <p className="text-text-secondary mb-4">
              Tjenesten og alt innhold, funksjoner og funksjonalitet er eid av Matlosen og er
              beskyttet av norsk og internasjonal lovgivning om opphavsrett, varemerker og
              andre immaterielle rettigheter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">7. Ansvarsbegrensning</h2>
            <p className="text-text-secondary mb-4">
              Tjenesten leveres «som den er» uten garantier av noe slag. Matlosen er ikke
              ansvarlig for indirekte, tilfeldige eller følgeskader som oppstår fra bruk
              eller manglende evne til å bruke Tjenesten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">8. Endringer i tjenesten</h2>
            <p className="text-text-secondary mb-4">
              Vi forbeholder oss retten til å endre, suspendere eller avvikle Tjenesten
              når som helst uten varsel. Vi er ikke ansvarlige overfor deg eller tredjeparter
              for slike endringer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">9. Oppsigelse</h2>
            <p className="text-text-secondary mb-4">
              Vi kan avslutte eller suspendere tilgangen din til Tjenesten umiddelbart,
              uten forvarsel, hvis du bryter disse Vilkårene. Ved oppsigelse opphører
              din rett til å bruke Tjenesten umiddelbart.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">10. Endringer i vilkårene</h2>
            <p className="text-text-secondary mb-4">
              Vi kan oppdatere disse Vilkårene fra tid til annen. Ved vesentlige endringer
              vil vi varsle deg gjennom appen. Fortsatt bruk av Tjenesten etter endringer
              utgjør aksept av de nye Vilkårene.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">11. Lovvalg</h2>
            <p className="text-text-secondary mb-4">
              Disse Vilkårene er underlagt norsk lov. Eventuelle tvister skal løses ved
              norske domstoler.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">12. Kontakt oss</h2>
            <p className="text-text-secondary mb-4">
              Hvis du har spørsmål om disse bruksvilkårene, kan du kontakte oss på:
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
              className="text-text-secondary text-sm hover:text-primary transition-colors"
            >
              Personvernerklæring
            </Link>
            <Link
              href="/vilkar"
              className="text-primary text-sm font-medium"
            >
              Bruksvilkår
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
