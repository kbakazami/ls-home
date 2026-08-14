import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Charge .env.local dans process.env.
 * Les scripts tournent hors de Next.js, qui ne le fait donc pas pour nous.
 */
export function loadEnv(): void {
  let content: string
  try {
    content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  } catch {
    return
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`❌ ${name} manquant dans .env.local`)
    process.exit(1)
  }
  return value
}
