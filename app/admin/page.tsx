import Link from 'next/link'
import { getAllProperties } from '@/lib/properties'

export const dynamic = 'force-dynamic'

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="border border-border bg-surface p-6">
      <p className="font-display text-4xl font-bold text-dark">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted">{label}</p>
    </div>
  )
}

export default async function AdminHome() {
  const properties = await getAllProperties()

  const published = properties.filter((p) => p.published)
  const drafts = properties.filter((p) => !p.published)
  const featured = published.filter((p) => p.featured)

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark">
        Tableau de bord
      </h1>
      <p className="mt-2 text-muted">
        Vue d&apos;ensemble du catalogue LS HOME.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={properties.length} label="Biens au total" />
        <Stat value={published.length} label="Publies" />
        <Stat value={drafts.length} label="Brouillons" />
        <Stat value={featured.length} label="En vedette" />
      </div>

      {featured.length === 0 && published.length > 0 && (
        <p className="mt-6 border border-border bg-surface px-4 py-3 text-sm text-muted">
          Aucun bien n&apos;est en vedette : la section correspondante est masquee
          sur la page d&apos;accueil.
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/biens/nouveau"
          className="bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
        >
          Ajouter un bien
        </Link>
        <Link
          href="/admin/biens"
          className="border border-border px-8 py-3 text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:border-primary hover:text-primary"
        >
          Gerer les biens
        </Link>
      </div>
    </div>
  )
}
