'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth'
import { PROPERTY_TYPES } from '@/types/property'

export interface ActionState {
  error?: string
  fieldErrors?: Record<string, string>
}

/** Rafraichit les pages qui dependent des biens. */
function revalidateAll() {
  revalidatePath('/', 'layout')
}

const formSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, 'Identifiant requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  title: z.string().trim().min(1, 'Titre requis'),
  type: z.enum(PROPERTY_TYPES),
  price_rent: z.coerce.number().int().min(0, 'Doit etre positif'),
  price_buy: z.coerce.number().int().min(0, 'Doit etre positif'),
  habitants: z.coerce.number().int().min(0, 'Doit etre positif'),
  capacity: z.coerce.number().int().min(0, 'Doit etre positif'),
  sort_order: z.coerce.number().int(),
  description: z.string().trim(),
  featured: z.coerce.boolean(),
  published: z.coerce.boolean(),
  images: z.array(z.url()),
})

function parseForm(formData: FormData) {
  const rawImages = formData.get('images')
  let images: unknown = []
  if (typeof rawImages === 'string' && rawImages.length > 0) {
    try {
      images = JSON.parse(rawImages)
    } catch {
      images = []
    }
  }

  return formSchema.safeParse({
    id: formData.get('id') ?? '',
    title: formData.get('title') ?? '',
    type: formData.get('type'),
    price_rent: formData.get('price_rent') || 0,
    price_buy: formData.get('price_buy') || 0,
    habitants: formData.get('habitants') || 0,
    capacity: formData.get('capacity') || 0,
    sort_order: formData.get('sort_order') || 0,
    description: formData.get('description') ?? '',
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    images,
  })
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'global')
    fieldErrors[key] ??= issue.message
  }
  return fieldErrors
}

export async function createProperty(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const agent = await requireAgent()

  const parsed = parseForm(formData)
  if (!parsed.success) {
    return { error: 'Verifiez les champs du formulaire.', fieldErrors: toFieldErrors(parsed.error) }
  }

  const values = parsed.data
  if (values.published && values.images.length === 0) {
    return {
      error: 'Un bien publie doit avoir au moins une photo.',
      fieldErrors: { images: 'Ajoutez au moins une photo avant de publier.' },
    }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('properties')
    .insert({ ...values, created_by: agent.id })

  if (error) {
    if (error.code === '23505') {
      return { fieldErrors: { id: 'Cet identifiant est deja utilise.' } }
    }
    return { error: `Enregistrement impossible : ${error.message}` }
  }

  revalidateAll()
  redirect('/admin/biens')
}

export async function updateProperty(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAgent()

  const originalId = formData.get('original_id')
  if (typeof originalId !== 'string' || !originalId) {
    return { error: 'Bien introuvable.' }
  }

  const parsed = parseForm(formData)
  if (!parsed.success) {
    return { error: 'Verifiez les champs du formulaire.', fieldErrors: toFieldErrors(parsed.error) }
  }

  const values = parsed.data
  if (values.published && values.images.length === 0) {
    return {
      error: 'Un bien publie doit avoir au moins une photo.',
      fieldErrors: { images: 'Ajoutez au moins une photo avant de publier.' },
    }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('properties')
    .update(values)
    .eq('id', originalId)

  if (error) {
    if (error.code === '23505') {
      return { fieldErrors: { id: 'Cet identifiant est deja utilise.' } }
    }
    return { error: `Enregistrement impossible : ${error.message}` }
  }

  revalidateAll()
  redirect('/admin/biens')
}

export async function deleteProperty(formData: FormData) {
  await requireAgent()

  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return

  const supabase = await createClient()

  // Nettoyage des photos hebergees sur Storage (les URLs externes sont ignorees).
  const { data: files } = await supabase.storage.from('property-images').list(id)
  if (files && files.length > 0) {
    await supabase.storage
      .from('property-images')
      .remove(files.map((f) => `${id}/${f.name}`))
  }

  await supabase.from('properties').delete().eq('id', id)

  revalidateAll()
  redirect('/admin/biens')
}

/** Bascule rapide depuis la liste (publie / en vedette). */
export async function toggleFlag(formData: FormData) {
  await requireAgent()

  const id = formData.get('id')
  const field = formData.get('field')
  const value = formData.get('value') === 'true'

  if (typeof id !== 'string' || (field !== 'published' && field !== 'featured')) {
    return
  }

  const supabase = await createClient()
  await supabase
    .from('properties')
    .update({ [field]: !value })
    .eq('id', id)

  revalidateAll()
  revalidatePath('/admin/biens')
}
