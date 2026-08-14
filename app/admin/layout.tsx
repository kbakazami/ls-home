import type { Metadata } from 'next'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import { requireAgent } from '@/lib/auth'
import { signOut } from '@/app/login/actions'

export const metadata: Metadata = {
  title: 'Administration — LS HOME',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const agent = await requireAgent()

  return (
    <div className="min-h-screen bg-light">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Administration
            </p>
            <p className="font-display text-xl font-bold text-dark">LS HOME</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">
              {agent.profile?.full_name ?? agent.email}
              {agent.isAdmin && (
                <span className="ml-2 bg-primary-light px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary-dark">
                  Admin
                </span>
              )}
            </span>
            <Link
              href="/"
              className="text-muted transition-colors hover:text-primary"
            >
              Voir le site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="border border-border px-3 py-1.5 text-muted transition-colors hover:border-primary hover:text-primary"
              >
                Deconnexion
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <AdminNav isAdmin={agent.isAdmin} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
