import { createClient } from '@/lib/supabase/server'
import type { Property } from '@/types/property'

/**
 * Colonnes consommées par le site public et l'administration.
 * Explicite plutôt que `*` pour éviter les surprises à l'ajout d'une colonne.
 */
const COLUMNS =
  'id, title, type, price_rent, price_buy, habitants, capacity, featured, published, description, images, sort_order'

/** Biens visibles sur le catalogue public. */
export async function getPublishedProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Lecture des biens impossible : ${error.message}`)
  return (data ?? []) as Property[]
}

/** Biens mis en avant sur la page d'accueil. */
export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Lecture des biens impossible : ${error.message}`)
  return (data ?? []) as Property[]
}

/** Tous les biens, brouillons compris. Réservé à l'administration. */
export async function getAllProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Lecture des biens impossible : ${error.message}`)
  return (data ?? []) as Property[]
}

/** Un bien par son identifiant, ou `null` s'il n'existe pas. */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Lecture du bien impossible : ${error.message}`)
  return (data as Property | null) ?? null
}
