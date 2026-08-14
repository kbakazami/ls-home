'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth'

export interface AgentActionState {
  error?: string
  success?: string
}

const newAgentSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  full_name: z.string().trim().min(1, 'Nom requis'),
  password: z
    .string()
    .min(10, 'Le mot de passe doit faire au moins 10 caracteres'),
  role: z.enum(['agent', 'admin']),
})

export async function createAgent(
  _prevState: AgentActionState,
  formData: FormData,
): Promise<AgentActionState> {
  const current = await requireAgent()
  if (!current.isAdmin) {
    return { error: 'Reserve aux administrateurs.' }
  }

  const parsed = newAgentSchema.safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    password: formData.get('password'),
    role: formData.get('role'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, full_name, password, role } = parsed.data

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  })

  if (error) {
    return { error: `Creation impossible : ${error.message}` }
  }

  revalidatePath('/admin/agents')
  return {
    success: `Compte cree pour ${full_name}. Transmettez-lui ses identifiants.`,
  }
}

export async function updateAgentRole(formData: FormData) {
  const current = await requireAgent()
  if (!current.isAdmin) return

  const id = formData.get('id')
  const role = formData.get('role')

  if (typeof id !== 'string' || (role !== 'agent' && role !== 'admin')) return
  // Un administrateur ne peut pas se retirer ses propres droits :
  // cela permettrait de se verrouiller hors de la gestion des comptes.
  if (id === current.id) return

  const supabase = await createClient()
  await supabase.from('profiles').update({ role }).eq('id', id)

  revalidatePath('/admin/agents')
}

export async function deleteAgent(formData: FormData) {
  const current = await requireAgent()
  if (!current.isAdmin) return

  const id = formData.get('id')
  if (typeof id !== 'string' || id === current.id) return

  const admin = createAdminClient()
  await admin.auth.admin.deleteUser(id)

  revalidatePath('/admin/agents')
}
