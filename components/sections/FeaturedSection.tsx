import PropertyCard from '@/components/ui/PropertyCard'
import FadeInOnScroll from '@/components/ui/FadeInOnScroll'
import type { Property } from '@/types/property'

interface FeaturedSectionProps {
  properties: Property[]
}

export default function FeaturedSection({ properties }: FeaturedSectionProps) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Selection
        </p>
        <h2 className="text-center font-display text-3xl font-bold text-dark sm:text-4xl">
          Biens en vedette
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted">
          Nos coups de coeur du moment, selectionnes par nos agents pour leur
          emplacement, leur standing et leur potentiel.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <FadeInOnScroll key={property.id} delay={index * 0.1}>
              <PropertyCard property={property} priority={index < 3} />
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
