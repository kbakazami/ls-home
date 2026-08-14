/**
 * Import unique de data/properties.json vers Supabase.
 *
 *   npm run migrate
 *
 * Idempotent : relancer le script met a jour les biens deja presents
 * (upsert sur l'identifiant) plutot que d'echouer.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createScriptClient } from './supabase'
import { createTypeResolver } from './property-types'

interface LegacyProperty {
  id: string
  title: string
  type: string
  price_rent: number
  price_buy: number
  habitants: number
  capacity: number
  featured: boolean
  description: string
  images: string[]
}

async function main() {
  const jsonPath = resolve(process.cwd(), 'data', 'properties.json')
  const legacy: LegacyProperty[] = JSON.parse(readFileSync(jsonPath, 'utf-8'))

  console.log(`📦 ${legacy.length} bien(s) lus depuis data/properties.json`)

  const supabase = createScriptClient()
  const normalizeType = await createTypeResolver(supabase)

  const rows = legacy.map((p, index) => ({
    id: p.id,
    title: p.title,
    type: normalizeType(p.type),
    price_rent: Number(p.price_rent) || 0,
    price_buy: Number(p.price_buy) || 0,
    habitants: Number(p.habitants) || 0,
    capacity: Number(p.capacity) || 0,
    featured: Boolean(p.featured),
    published: true,
    description: p.description ?? '',
    images: Array.isArray(p.images) ? p.images : [],
    sort_order: index,
  }))

  const { error } = await supabase
    .from('properties')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error(`❌ Import echoue : ${error.message}`)
    process.exit(1)
  }

  console.log(`✅ ${rows.length} bien(s) importes et publies dans Supabase.`)
}

main()
