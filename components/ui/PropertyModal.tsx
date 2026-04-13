'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

interface PropertyModalProps {
  property: Property
  onClose: () => void
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('fr-FR').format(value) + ' $'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark/70 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative max-h-full w-full max-w-3xl overflow-y-auto bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-dark/60 text-xl text-white transition-colors hover:bg-dark"
          aria-label="Fermer"
        >
          &times;
        </button>

        {/* Main image */}
        <div className="relative aspect-video w-full">
          <Image
            src={property.images[activeIndex]}
            alt={`${property.title} — photo ${activeIndex + 1}`}
            fill
            className="object-cover object-top brightness-110 contrast-90"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <span className="absolute left-4 bottom-4 bg-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            {property.type}
          </span>
        </div>

        {/* Thumbnails */}
        {property.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto bg-dark/5 p-3">
            {property.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'relative h-12 w-18 flex-shrink-0 overflow-hidden border-2 transition-colors',
                  i === activeIndex
                    ? 'border-primary'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <Image
                  src={img}
                  alt={`${property.title} — miniature ${i + 1}`}
                  fill
                  className="object-cover object-center brightness-110 contrast-90"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-dark sm:text-3xl">
            {property.title}
          </h2>

          {/* Key stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-border py-6 sm:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">📍 Location</p>
              <p className="mt-1 text-lg font-semibold text-dark">{formatPrice(property.price_rent)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">🏠 Achat</p>
              <p className="mt-1 text-lg font-semibold text-dark">{formatPrice(property.price_buy)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">👥 Habitabilité</p>
              <p className="mt-1 text-lg font-semibold text-dark">{property.habitants} habitant{property.habitants > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">📦 Capacité</p>
              <p className="mt-1 text-lg font-semibold text-dark">{property.capacity} kg</p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 leading-relaxed text-dark/80">
            {property.description}
          </p>

          {/* CTA */}
          <Link
            href="/contact"
            className="mt-8 inline-block w-full bg-primary py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark sm:w-auto sm:px-10"
          >
            Contacter un agent
          </Link>
        </div>
      </div>
    </div>
  )
}
