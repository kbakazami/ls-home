import { z } from 'zod'

/**
 * Liste canonique des types de biens.
 * Doit rester alignée avec la contrainte `check` de la table `properties`
 * dans supabase/migrations/0001_init.sql.
 */
export const PROPERTY_TYPES = [
  'Villa',
  'Appartement',
  'Penthouse',
  'Maison',
  'Local commercial',
  'Entrepôt',
  'Hotel',
  'Garage',
  'Autre',
] as const

export type PropertyType = (typeof PROPERTY_TYPES)[number]

/** Schéma d'un bien tel qu'il est stocké et consommé par le site. */
export const propertySchema = z.object({
  id: z
    .string()
    .min(1, 'Identifiant requis')
    .regex(/^[a-z0-9-]+$/, 'Uniquement des minuscules, chiffres et tirets'),
  title: z.string().min(1, 'Titre requis'),
  type: z.enum(PROPERTY_TYPES),
  price_rent: z.number().int().min(0),
  price_buy: z.number().int().min(0),
  habitants: z.number().int().min(0),
  capacity: z.number().int().min(0),
  featured: z.boolean(),
  published: z.boolean(),
  description: z.string(),
  images: z.array(z.url('URL de photo invalide')),
  sort_order: z.number().int(),
})

export type Property = z.infer<typeof propertySchema>

/** Champs modifiables depuis le formulaire d'administration. */
export const propertyInputSchema = propertySchema
  .extend({
    images: z.array(z.url()).min(1, 'Au moins une photo est requise'),
  })
  .refine((p) => !p.published || p.images.length > 0, {
    message: 'Un bien publié doit avoir au moins une photo',
    path: ['images'],
  })

export type PropertyInput = z.input<typeof propertySchema>

/** Coerce un enregistrement brut (CSV, JSON, ligne Supabase) vers un `Property`. */
export const propertyRowSchema = propertySchema.extend({
  price_rent: z.coerce.number().int().min(0).catch(0),
  price_buy: z.coerce.number().int().min(0).catch(0),
  habitants: z.coerce.number().int().min(0).catch(0),
  capacity: z.coerce.number().int().min(0).catch(0),
  featured: z.coerce.boolean().catch(false),
  published: z.coerce.boolean().catch(false),
  description: z.string().catch(''),
  images: z.array(z.string()).catch([]),
  sort_order: z.coerce.number().int().catch(0),
})

export interface Profile {
  id: string
  full_name: string | null
  role: 'agent' | 'admin'
  created_at: string
}
