import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Normalisation d'un libelle de categorie vers une valeur existante en base.
 * Les categories sont gerees depuis /admin/categories : un script ne doit
 * jamais en inventer, seulement rattacher a l'existant.
 */
export async function createTypeResolver(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('property_types').select('label')

  if (error) {
    console.error(`❌ Lecture des categories impossible : ${error.message}`)
    process.exit(1)
  }

  const labels = (data ?? []).map((row) => row.label as string)
  if (labels.length === 0) {
    console.error(
      '❌ Aucune categorie en base. Executez supabase/migrations/0002_property_types.sql.',
    )
    process.exit(1)
  }

  const fallback = labels.includes('Autre') ? 'Autre' : labels[0]

  return (value: string | undefined): string => {
    const match = labels.find(
      (l) => l.toLowerCase() === (value ?? '').trim().toLowerCase(),
    )
    if (!match) {
      console.warn(`⚠️  Categorie inconnue « ${value} » → reclassee en « ${fallback} »`)
      return fallback
    }
    return match
  }
}
