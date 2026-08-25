const numberFormatter = new Intl.NumberFormat('fr-FR')

/** 12500 → "12 500 $" */
export function formatPrice(value: number): string {
  return `${numberFormatter.format(value)} $`
}

/** Prix optionnel : `null` signifie que le bien n'est pas disponible ainsi. */
export function formatOptionalPrice(value: number | null): string {
  return value === null ? 'Non disponible' : formatPrice(value)
}

/** Capacite de stockage : « 300 - 500 kg », ou « 300 kg » si les bornes sont egales. */
export function formatCapacity(min: number, max: number): string {
  return min === max
    ? `${numberFormatter.format(max)} kg`
    : `${numberFormatter.format(min)} - ${numberFormatter.format(max)} kg`
}

/** Unite d'occupation retenue quand la categorie n'en precise aucune. */
export const DEFAULT_OCCUPANCY_LABEL = 'habitant'

/**
 * Occupation d'un bien, accordee : « 4 habitants », « 1 vehicule ».
 * `unit` est l'unite au singulier portee par la categorie.
 */
export function formatOccupancy(count: number, unit: string): string {
  const label = unit.trim() || DEFAULT_OCCUPANCY_LABEL
  return `${numberFormatter.format(count)} ${count > 1 ? `${label}s` : label}`
}

/** Intitule de rubrique associe a une unite : « Habitants », « Vehicules ». */
export function occupancyHeading(unit: string): string {
  const label = unit.trim() || DEFAULT_OCCUPANCY_LABEL
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}s`
}

/** Transforme un titre en slug utilisable comme identifiant de bien. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // retire les accents décomposés
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
