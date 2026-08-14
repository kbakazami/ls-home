import Link from 'next/link'
import PropertyRow from '@/components/admin/PropertyRow'
import { getAllProperties } from '@/lib/properties'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const STATUS_FILTERS = [
  { value: 'tous', label: 'Tous' },
  { value: 'publies', label: 'Publies' },
  { value: 'brouillons', label: 'Brouillons' },
  { value: 'vedette', label: 'En vedette' },
] as const

export default async function PropertiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string }>
}) {
  const { q = '', statut = 'tous' } = await searchParams
  const properties = await getAllProperties()

  const needle = q.trim().toLowerCase()
  const filtered = properties.filter((p) => {
    if (statut === 'publies' && !p.published) return false
    if (statut === 'brouillons' && p.published) return false
    if (statut === 'vedette' && !p.featured) return false
    if (needle && !`${p.title} ${p.id} ${p.type}`.toLowerCase().includes(needle)) {
      return false
    }
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">Biens</h1>
          <p className="mt-2 text-muted">
            {properties.length} bien{properties.length > 1 ? 's' : ''} au catalogue.
          </p>
        </div>
        <Link
          href="/admin/biens/nouveau"
          className="bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
        >
          Ajouter un bien
        </Link>
      </div>

      {/* Recherche et filtres — formulaire GET, aucun etat client necessaire */}
      <form className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un bien..."
          className="min-w-[16rem] flex-1 border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="submit"
              name="statut"
              value={filter.value}
              className={cn(
                'border px-4 py-2.5 text-sm transition-colors',
                statut === filter.value
                  ? 'border-primary bg-primary font-semibold text-white'
                  : 'border-border text-muted hover:border-primary hover:text-primary',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </form>

      {filtered.length === 0 ? (
        <p className="mt-8 border border-border bg-surface px-6 py-12 text-center text-muted">
          {properties.length === 0
            ? "Aucun bien pour l'instant. Commencez par en ajouter un."
            : 'Aucun bien ne correspond a cette recherche.'}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((property) => (
            <PropertyRow key={property.id} property={property} />
          ))}
        </ul>
      )}
    </div>
  )
}
