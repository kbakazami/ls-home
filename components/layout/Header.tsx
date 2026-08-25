'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from './Logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/properties', label: 'Nos biens' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-dark">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Los Santos Homes — accueil" className="shrink-0">
          <Logo priority className="h-14 md:h-16" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm uppercase tracking-widest transition-colors',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-white/80 hover:text-primary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={cn('block h-0.5 w-6 bg-white transition-transform', menuOpen && 'translate-y-2 rotate-45')} />
          <span className={cn('block h-0.5 w-6 bg-white transition-opacity', menuOpen && 'opacity-0')} />
          <span className={cn('block h-0.5 w-6 bg-white transition-transform', menuOpen && '-translate-y-2 -rotate-45')} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-dark px-6 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'block py-3 text-sm uppercase tracking-widest transition-colors',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-white/80 hover:text-primary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
