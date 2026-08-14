import { createClient } from '@supabase/supabase-js'
import { loadEnv, requireEnv } from './env'

/**
 * Client `service_role` pour les scripts en ligne de commande.
 * Contourne la RLS : ne jamais l'utiliser dans le code de l'application.
 */
export function createScriptClient() {
  loadEnv()
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
