'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth'

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
  // La validite est garantie par la cle etrangere vers `property_types`.
  type: z.string().trim().min(1, 'Categorie requise'),
  // null = bien non disponible via ce canal.
  price_rent: z.coerce.number().int().positive('Indiquez un montant').nullable(),
  price_buy: z.coerce.number().int().positive('Indiquez un montant').nullable(),
  habitants: z.coerce.number().int().min(0, 'Doit etre positif'),
  capacity_min: z.coerce.number().int().min(0, 'Doit etre positif'),
  capacity_max: z.coerce.number().int().min(0, 'Doit etre positif'),
  coloris: z.string().trim().max(120, 'Trop long'),
  sort_order: z.coerce.number().int(),
  description: z.string().trim(),
  featured: z.coerce.boolean(),
  published: z.coerce.boolean(),
  images: z.array(z.url()),
})
  .refine((v) => v.price_rent !== null || v.price_buy !== null, {
    message: 'Le bien doit etre disponible au moins a la location ou a l\'achat',
    path: ['price_rent'],
  })
  .refine((v) => v.capacity_min <= v.capacity_max, {
    message: 'Le minimum ne peut pas depasser le maximum',
    path: ['capacity_min'],
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

  // Une case decochee signifie « non disponible » : le prix vaut alors null,
  // quelle que soit la valeur restee dans le champ desactive.
  const rentAvailable = formData.get('rent_available') === 'on'
  const buyAvailable = formData.get('buy_available') === 'on'

  return formSchema.safeParse({
    id: formData.get('id') ?? '',
    title: formData.get('title') ?? '',
    type: formData.get('type'),
    price_rent: rentAvailable ? formData.get('price_rent') || 0 : null,
    price_buy: buyAvailable ? formData.get('price_buy') || 0 : null,
    habitants: formData.get('habitants') || 0,
    capacity_min: formData.get('capacity_min') || 0,
    capacity_max: formData.get('capacity_max') || 0,
    coloris: formData.get('coloris') ?? '',
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
    if (error.code === '23503') {
      return { fieldErrors: { type: "Cette categorie n'existe plus." } }
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
    if (error.code === '23503') {
      return { fieldErrors: { type: "Cette categorie n'existe plus." } }
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
