'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createAgent, type AgentActionState } from '@/app/admin/agents/actions'

const inputClass =
  'w-full border border-border bg-surface px-4 py-3 text-dark outline-none focus:border-primary'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? 'Creation...' : "Creer l'acces"}
    </button>
  )
}

export default function NewAgentForm() {
  const [state, formAction] = useActionState<AgentActionState, FormData>(
    createAgent,
    {},
  )

  return (
    <form action={formAction} className="border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-dark">
        Ajouter un agent
      </h2>
      <p className="mt-1 text-sm text-muted">
        Le compte est actif immediatement. Communiquez le mot de passe a l&apos;agent
        par un canal sur — il pourra le changer ensuite depuis Supabase.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Nom affiche
          </label>
          <input id="full_name" name="full_name" required className={`mt-2 ${inputClass}`} />
        </div>

        <div>
          <label htmlFor="agent_email" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Adresse e-mail
          </label>
          <input
            id="agent_email"
            name="email"
            type="email"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label htmlFor="agent_password" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Mot de passe provisoire
          </label>
          <input
            id="agent_password"
            name="password"
            type="text"
            minLength={10}
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label htmlFor="agent_role" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Role
          </label>
          <select id="agent_role" name="role" defaultValue="agent" className={`mt-2 ${inputClass}`}>
            <option value="agent">Agent — gere les biens</option>
            <option value="admin">Administrateur — gere aussi les comptes</option>
          </select>
        </div>
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

      <div className="mt-6">
        <SubmitButton />
      </div>
    </form>
  )
}
