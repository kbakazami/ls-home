import Image from 'next/image'
import {
  DEFAULT_OCCUPANCY_LABEL,
  formatCapacity,
  formatOccupancy,
  formatOptionalPrice,
} from '@/lib/format'
import type { Property } from '@/types/property'

/** Visuel neutre affiche tant qu'aucune photo n'a ete televersee. */
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%23e2e8f0%22/%3E%3C/svg%3E'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  priority?: boolean
  /** Unite d'occupation de la categorie, au singulier. */
  occupancyLabel?: string
}

export default function PropertyCard({
  property,
  onClick,
  priority = false,
  occupancyLabel = DEFAULT_OCCUPANCY_LABEL,
}: PropertyCardProps) {
  return (
    <article
      className="group cursor-pointer overflow-hidden border border-border bg-surface transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-border">
        <Image
          src={property.images[0] ?? PLACEHOLDER_IMAGE}
          alt={property.title}
          fill
          className="object-cover object-center brightness-110 contrast-90 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
        />
        <span className="absolute left-4 top-4 bg-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-dark">
          {property.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-dark">
          {property.title}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-sm text-dark">
          <span>📍 Location : {formatOptionalPrice(property.price_rent)}</span>
          <span>🏠 Achat : {formatOptionalPrice(property.price_buy)}</span>
          <span>👥 Capacité : {formatOccupancy(property.habitants, occupancyLabel)}</span>
          <span>📦 Stockage : {formatCapacity(property.capacity_min, property.capacity_max)}</span>
        </div>
      </div>
    </article>
  )
}
