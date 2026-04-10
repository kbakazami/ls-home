import Image from 'next/image'
import type { Property } from '@/types/property'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  priority?: boolean
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' $'
}

export default function PropertyCard({ property, onClick, priority = false }: PropertyCardProps) {
  return (
    <article
      className="group cursor-pointer overflow-hidden border border-border bg-surface transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <span>📍 Location : {formatPrice(property.price_rent)}</span>
          <span>🏠 Achat : {formatPrice(property.price_buy)}</span>
          <span>👥 Habitabilité : {property.habitants} habitant{property.habitants > 1 ? 's' : ''}</span>
          <span>📦 Capacité : {property.capacity} kg</span>
        </div>
      </div>
    </article>
  )
}
