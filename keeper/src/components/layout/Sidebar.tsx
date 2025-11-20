'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  Repeat, 
  FileText, 
  LogOut 
} from 'lucide-react'
import { clearUserSessionClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Items', href: '/dashboard/items', icon: Package },
  { name: 'Tasks', href: '/dashboard/tasks', icon: Repeat },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearUserSessionClient()
    router.push('/')
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-neutral-900">Keeper</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${
                      isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="group flex w-full gap-x-3 rounded-md p-3 text-sm font-medium leading-6 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LogOut className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-neutral-500" />
            Sign out
          </button>
        </div>
      </nav>
    </div>
  )
}
