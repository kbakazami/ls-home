'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import { DEFAULT_OCCUPANCY_LABEL, occupancyHeading, slugify } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Property, PropertyTypeOption } from '@/types/property'
import type { ActionState } from '@/app/admin/actions'

interface PropertyFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  types: PropertyTypeOption[]
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

/**
 * Prix assorti d'une case de disponibilite. Decocher desactive le champ :
 * le prix est alors enregistre a null, soit « non disponible ».
 */
function PriceField({
  label,
  name,
  availabilityName,
  availabilityLabel,
  initialPrice,
  error,
}: {
  label: string
  name: string
  availabilityName: string
  availabilityLabel: string
  initialPrice: number | null
  error?: string
}) {
  const [available, setAvailable] = useState(initialPrice !== null)

  return (
    <Field label={label} htmlFor={name} error={error}>
      <input
        id={name}
        name={name}
        type="number"
        min={1}
        required={available}
        disabled={!available}
        defaultValue={initialPrice ?? ''}
        placeholder={available ? undefined : 'Non disponible'}
        className={cn(
          inputClass,
          !available && 'cursor-not-allowed bg-light text-muted',
        )}
      />
      <label className="mt-2 flex items-center gap-2 text-sm text-dark">
        <input
          type="checkbox"
          name={availabilityName}
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
        {availabilityLabel}
      </label>
    </Field>
  )
}

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
  types,
  property,
  submitLabel,
}: PropertyFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {})
  const isEdit = Boolean(property)

  const [title, setTitle] = useState(property?.title ?? '')
  const [id, setId] = useState(property?.id ?? '')
  const [idTouched, setIdTouched] = useState(isEdit)
  const [images, setImages] = useState<string[]>(property?.images ?? [])
  const [selectedType, setSelectedType] = useState(
    property?.type ?? types[0]?.label ?? '',
  )

  const errors = state.fieldErrors ?? {}

  // L'unite d'occupation vient de la categorie : un garage compte des
  // vehicules la ou une villa compte des habitants.
  const occupancyUnit =
    types.find((t) => t.label === selectedType)?.occupancy_label ??
    DEFAULT_OCCUPANCY_LABEL

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

        <Field
          label="Categorie"
          htmlFor="type"
          error={errors.type}
          hint="Gerez la liste depuis l'onglet Categories."
        >
          <select
            id="type"
            name="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={inputClass}
          >
            {types.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
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

        <PriceField
          label="Loyer mensuel ($)"
          name="price_rent"
          availabilityName="rent_available"
          availabilityLabel="Disponible a la location"
          initialPrice={property?.price_rent ?? null}
          error={errors.price_rent}
        />

        <PriceField
          label="Prix d'achat ($)"
          name="price_buy"
          availabilityName="buy_available"
          availabilityLabel="Disponible a l'achat"
          initialPrice={property?.price_buy ?? null}
          error={errors.price_buy}
        />

        <Field
          label={`${occupancyHeading(occupancyUnit)} maximum`}
          htmlFor="habitants"
          error={errors.habitants}
          hint="Unite definie par la categorie, dans l'onglet Categories."
        >
          <input
            id="habitants"
            name="habitants"
            type="number"
            min={0}
            defaultValue={property?.habitants ?? 0}
            className={inputClass}
          />
        </Field>

        <Field
          label="Capacite de stockage (kg)"
          htmlFor="capacity_min"
          error={errors.capacity_min ?? errors.capacity_max}
          hint="Mettez la meme valeur des deux cotes pour une capacite fixe."
        >
          <div className="flex items-center gap-3">
            <input
              id="capacity_min"
              name="capacity_min"
              type="number"
              min={0}
              defaultValue={property?.capacity_min ?? 0}
              aria-label="Capacite minimum"
              className={inputClass}
            />
            <span className="text-muted">&ndash;</span>
            <input
              id="capacity_max"
              name="capacity_max"
              type="number"
              min={0}
              defaultValue={property?.capacity_max ?? 0}
              aria-label="Capacite maximum"
              className={inputClass}
            />
          </div>
        </Field>
      </div>

      <Field
        label="Coloris"
        htmlFor="coloris"
        error={errors.coloris}
        hint="Texte libre, laissez vide si non concerne. Ex. : Beige, Vert, Bleu"
      >
        <input
          id="coloris"
          name="coloris"
          maxLength={120}
          placeholder="Beige, Vert, Bleu"
          defaultValue={property?.coloris ?? ''}
          className={inputClass}
        />
      </Field>

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
