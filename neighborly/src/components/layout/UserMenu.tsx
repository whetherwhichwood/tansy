'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, HelpCircle, Shield } from 'lucide-react'
import { Resident } from '@/lib/types'
import { HelpModal } from '../help/HelpModal'

interface UserMenuProps {
  resident: Resident
}

export function UserMenu({ resident }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileClick = () => {
    router.push(`/profile/${resident.id}`)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          {resident.avatar ? (
            <span className="text-sm font-medium text-emerald-700">
              {resident.avatar}
            </span>
          ) : (
            <User className="w-4 h-4 text-emerald-600" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {resident.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-3" />
                View Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Add settings functionality later
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              <button
                onClick={() => {
                  setShowHelp(true)
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Help
              </button>
              <button
                onClick={() => {
                  router.push('/admin')
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-4 h-4 mr-3" />
                Admin Dashboard
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
