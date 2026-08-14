'use client'

import { useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createCategory, type CategoryState } from '@/app/admin/categories/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? 'Creation...' : 'Ajouter'}
    </button>
  )
}

export default function NewCategoryForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState<CategoryState, FormData>(
    async (prev, formData) => {
      const result = await createCategory(prev, formData)
      if (result.success) formRef.current?.reset()
      return result
    },
    {},
  )

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border border-border bg-surface p-6"
    >
      <h2 className="font-display text-lg font-semibold text-dark">
        Ajouter une categorie
      </h2>
      <p className="mt-1 text-sm text-muted">
        Elle sera immediatement proposee dans le formulaire des biens, et
        apparaitra comme filtre sur le catalogue des qu&apos;un bien publie
        l&apos;utilisera.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[16rem] flex-1">
          <label
            htmlFor="new_category"
            className="text-xs font-semibold uppercase tracking-widest text-muted"
          >
            Libelle
          </label>
          <input
            id="new_category"
            name="label"
            required
            minLength={2}
            maxLength={40}
            placeholder="Chambre d'hotel"
            className="mt-2 w-full border border-border bg-surface px-4 py-3 text-dark outline-none focus:border-primary"
          />
        </div>
        <SubmitButton />
      </div>

      {state.error && (
        <p role="alert" className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="mt-4 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.success}
        </p>
      )}
    </form>
  )
}
