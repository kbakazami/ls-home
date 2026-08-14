'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { deleteProperty } from '@/app/admin/actions'

function ConfirmButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-red-600 bg-red-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:opacity-60"
    >
      {pending ? 'Suppression...' : 'Confirmer la suppression'}
    </button>
  )
}

export default function DeletePropertyButton({
  id,
  title,
}: {
  id: string
  title: string
}) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="border border-red-300 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-red-700 transition-colors hover:border-red-600"
      >
        Supprimer ce bien
      </button>
    )
  }

  return (
    <div className="border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        Supprimer definitivement <strong>{title}</strong> ainsi que ses photos ?
      </p>
      <div className="mt-4 flex items-center gap-4">
        <form action={deleteProperty}>
          <input type="hidden" name="id" value={id} />
          <ConfirmButton />
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm text-muted transition-colors hover:text-dark"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
