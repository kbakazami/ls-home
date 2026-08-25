import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Classes de dimensionnement — poser une hauteur, la largeur suit. */
  className?: string
  /** A activer uniquement pour le logo visible au chargement (header). */
  priority?: boolean
}

/**
 * Logo Los Santos Homes. Le lettrage « LOS SANTOS » est blanc :
 * ne l'utiliser que sur un fond sombre.
 */
export default function Logo({ className, priority = false }: LogoProps) {
  return (
    <Image
      src="/images/brand/ls-homes-logo.png"
      alt="Los Santos Homes"
      width={1024}
      height={1024}
      priority={priority}
      className={cn('w-auto object-contain', className)}
    />
  )
}
