import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80)',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Agence immobiliere de prestige
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          L&apos;immobilier de prestige
          <br />
          <span className="text-primary">a Los Santos</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Villas, penthouses et appartements d&apos;exception dans les quartiers
          les plus exclusifs de la ville.
        </p>
        <Link
          href="/properties"
          className="mt-10 inline-block bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
        >
          Decouvrir nos biens
        </Link>
      </div>
    </section>
  )
}
