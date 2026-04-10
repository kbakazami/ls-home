'use client'

import { useMemo, useState } from 'react'
import PropertyCard from '@/components/ui/PropertyCard'
import PropertyModal from '@/components/ui/PropertyModal'
import FadeInOnScroll from '@/components/ui/FadeInOnScroll'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

interface PropertyGridProps {
  properties: Property[]
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  const [selectedType, setSelectedType] = useState<string>('Tous')
  const [activeProperty, setActiveProperty] = useState<Property | null>(null)

  const types = useMemo(
    () => ['Tous', ...Array.from(new Set(properties.map((p) => p.type)))],
    [properties],
  )

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (selectedType !== 'Tous' && p.type !== selectedType) return false
        return true
      }),
    [properties, selectedType],
  )

  return (
    <>
      {/* Filters */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Type de bien
        </p>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={cn(
                'border px-4 py-2 text-sm transition-colors',
                selectedType === type
                  ? 'border-primary bg-primary font-semibold text-white'
                  : 'border-border text-muted hover:border-primary hover:text-primary',
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-8 text-sm text-muted">
        {filtered.length} bien{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((property, index) => (
          <FadeInOnScroll key={property.id} delay={index % 3 * 0.1}>
            <PropertyCard
              property={property}
              onClick={() => setActiveProperty(property)}
              priority={index < 3}
            />
          </FadeInOnScroll>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-muted">
          Aucun bien ne correspond a vos criteres.
        </p>
      )}

      {/* Modal */}
      {activeProperty && (
        <PropertyModal
          property={activeProperty}
          onClose={() => setActiveProperty(null)}
        />
      )}
    </>
  )
}
