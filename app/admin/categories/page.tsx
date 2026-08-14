import CategoryRow from '@/components/admin/CategoryRow'
import NewCategoryForm from '@/components/admin/NewCategoryForm'
import { getPropertyTypes, getPropertyTypeUsage } from '@/lib/property-types'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const [types, usage] = await Promise.all([
    getPropertyTypes(),
    getPropertyTypeUsage(),
  ])

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark">Categories</h1>
      <p className="mt-2 text-muted">
        Types de biens proposes dans le formulaire. Renommer une categorie met a
        jour tous les biens qui l&apos;utilisent ; une categorie encore utilisee
        ne peut pas etre supprimee.
      </p>

      {types.length === 0 ? (
        <p className="mt-8 border border-border bg-surface px-6 py-12 text-center text-muted">
          Aucune categorie. Ajoutez-en une pour pouvoir creer des biens.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {types.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              usage={usage.get(category.label) ?? 0}
              isFirst={index === 0}
              isLast={index === types.length - 1}
            />
          ))}
        </ul>
      )}

      <div className="mt-10">
        <NewCategoryForm />
      </div>
    </div>
  )
}
