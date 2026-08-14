import Link from 'next/link'
import { notFound } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'
import DeletePropertyButton from '@/components/admin/DeletePropertyButton'
import { getPropertyById } from '@/lib/properties'
import { getPropertyTypes } from '@/lib/property-types'
import { updateProperty } from '@/app/admin/actions'

export const dynamic = 'force-dynamic'

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [property, types] = await Promise.all([
    getPropertyById(id),
    getPropertyTypes(),
  ])

  if (!property) notFound()

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">
            {property.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {property.published ? 'Publie sur le site' : 'Brouillon, invisible du public'}
            {property.featured && ' · en vedette'}
          </p>
        </div>
        <Link
          href="/admin/biens"
          className="text-sm text-muted transition-colors hover:text-primary"
        >
          &larr; Retour a la liste
        </Link>
      </div>

      <div className="mt-8">
        <PropertyForm
          action={updateProperty}
          types={types}
          property={property}
          submitLabel="Enregistrer"
        />
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Zone sensible
        </p>
        <p className="mt-2 text-sm text-muted">
          La suppression est definitive et retire aussi les photos televersees
          pour ce bien.
        </p>
        <div className="mt-4">
          <DeletePropertyButton id={property.id} title={property.title} />
        </div>
      </div>
    </div>
  )
}
