import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="bg-dark py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Trouvez le bien de vos reves
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/60">
          Parcourez l&apos;ensemble de notre catalogue et contactez nos agents
          pour une visite personnalisee.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/properties"
            className="inline-block bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
          >
            Voir tous les biens
          </Link>
          <Link
            href="/contact"
            className="inline-block border-2 border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:border-primary hover:text-primary"
          >
            Contacter un agent
          </Link>
        </div>
      </div>
    </section>
  )
}
