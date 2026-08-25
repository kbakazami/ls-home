import { z } from 'zod'

/**
 * Une categorie de bien. Gerees depuis /admin/categories, stockees dans la
 * table `property_types` — d'ou l'absence d'union figee ici.
 */
export interface PropertyTypeOption {
  id: string
  label: string
  sort_order: number
  /**
   * Unite d'occupation au singulier — « habitant » pour un logement,
   * « vehicule » pour un garage. Le pluriel est ajoute a l'affichage.
   */
  occupancy_label: string
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
  // null = bien non disponible via ce canal (location seule, ou vente seule).
  price_rent: z.number().int().positive().nullable(),
  price_buy: z.number().int().positive().nullable(),
  habitants: z.number().int().min(0),
  // Capacite de stockage exprimee en plage. Bornes egales = valeur fixe.
  capacity_min: z.number().int().min(0),
  capacity_max: z.number().int().min(0),
  /** Coloris disponibles, texte libre. Ex. « Beige, Vert, Bleu ». */
  coloris: z.string(),
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
