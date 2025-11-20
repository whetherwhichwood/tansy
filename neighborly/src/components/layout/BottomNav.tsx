'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, FileText, MessageCircle, Users } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Feed',
      href: '/feed',
      icon: Home,
      active: activeTab === 'feed' || pathname === '/feed',
    },
    {
      name: 'My Posts',
      href: '/my-posts',
      icon: FileText,
      active: activeTab === 'my-posts' || pathname.startsWith('/my-posts'),
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      active: activeTab === 'messages' || pathname.startsWith('/messages'),
    },
    {
      name: 'Community',
      href: '/community',
      icon: Users,
      active: activeTab === 'community' || pathname.startsWith('/community'),
    },
  ]

  return (
    <nav className="mobile-nav bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}








