'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  Repeat, 
  FileText 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Items', href: '/dashboard/items', icon: Package },
  { name: 'Tasks', href: '/dashboard/tasks', icon: Repeat },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <nav className="flex justify-around py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-accent'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <item.icon
                className={`h-6 w-6 mb-1 ${
                  isActive ? 'text-accent' : 'text-neutral-400'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}


