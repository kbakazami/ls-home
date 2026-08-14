'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import {
  deleteCategory,
  moveCategory,
  renameCategory,
  type CategoryState,
} from '@/app/admin/categories/actions'
import type { PropertyTypeOption } from '@/types/property'

function MoveButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-2 py-1 text-muted transition-colors hover:text-primary disabled:opacity-30"
      aria-label={label}
    >
      {label === 'Monter' ? '↑' : '↓'}
    </button>
  )
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? '...' : 'Enregistrer'}
    </button>
  )
}

interface CategoryRowProps {
  category: PropertyTypeOption
  usage: number
  isFirst: boolean
  isLast: boolean
}

export default function CategoryRow({
  category,
  usage,
  isFirst,
  isLast,
}: CategoryRowProps) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [state, formAction] = useActionState<CategoryState, FormData>(
    async (prev, formData) => {
      const result = await renameCategory(prev, formData)
      if (result.success) setEditing(false)
      return result
    },
    {},
  )

  return (
    <li className="border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <form action={moveCategory}>
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="direction" value="up" />
            {!isFirst && <MoveButton label="Monter" />}
          </form>
          <form action={moveCategory}>
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="direction" value="down" />
            {!isLast && <MoveButton label="Descendre" />}
          </form>
        </div>

        <div className="min-w-[12rem] flex-1">
          {editing ? (
            <form action={formAction} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={category.id} />
              <input
                name="label"
                defaultValue={category.label}
                autoFocus
                className="flex-1 border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <SaveButton />
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-2 text-xs text-muted transition-colors hover:text-dark"
              >
                Annuler
              </button>
            </form>
          ) : (
            <>
              <p className="font-display font-semibold text-dark">
                {category.label}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {usage === 0 ? (
                  'Aucun bien'
                ) : (
                  <Link
                    href={`/admin/biens?q=${encodeURIComponent(category.label)}`}
                    className="transition-colors hover:text-primary"
                  >
                    {usage} bien{usage > 1 ? 's' : ''}
                  </Link>
                )}
              </p>
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
            >
              Renommer
            </button>

            {usage === 0 ? (
              confirming ? (
                <form action={deleteCategory} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                  >
                    Confirmer
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="text-xs text-muted transition-colors hover:text-dark"
                  >
                    Annuler
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="border border-red-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 transition-colors hover:border-red-600"
                >
                  Supprimer
                </button>
              )
            ) : (
              <span
                className="px-3 py-1.5 text-xs text-muted"
                title="Une categorie utilisee par des biens ne peut pas etre supprimee."
              >
                Utilisee
              </span>
            )}
          </div>
        )}
      </div>

      {state.error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {state.error}
        </p>
      )}
    </li>
  )
}
