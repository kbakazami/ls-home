import type { Metadata } from 'next'
import PropertyGrid from '@/components/sections/PropertyGrid'
import properties from '@/data/properties.json'
import type { Property } from '@/types/property'

export const metadata: Metadata = {
  title: 'Nos biens — LS HOME',
  description:
    'Parcourez notre catalogue de villas, appartements, penthouses et locaux commerciaux a Los Santos.',
}

export default function PropertiesPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Catalogue
        </p>
        <h1 className="font-display text-3xl font-bold text-dark sm:text-4xl">
          Nos biens disponibles
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Explorez notre selection de proprietes d&apos;exception dans les quartiers
          les plus prisees de Los Santos. Filtrez par type ou par quartier pour
          trouver le bien ideal.
        </p>

        <div className="mt-12">
          <PropertyGrid properties={properties as Property[]} />
        </div>
      </div>
    </section>
  )
}
