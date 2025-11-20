'use client'

import Link from 'next/link'
import { MessageCircle, User } from 'lucide-react'
import TansyLogo from '@/components/ui/TansyLogo'

export default function Header() {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-white border-b border-tansy-gray">
      <Link href="/dashboard" className="flex items-center gap-2">
        <TansyLogo size="md" showText={true} />
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/chat" className="p-2 hover:bg-tansy-gray-light rounded-full transition-colors">
          <MessageCircle className="w-5 h-5 text-tansy-pink" />
        </Link>
        <Link href="/profile" className="p-2 hover:bg-tansy-gray-light rounded-full transition-colors">
          <User className="w-5 h-5 text-tansy-pink" />
        </Link>
        <Link href="/pricing" className="text-sm text-tansy-gray-dark hover:text-tansy-teal-dark font-medium px-3 py-1 rounded-lg hover:bg-tansy-gray-light transition-colors">
          Pricing
        </Link>
      </div>
    </header>
  )
}

