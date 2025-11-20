'use client'

import { useState } from 'react'
import { X, HelpCircle, Users, MessageCircle, Star, FileText } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null

  const helpSections = [
    {
      icon: Users,
      title: 'Getting Started',
      content: 'Welcome to Neighborly! This is your private HOA community network. Use the invite code DEMO2025 to join the Sunset Ridge HOA demo community.'
    },
    {
      icon: FileText,
      title: 'Posting Errands',
      content: 'Tap the + button to post a new errand. Choose from Help Needed, Borrow/Lend, Group Buy, or Local Tips. Be specific about what you need!'
    },
    {
      icon: MessageCircle,
      title: 'Claiming & Chatting',
      content: 'See a post you can help with? Tap "Claim This" to start helping. Use the chat feature to coordinate details with your neighbor.'
    },
    {
      icon: Star,
      title: 'Building Reputation',
      content: 'After completing a task, leave feedback with emoji badges (👍 Helpful, 💬 Friendly, ⏱️ Quick). This builds trust in your community!'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">How to Use Neighborly</h2>
              <p className="text-sm text-gray-500">Get the most out of your neighborhood network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {helpSections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            )
          })}

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-800 mb-2">Demo Features</h3>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Browse 8 sample posts across different categories</li>
              <li>• Claim tasks and start chatting with neighbors</li>
              <li>• Complete tasks and leave feedback</li>
              <li>• View your reputation score and badges</li>
              <li>• Check the community board for announcements</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Got it, let's get started!
          </button>
        </div>
      </div>
    </div>
  )
}








