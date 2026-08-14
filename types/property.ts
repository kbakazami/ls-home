import { z } from 'zod'

/**
 * Une categorie de bien. Gerees depuis /admin/categories, stockees dans la
 * table `property_types` — d'ou l'absence d'union figee ici.
 */
export interface PropertyTypeOption {
  id: string
  label: string
  sort_order: number
}

/**
 * Schema d'un bien tel qu'il est stocke et consomme par le site.
 * La validite de `type` est garantie par la cle etrangere vers
 * `property_types`, pas par une enumeration cote code.
 */
export const propertySchema = z.object({
  id: z
    .string()
    .min(1, 'Identifiant requis')
    .regex(/^[a-z0-9-]+$/, 'Uniquement des minuscules, chiffres et tirets'),
  title: z.string().min(1, 'Titre requis'),
  type: z.string().min(1, 'Categorie requise'),
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

export interface Profile {
  id: string
  full_name: string | null
  role: 'agent' | 'admin'
  created_at: string
}
