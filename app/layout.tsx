import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LS HOME — Immobilier de prestige a Los Santos',
  description:
    'Agence immobiliere de prestige a Los Santos. Villas, appartements et penthouses dans les quartiers les plus exclusifs.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
