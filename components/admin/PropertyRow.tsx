'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { toggleFlag } from '@/app/admin/actions'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

function ToggleButton({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean
  activeLabel: string
  inactiveLabel: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50',
        active
          ? 'border-primary bg-primary-light text-primary-dark'
          : 'border-border text-muted hover:border-primary hover:text-primary',
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </button>
  )
}

function Toggle({
  id,
  field,
  value,
  activeLabel,
  inactiveLabel,
}: {
  id: string
  field: 'published' | 'featured'
  value: boolean
  activeLabel: string
  inactiveLabel: string
}) {
  return (
    <form action={toggleFlag}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(value)} />
      <ToggleButton
        active={value}
        activeLabel={activeLabel}
        inactiveLabel={inactiveLabel}
      />
    </form>
  )
}

export default function PropertyRow({ property }: { property: Property }) {
  return (
    <li className="flex flex-wrap items-center gap-4 border border-border bg-surface p-4">
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden bg-border">
        {property.images[0] && (
          <Image
            src={property.images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        )}
      </div>

      <div className="min-w-[12rem] flex-1">
        <Link
          href={`/admin/biens/${property.id}`}
          className="font-display font-semibold text-dark transition-colors hover:text-primary"
        >
          {property.title}
        </Link>
        <p className="mt-0.5 text-xs text-muted">
          {property.type} · {formatPrice(property.price_rent)} / mois ·{' '}
          {formatPrice(property.price_buy)} a l&apos;achat
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-muted">{property.id}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Toggle
          id={property.id}
          field="published"
          value={property.published}
          activeLabel="Publie"
          inactiveLabel="Brouillon"
        />
        <Toggle
          id={property.id}
          field="featured"
          value={property.featured}
          activeLabel="En vedette"
          inactiveLabel="Standard"
        />
        <Link
          href={`/admin/biens/${property.id}`}
          className="border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
        >
          Modifier
        </Link>
      </div>
    </li>
  )
}
