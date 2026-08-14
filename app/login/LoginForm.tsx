'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signIn, type LoginState } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? 'Connexion...' : 'Se connecter'}
    </button>
  )
}

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {})

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      <div>
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full border border-border bg-surface px-4 py-3 text-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border border-border bg-surface px-4 py-3 text-dark outline-none focus:border-primary"
        />
      </div>

      {state.error && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
