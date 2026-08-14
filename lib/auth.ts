import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/property'

export interface SessionAgent {
  id: string
  email: string
  profile: Profile | null
  isAdmin: boolean
}

/**
 * Agent connecte, ou redirection vers /login.
 * A appeler dans toute page ou server action de l'administration :
 * `proxy.ts` protege deja les routes, ceci est la seconde barriere.
 */
export async function requireAgent(): Promise<SessionAgent> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', user.id)
    .maybeSingle<Profile>()

  return {
    id: user.id,
    email: user.email ?? '',
    profile: profile ?? null,
    isAdmin: profile?.role === 'admin',
  }
}

/** Variante reservee aux administrateurs. */
export async function requireAdmin(): Promise<SessionAgent> {
  const agent = await requireAgent()
  if (!agent.isAdmin) redirect('/admin')
  return agent
}
