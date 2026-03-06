import type { Metadata } from 'next'
import { Header, Footer } from '@/components'

export const metadata: Metadata = {
  title: 'Personvernerklæring - Matlosen',
  description: 'Personvernerklæring for Matlosen-appen. Les om hvordan vi samler inn, bruker og beskytter dine personopplysninger.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen">
      <Header showDownloadButton={false} />

      {/* Content */}
      <article className="pt-hero-top pb-section px-container">
        <div className="max-w-content mx-auto prose prose-lg">
          <h1 className="text-3xl font-bold mb-2 text-text-primary">Personvernerklæring</h1>
          <p className="text-text-muted mb-8">Sist oppdatert: 6. mars 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">1. Behandlingsansvarlig</h2>
            <p className="text-text-secondary mb-4">
              Behandlingsansvarlig for personopplysninger som samles inn gjennom Matlosen-appen («Tjenesten») er:
            </p>
            <p className="text-text-secondary mb-4">
              <strong>Fenrir Invest AS</strong><br />
              Org.nr. 934 914 538<br />
              Hyggenveien 54, 3442 Hyggen<br />
              E-post: <a href="mailto:hei@matlosen.no" className="text-primary hover:underline">hei@matlosen.no</a>
            </p>
            <p className="text-text-secondary mb-4">
              Denne personvernerklæringen forklarer hvordan vi samler inn, bruker, deler og beskytter
              informasjon når du bruker Tjenesten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">2. Informasjon vi samler inn</h2>

            <h3 className="text-lg font-medium mb-2 text-text-primary">2.1 Informasjon du gir oss</h3>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Kontoinformasjon (e-post) ved registrering</li>
              <li>Profilinformasjon (alder, kjønn) fra introduksjonsflyten</li>
              <li>Preferanser og innstillinger du velger i appen</li>
              <li>Produktbilder du sender inn for analyse</li>
              <li>Tilbakemeldinger og henvendelser du sender til oss</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-text-primary">2.2 Informasjon vi samler automatisk</h3>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Produkter du skanner (strekkoder)</li>
              <li>Bruksstatistikk og hendelser i appen (via PostHog)</li>
              <li>Feilrapporter og krasjdata (via Sentry)</li>
              <li>Teknisk informasjon om enheten din (operativsystem, app-versjon, enhetstype)</li>
              <li>Abonnements- og kjøpsinformasjon (via RevenueCat og Apple)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">3. Behandlingsgrunnlag</h2>
            <p className="text-text-secondary mb-4">
              Vi behandler personopplysninger basert på følgende rettslige grunnlag i henhold til GDPR:
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm text-text-secondary">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-text-primary">Datatype</th>
                    <th className="text-left py-2 pr-4 font-semibold text-text-primary">Grunnlag</th>
                    <th className="text-left py-2 font-semibold text-text-primary">Formål</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Kontoinformasjon (e-post)</td>
                    <td className="py-2 pr-4">Avtale (art. 6(1)(b))</td>
                    <td className="py-2">Opprette og administrere konto</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Profildata (alder, kjønn)</td>
                    <td className="py-2 pr-4">Samtykke (art. 6(1)(a))</td>
                    <td className="py-2">Tilpasse innhold og anbefalinger</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Produktskanninger</td>
                    <td className="py-2 pr-4">Avtale (art. 6(1)(b))</td>
                    <td className="py-2">Levere kjernefunksjonalitet</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Produktbilder (AI-analyse)</td>
                    <td className="py-2 pr-4">Avtale (art. 6(1)(b))</td>
                    <td className="py-2">Identifisere produktinformasjon</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Bruksstatistikk</td>
                    <td className="py-2 pr-4">Berettiget interesse (art. 6(1)(f))</td>
                    <td className="py-2">Forbedre tjenesten</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Krasjdata og feilrapporter</td>
                    <td className="py-2 pr-4">Berettiget interesse (art. 6(1)(f))</td>
                    <td className="py-2">Feilretting og stabilitet</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Kjøps- og abonnementsdata</td>
                    <td className="py-2 pr-4">Avtale (art. 6(1)(b))</td>
                    <td className="py-2">Administrere abonnement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">4. Hvordan vi bruker informasjonen</h2>
            <p className="text-text-secondary mb-4">Vi bruker informasjonen til å:</p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li>Levere og forbedre Tjenesten</li>
              <li>Vise produktinformasjon og anbefalinger</li>
              <li>Analysere produktbilder ved hjelp av kunstig intelligens (Google Gemini)</li>
              <li>Administrere abonnementer og betalinger</li>
              <li>Synkronisere data på tvers av enheter</li>
              <li>Analysere bruksmønstre for å forbedre appen</li>
              <li>Identifisere og rette tekniske feil</li>
              <li>Kommunisere med deg om oppdateringer og støtte</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">5. Deling av informasjon og databehandlere</h2>
            <p className="text-text-secondary mb-4">
              Vi selger ikke dine personopplysninger. Vi bruker følgende databehandlere for å drifte Tjenesten:
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm text-text-secondary">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-text-primary">Leverandør</th>
                    <th className="text-left py-2 pr-4 font-semibold text-text-primary">Formål</th>
                    <th className="text-left py-2 font-semibold text-text-primary">Datalagring</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Supabase</td>
                    <td className="py-2 pr-4">Database, autentisering og serverløse funksjoner</td>
                    <td className="py-2">EU</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">PostHog</td>
                    <td className="py-2 pr-4">Produktanalyse og funksjonsflagg</td>
                    <td className="py-2">EU</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Sentry</td>
                    <td className="py-2 pr-4">Feilsporing og krasjrapportering</td>
                    <td className="py-2">USA</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">RevenueCat</td>
                    <td className="py-2 pr-4">Abonnementshåndtering og kjøpshistorikk</td>
                    <td className="py-2">USA</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Google (Gemini API)</td>
                    <td className="py-2 pr-4">AI-analyse av produktbilder</td>
                    <td className="py-2">USA</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">Apple</td>
                    <td className="py-2 pr-4">Betalingsbehandling via App Store</td>
                    <td className="py-2">USA/Irland</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-text-secondary mb-4">
              Vi kan også dele informasjon når vi er pålagt å gjøre det ved lov.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">6. Overføring av data til land utenfor EU/EØS</h2>
            <p className="text-text-secondary mb-4">
              Noen av våre databehandlere (Sentry, RevenueCat, Google og Apple) lagrer data i USA.
              Disse overføringene er sikret gjennom EUs standardkontraktsklausuler (Standard Contractual Clauses, SCCs)
              i henhold til GDPR artikkel 46(2)(c). Vi har verifisert at alle leverandører har inngått
              databehandleravtaler som inkluderer passende sikkerhetstiltak.
            </p>
            <p className="text-text-secondary mb-4">
              Supabase og PostHog lagrer data i EU-regionen, og ingen overføring til tredjeland finner sted for disse tjenestene.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">7. Datasikkerhet</h2>
            <p className="text-text-secondary mb-4">
              Vi bruker bransjestandarder for sikkerhet, inkludert kryptering under overføring (TLS)
              og sikker lagring. Hoveddatabasen lagres hos Supabase i EU-regionen.
              Alle databehandlere er valgt med tanke på personvern og sikkerhet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">8. Lagringstid</h2>
            <p className="text-text-secondary mb-4">
              Vi lagrer personopplysninger kun så lenge det er nødvendig for formålet de ble samlet inn for:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li><strong>Kontoinformasjon:</strong> Så lenge du har en aktiv konto. Slettes innen 30 dager etter at du ber om sletting.</li>
              <li><strong>Profildata (alder, kjønn):</strong> Så lenge du har en aktiv konto.</li>
              <li><strong>Bruksstatistikk (PostHog):</strong> Anonymiserte data lagres i opptil 12 måneder.</li>
              <li><strong>Krasjdata (Sentry):</strong> Lagres i opptil 90 dager.</li>
              <li><strong>Abonnementsdata (RevenueCat):</strong> Så lenge abonnementet er aktivt, pluss det som kreves av regnskapslovgivning.</li>
              <li><strong>Produktbilder (AI-analyse):</strong> Behandles i sanntid og lagres ikke etter analysen er fullført.</li>
            </ul>
            <p className="text-text-secondary mb-4">
              Du kan når som helst be om sletting av kontoen din og tilknyttede data ved å kontakte oss.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">9. Dine rettigheter</h2>
            <p className="text-text-secondary mb-4">
              I henhold til GDPR og norsk personvernlovgivning har du rett til å:
            </p>
            <ul className="list-disc pl-6 text-text-secondary mb-4">
              <li><strong>Innsyn:</strong> Be om en kopi av dine personopplysninger</li>
              <li><strong>Retting:</strong> Be om retting av feilaktige opplysninger</li>
              <li><strong>Sletting:</strong> Be om sletting av dine opplysninger</li>
              <li><strong>Begrensning:</strong> Be om begrensning av behandlingen</li>
              <li><strong>Dataportabilitet:</strong> Motta dine data i et maskinlesbart format</li>
              <li><strong>Innsigelse:</strong> Protestere mot behandling basert på berettiget interesse</li>
              <li><strong>Trekke tilbake samtykke:</strong> Når behandlingen er basert på samtykke</li>
            </ul>
            <p className="text-text-secondary mb-4">
              For å utøve dine rettigheter, kontakt oss på{' '}
              <a href="mailto:hei@matlosen.no" className="text-primary hover:underline">hei@matlosen.no</a>.
              Vi vil svare innen 30 dager.
            </p>
            <p className="text-text-secondary mb-4">
              Du har også rett til å klage til Datatilsynet (<a href="https://www.datatilsynet.no" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">datatilsynet.no</a>) dersom du mener
              at vi behandler personopplysningene dine i strid med regelverket.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">10. Barn</h2>
            <p className="text-text-secondary mb-4">
              Tjenesten er ikke rettet mot barn under 15 år. Vi samler ikke bevisst inn
              personopplysninger fra barn under 15 år, i tråd med norsk personopplysningslov § 5.
              Dersom vi oppdager at vi har samlet inn data fra et barn under 15 år,
              vil vi slette opplysningene umiddelbart.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">11. Endringer i personvernerklæringen</h2>
            <p className="text-text-secondary mb-4">
              Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vi vil varsle deg
              om vesentlige endringer gjennom appen eller via e-post. Fortsatt bruk av Tjenesten
              etter endringer utgjør aksept av den oppdaterte erklæringen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">12. Kontakt oss</h2>
            <p className="text-text-secondary mb-4">
              Hvis du har spørsmål om denne personvernerklæringen eller dine personopplysninger,
              kan du kontakte oss på:
            </p>
            <p className="text-text-secondary">
              Fenrir Invest AS<br />
              Hyggenveien 54, 3442 Hyggen<br />
              E-post: <a href="mailto:hei@matlosen.no" className="text-primary hover:underline">hei@matlosen.no</a>
            </p>
          </section>
        </div>
      </article>

      <Footer activeLink="personvern" />
    </main>
  )
}
