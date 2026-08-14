import PropertyForm from '@/components/admin/PropertyForm'
import { createProperty } from '@/app/admin/actions'

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark">
        Nouveau bien
      </h1>
      <p className="mt-2 text-muted">
        Le bien reste invisible sur le site tant qu&apos;il n&apos;est pas publie.
      </p>

      <div className="mt-8">
        <PropertyForm action={createProperty} submitLabel="Creer le bien" />
      </div>
    </div>
  )
}
