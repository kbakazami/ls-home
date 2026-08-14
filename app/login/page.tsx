import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Connexion — LS HOME',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams

  return (
    <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md border border-border bg-surface p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Espace agents
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-dark">
          Connexion
        </h1>
        <p className="mt-3 text-sm text-muted">
          Reserve aux agents LS HOME. Contactez un administrateur pour obtenir
          un acces.
        </p>

        <LoginForm redirectTo={redirect} />

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-muted transition-colors hover:text-primary"
        >
          Retour au site
        </Link>
      </div>
    </section>
  )
}
