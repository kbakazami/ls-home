'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const BUCKET = 'property-images'
const MAX_SIZE = 5 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

interface ImageUploaderProps {
  /** Dossier de destination : l'identifiant du bien. */
  folder: string
  images: string[]
  onChange: (images: string[]) => void
  error?: string
}

export default function ImageUploader({
  folder,
  images,
  onChange,
  error,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(files: FileList | File[]) {
    if (!folder) {
      setUploadError("Renseignez d'abord le titre du bien.")
      return
    }

    setUploading(true)
    setUploadError(null)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setUploadError(`Format non supporte : ${file.name}`)
        continue
      }
      if (file.size > MAX_SIZE) {
        setUploadError(`${file.name} depasse 5 Mo.`)
        continue
      }

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${folder}/${crypto.randomUUID()}.${ext}`

      const { error: err } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (err) {
        setUploadError(`Envoi impossible : ${err.message}`)
        continue
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }

    if (uploaded.length > 0) onChange([...images, ...uploaded])
    setUploading(false)
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function addUrl() {
    const value = urlDraft.trim()
    if (!value) return
    try {
      new URL(value)
    } catch {
      setUploadError('URL invalide.')
      return
    }
    onChange([...images, value])
    setUrlDraft('')
    setUploadError(null)
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        Photos
      </p>

      {/* Zone de depot */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length > 0) upload(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'mt-2 cursor-pointer border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-primary bg-primary-light' : 'border-border bg-surface',
        )}
      >
        <p className="text-sm text-dark">
          {uploading
            ? 'Envoi en cours...'
            : 'Glissez vos photos ici, ou cliquez pour parcourir'}
        </p>
        <p className="mt-1 text-xs text-muted">
          JPEG, PNG, WebP ou AVIF — 5 Mo maximum par fichier
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) upload(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* Ajout par URL, pour conserver les photos deja hebergees ailleurs */}
      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addUrl()
            }
          }}
          placeholder="…ou collez une URL de photo existante"
          className="flex-1 border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={addUrl}
          className="border border-border px-4 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
        >
          Ajouter
        </button>
      </div>

      {(uploadError || error) && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {uploadError ?? error}
        </p>
      )}

      {/* Apercus */}
      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((src, i) => (
            <li key={src} className="border border-border bg-surface">
              <div className="relative aspect-video">
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Principale
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="px-1.5 text-muted transition-colors hover:text-primary disabled:opacity-30"
                    aria-label="Deplacer vers la gauche"
                  >
                    &larr;
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    className="px-1.5 text-muted transition-colors hover:text-primary disabled:opacity-30"
                    aria-label="Deplacer vers la droite"
                  >
                    &rarr;
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="px-1.5 text-muted transition-colors hover:text-red-600"
                >
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input type="hidden" name="images" value={JSON.stringify(images)} />
    </div>
  )
}
