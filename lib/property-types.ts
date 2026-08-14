import { createClient } from '@/lib/supabase/server'
import type { PropertyTypeOption } from '@/types/property'

/** Categories de biens, dans l'ordre d'affichage choisi en administration. */
export async function getPropertyTypes(): Promise<PropertyTypeOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('property_types')
    .select('id, label, sort_order')
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true })

  if (error) {
    throw new Error(`Lecture des categories impossible : ${error.message}`)
  }
  return (data ?? []) as PropertyTypeOption[]
}

/** Nombre de biens rattaches a chaque categorie, indexe par libelle. */
export async function getPropertyTypeUsage(): Promise<Map<string, number>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('properties').select('type')

  if (error) {
    throw new Error(`Lecture des biens impossible : ${error.message}`)
  }

  const usage = new Map<string, number>()
  for (const row of data ?? []) {
    const label = (row as { type: string }).type
    usage.set(label, (usage.get(label) ?? 0) + 1)
  }
  return usage
}
