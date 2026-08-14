'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/admin', label: 'Tableau de bord', exact: true },
  { href: '/admin/biens', label: 'Biens', exact: false },
  { href: '/admin/agents', label: 'Agents', exact: false, adminOnly: true },
]

export default function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto">
      {LINKS.filter((link) => !link.adminOnly || isAdmin).map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors',
              active
                ? 'border-primary font-semibold text-primary'
                : 'border-transparent text-muted hover:text-dark',
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
