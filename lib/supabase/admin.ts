import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from './env'

/**
 * Client `service_role` : contourne la RLS.
 * Réservé à la gestion des comptes agents. Ne jamais l'exposer au navigateur.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL(), SUPABASE_SERVICE_ROLE_KEY(), {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
