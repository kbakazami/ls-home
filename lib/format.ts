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
