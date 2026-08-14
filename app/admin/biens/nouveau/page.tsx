import Link from 'next/link'
import PropertyForm from '@/components/admin/PropertyForm'
import { createProperty } from '@/app/admin/actions'
import { getPropertyTypes } from '@/lib/property-types'

export const dynamic = 'force-dynamic'

export default async function NewPropertyPage() {
  const types = await getPropertyTypes()

  if (types.length === 0) {
    return (
      <div className="border border-border bg-surface px-6 py-12 text-center">
        <p className="font-display text-lg text-dark">Aucune categorie definie</p>
        <p className="mt-2 text-sm text-muted">
          Creez au moins une categorie avant d&apos;ajouter un bien.
        </p>
        <Link
          href="/admin/categories"
          className="mt-6 inline-block bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
        >
          Gerer les categories
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark">
        Nouveau bien
      </h1>
      <p className="mt-2 text-muted">
        Le bien reste invisible sur le site tant qu&apos;il n&apos;est pas publie.
      </p>

      <div className="mt-8">
        <PropertyForm
          action={createProperty}
          types={types}
          submitLabel="Creer le bien"
        />
      </div>
    </div>
  )
}
