/**
 * Import de secours : Google Sheet → Supabase.
 *
 *   npm run sync
 *
 * ATTENTION : la source de verite est desormais la base Supabase, alimentee par
 * l'administration (/admin). Ce script reste disponible pour un import en masse
 * ponctuel — il ecrase les biens dont l'identifiant existe deja et ne supprime
 * jamais rien. A n'utiliser qu'en connaissance de cause.
 */
import { parse } from 'csv-parse/sync'
import { createScriptClient } from './supabase'
import { loadEnv, requireEnv } from './env'
import { createTypeResolver } from './property-types'

loadEnv()
const sheetId = requireEnv('GOOGLE_SHEET_ID')
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`

function toBool(value: string | undefined): boolean {
  return (value ?? '').trim().toLowerCase() === 'oui'
}

async function main() {
  const supabase = createScriptClient()
  const normalizeType = await createTypeResolver(supabase)

  console.log('📥 Fetch du Google Sheet...')

  const response = await fetch(url)
  if (!response.ok) {
    console.error(`❌ Erreur HTTP ${response.status} lors du fetch du sheet`)
    process.exit(1)
  }

  const records: Record<string, string>[] = parse(await response.text(), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const rows = records
    .filter((row) => row.id?.trim())
    .map((row, index) => ({
      id: row.id.trim(),
      title: row.title ?? '',
      type: normalizeType(row.type),
      price_rent: Number(row.price_rent) || 0,
      price_buy: Number(row.price_buy) || 0,
      habitants: Number(row.habitants) || 0,
      capacity: Number(row.capacity) || 0,
      featured: toBool(row.featured),
      published: row.published !== undefined ? toBool(row.published) : true,
      description: row.description ?? '',
      images: row.images
        ? row.images.split('|').map((u) => u.trim()).filter(Boolean)
        : [],
      sort_order: index,
    }))

  if (rows.length === 0) {
    console.error('❌ Aucune ligne exploitable dans le sheet.')
    process.exit(1)
  }

  const { error } = await supabase
    .from('properties')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error(`❌ Import echoue : ${error.message}`)
    process.exit(1)
  }

  console.log(`✅ ${rows.length} bien(s) synchronises dans Supabase.`)
}

main()
