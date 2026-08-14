import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

/** Habillage du site vitrine. L'administration et la connexion n'en heritent pas. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
