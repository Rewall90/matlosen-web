import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Matlosen - Spis renere. Lev bedre.',
  description: 'Matlosen hjelper deg å finne ren mat uten ultraprosesserte tilsetningsstoffer. Skann produkter, finn sunnere alternativer, og oppdag rene oppskrifter.',
  metadataBase: new URL('https://matlosen.no'),
  openGraph: {
    title: 'Matlosen - Spis renere. Lev bedre.',
    description: 'Matlosen hjelper deg å finne ren mat uten ultraprosesserte tilsetningsstoffer.',
    url: 'https://matlosen.no',
    siteName: 'Matlosen',
    locale: 'nb_NO',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nb">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
