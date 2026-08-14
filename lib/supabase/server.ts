import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env'

/**
 * Client Supabase côté serveur, adossé aux cookies de session.
 * À utiliser dans les composants serveur et les server actions.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL(), SUPABASE_ANON_KEY(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Appelé depuis un composant serveur : le rafraîchissement de session
          // est déjà géré par proxy.ts, on peut ignorer sans risque.
        }
      },
    },
  })
}
