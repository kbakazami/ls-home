import NewAgentForm from '@/components/admin/NewAgentForm'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { deleteAgent, updateAgentRole } from './actions'
import type { Profile } from '@/types/property'

export const dynamic = 'force-dynamic'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
})

export default async function AgentsPage() {
  const current = await requireAdmin()

  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: true })
    .returns<Profile[]>()

  // Les adresses e-mail vivent dans auth.users, hors de portee de la RLS.
  const admin = createAdminClient()
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 200 })
  const emailById = new Map(
    (authUsers?.users ?? []).map((u) => [u.id, u.email ?? '—']),
  )

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark">Agents</h1>
      <p className="mt-2 text-muted">
        Comptes autorises a gerer le catalogue.
      </p>

      <ul className="mt-8 space-y-3">
        {(profiles ?? []).map((profile) => {
          const isSelf = profile.id === current.id
          return (
            <li
              key={profile.id}
              className="flex flex-wrap items-center gap-4 border border-border bg-surface p-4"
            >
              <div className="min-w-[14rem] flex-1">
                <p className="font-display font-semibold text-dark">
                  {profile.full_name ?? '—'}
                  {isSelf && (
                    <span className="ml-2 text-xs font-normal text-muted">(vous)</span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {emailById.get(profile.id) ?? '—'}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Ajoute le {dateFormatter.format(new Date(profile.created_at))}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isSelf ? (
                  <span className="bg-primary-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-dark">
                    Administrateur
                  </span>
                ) : (
                  <>
                    <form action={updateAgentRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={profile.id} />
                      <input
                        type="hidden"
                        name="role"
                        value={profile.role === 'admin' ? 'agent' : 'admin'}
                      />
                      <button
                        type="submit"
                        className="border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        {profile.role === 'admin'
                          ? 'Retrograder en agent'
                          : 'Promouvoir administrateur'}
                      </button>
                    </form>

                    <form action={deleteAgent}>
                      <input type="hidden" name="id" value={profile.id} />
                      <button
                        type="submit"
                        className="border border-red-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 transition-colors hover:border-red-600"
                      >
                        Revoquer
                      </button>
                    </form>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-10">
        <NewAgentForm />
      </div>
    </div>
  )
}
