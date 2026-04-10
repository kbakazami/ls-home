import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-muted">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-bold tracking-wider text-primary">
              LS HOME
            </span>
            <p className="mt-3 text-sm leading-relaxed">
              Votre agence immobiliere de prestige a Los Santos.
              Villas, appartements et penthouses dans les quartiers les plus prisees.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-display text-xs font-semibold uppercase tracking-widest text-primary">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/properties" className="transition-colors hover:text-primary">
                  Nos biens
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact RP */}
          <div>
            <h3 className="mb-4 font-display text-xs font-semibold uppercase tracking-widest text-primary">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Bureau : 45 Portola Drive, Rockford Hills</li>
              <li>Tel : 555-0187</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-muted/20 pt-6 text-center text-xs text-muted/60">
          &copy; {new Date().getFullYear()} LS HOME — Los Santos. Tous droits reserves.
        </div>
      </div>
    </footer>
  )
}
