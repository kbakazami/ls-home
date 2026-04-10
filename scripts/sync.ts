import { readFileSync } from 'node:fs'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { parse } from 'csv-parse/sync'
import type { Property } from '../types/property'

const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const sheetId = envContent
  .split('\n')
  .find((line) => line.startsWith('GOOGLE_SHEET_ID='))
  ?.split('=')[1]
  ?.trim()

if (!sheetId) {
  console.error('❌ GOOGLE_SHEET_ID manquant dans .env.local')
  process.exit(1)
}

const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`

function toBool(value: string): boolean {
  return value.toLowerCase() === 'oui'
}

async function main() {
  console.log('📥 Fetch du Google Sheet...')

  const response = await fetch(url)

  if (!response.ok) {
    console.error(`❌ Erreur HTTP ${response.status} lors du fetch du sheet`)
    process.exit(1)
  }

  const csv = await response.text()

  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const properties: Property[] = records.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type as Property['type'],
    price_rent: Number(row.price_rent),
    price_buy: Number(row.price_buy),
    habitants: Number(row.habitants),
    capacity: Number(row.capacity),
    featured: toBool(row.featured),
    description: row.description,
    images: row.images
      ? row.images.split('|').map((u: string) => u.trim()).filter(Boolean)
      : [],
  }))

  const outPath = resolve(__dirname, '..', 'data', 'properties.json')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(properties, null, 2), 'utf-8')

  console.log(`✅ ${properties.length} bien(s) écrits dans data/properties.json`)
}

main()
