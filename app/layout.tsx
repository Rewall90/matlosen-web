import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-outfit',
})

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
  twitter: {
    card: 'summary',
    title: 'Matlosen - Spis renere. Lev bedre.',
    description: 'Matlosen hjelper deg å finne ren mat uten ultraprosesserte tilsetningsstoffer.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nb" className={outfit.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
