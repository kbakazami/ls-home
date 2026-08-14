'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import { slugify } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PROPERTY_TYPES, type Property } from '@/types/property'
import type { ActionState } from '@/app/admin/actions'

interface PropertyFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  property?: Property
  submitLabel: string
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-widest text-muted"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full border border-border bg-surface px-4 py-3 text-dark outline-none focus:border-primary'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? 'Enregistrement...' : label}
    </button>
  )
}

export default function PropertyForm({
  action,
  property,
  submitLabel,
}: PropertyFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {})
  const isEdit = Boolean(property)

  const [title, setTitle] = useState(property?.title ?? '')
  const [id, setId] = useState(property?.id ?? '')
  const [idTouched, setIdTouched] = useState(isEdit)
  const [images, setImages] = useState<string[]>(property?.images ?? [])

  const errors = state.fieldErrors ?? {}

  function onTitleChange(value: string) {
    setTitle(value)
    if (!idTouched) setId(slugify(value))
  }

  return (
    <form action={formAction} className="space-y-8">
      {isEdit && <input type="hidden" name="original_id" value={property!.id} />}

      {state.error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Titre" htmlFor="title" error={errors.title}>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="Identifiant"
          htmlFor="id"
          error={errors.id}
          hint="Genere depuis le titre. Sert d'URL interne, evitez de le changer une fois publie."
        >
          <input
            id="id"
            name="id"
            value={id}
            onChange={(e) => {
              setIdTouched(true)
              setId(slugify(e.target.value))
            }}
            required
            className={cn(inputClass, 'font-mono text-sm')}
          />
        </Field>

        <Field label="Type de bien" htmlFor="type" error={errors.type}>
          <select
            id="type"
            name="type"
            defaultValue={property?.type ?? 'Appartement'}
            className={inputClass}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Ordre d'affichage"
          htmlFor="sort_order"
          error={errors.sort_order}
          hint="Les valeurs les plus basses apparaissent en premier."
        >
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={property?.sort_order ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Loyer mensuel ($)" htmlFor="price_rent" error={errors.price_rent}>
          <input
            id="price_rent"
            name="price_rent"
            type="number"
            min={0}
            defaultValue={property?.price_rent ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Prix d'achat ($)" htmlFor="price_buy" error={errors.price_buy}>
          <input
            id="price_buy"
            name="price_buy"
            type="number"
            min={0}
            defaultValue={property?.price_buy ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Habitants maximum" htmlFor="habitants" error={errors.habitants}>
          <input
            id="habitants"
            name="habitants"
            type="number"
            min={0}
            defaultValue={property?.habitants ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Capacite de stockage (kg)" htmlFor="capacity" error={errors.capacity}>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={0}
            defaultValue={property?.capacity ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={property?.description ?? ''}
          className={inputClass}
        />
      </Field>

      <ImageUploader
        folder={id}
        images={images}
        onChange={setImages}
        error={errors.images}
      />

      <div className="flex flex-wrap gap-6 border-t border-border pt-6">
        <label className="flex items-center gap-3 text-sm text-dark">
          <input
            type="checkbox"
            name="published"
            defaultChecked={property?.published ?? false}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          Publier sur le site
        </label>

        <label className="flex items-center gap-3 text-sm text-dark">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={property?.featured ?? false}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          Mettre en vedette sur la page d&apos;accueil
        </label>
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton label={submitLabel} />
        <Link
          href="/admin/biens"
          className="text-sm text-muted transition-colors hover:text-primary"
        >
          Annuler
        </Link>
      </div>
    </form>
  )
}
