'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth'
import { slugify } from '@/lib/format'

export interface CategoryState {
  error?: string
  success?: string
}

function revalidateAll() {
  revalidatePath('/', 'layout')
}

const labelSchema = z
  .string()
  .trim()
  .min(2, 'Le libelle doit faire au moins 2 caracteres')
  .max(40, 'Le libelle est trop long')

export async function createCategory(
  _prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireAgent()

  const parsed = labelSchema.safeParse(formData.get('label'))
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const label = parsed.data
  const id = slugify(label)
  if (!id) {
    return { error: 'Ce libelle ne permet pas de generer un identifiant.' }
  }

  const supabase = await createClient()
  const { data: last } = await supabase
    .from('property_types')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase
    .from('property_types')
    .insert({ id, label, sort_order: (last?.sort_order ?? 0) + 10 })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Cette categorie existe deja.' }
    }
    return { error: `Creation impossible : ${error.message}` }
  }

  revalidateAll()
  return { success: `Categorie « ${label} » creee.` }
}

export async function renameCategory(
  _prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireAgent()

  const id = formData.get('id')
  const parsed = labelSchema.safeParse(formData.get('label'))

  if (typeof id !== 'string' || !id) return { error: 'Categorie introuvable.' }
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  // La cle etrangere est en ON UPDATE CASCADE : les biens rattaches
  // suivent automatiquement le nouveau libelle.
  const { error } = await supabase
    .from('property_types')
    .update({ label: parsed.data })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: 'Une autre categorie porte deja ce libelle.' }
    }
    return { error: `Renommage impossible : ${error.message}` }
  }

  revalidateAll()
  return { success: `Categorie renommee en « ${parsed.data} ».` }
}

export async function moveCategory(formData: FormData) {
  await requireAgent()

  const id = formData.get('id')
  const direction = formData.get('direction')
  if (typeof id !== 'string' || (direction !== 'up' && direction !== 'down')) {
    return
  }

  const supabase = await createClient()
  const { data: all } = await supabase
    .from('property_types')
    .select('id, sort_order')
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true })

  if (!all) return

  const index = all.findIndex((c) => c.id === id)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || target < 0 || target >= all.length) return

  // Les valeurs de sort_order peuvent etre a egalite : on les reecrit toutes
  // apres permutation pour garantir un ordre stable.
  const reordered = [...all]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]

  for (const [position, category] of reordered.entries()) {
    await supabase
      .from('property_types')
      .update({ sort_order: (position + 1) * 10 })
      .eq('id', category.id)
  }

  revalidateAll()
  revalidatePath('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  await requireAgent()

  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return

  const supabase = await createClient()
  // ON DELETE RESTRICT : la base refuse si des biens utilisent encore
  // cette categorie. L'interface masque deja le bouton dans ce cas.
  await supabase.from('property_types').delete().eq('id', id)

  revalidateAll()
  revalidatePath('/admin/categories')
}
