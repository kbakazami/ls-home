import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
})

const siteTitle = 'LS HOME — Immobilier de prestige a Los Santos'
const siteDescription =
  'Agence immobiliere de prestige a Los Santos. Villas, appartements et penthouses dans les quartiers les plus exclusifs.'
const logoPath = '/images/brand/ls-homes-logo.png'

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: logoPath,
    shortcut: logoPath,
    apple: logoPath,
  },
  // Apercu au partage d'un lien (Discord, reseaux) : le logo sur fond sombre.
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: 'LS HOME',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: logoPath, width: 1024, height: 1024, alt: 'Los Santos Homes' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  )
}
