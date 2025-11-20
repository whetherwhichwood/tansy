'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, Clock } from 'lucide-react'
import InfoIcon from './InfoIcon'
import TansyLogo from './TansyLogo'
import { useFeatureFlags } from '@/lib/featureFlags'
import { mockChatSummary } from '@/lib/mockData'

export default function ChatSearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { isBeforeMode } = useFeatureFlags()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to chat with the query
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl border border-tansy-gray shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TansyLogo size="sm" showText={false} />
            <h2 className="text-xl font-semibold text-tansy-gray-darker">Chat with Tansy</h2>
          </div>
          {!isBeforeMode && (
            <InfoIcon 
              content="Start a conversation with Tansy. Ask questions about appointments, insurance, providers, or any healthcare needs. Type naturally and press Enter or click Send."
              size="sm"
            />
          )}
        </div>

        {/* Latest Exchange Summary */}
        {!isBeforeMode && (
          <Link href="/chat" className="block mb-4">
            <div className="p-3 bg-tansy-gray-light rounded-lg border border-tansy-gray hover:border-tansy-teal hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-tansy-gray-dark mb-1 uppercase tracking-wide">
                    Last conversation
                  </div>
                  <div className="text-sm font-medium text-tansy-gray-darker mb-1">
                    {mockChatSummary.topic}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-tansy-gray-dark">
                    <Clock className="w-3 h-3" />
                    <span>{mockChatSummary.lastMessageTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Input Box */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSubmit} className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-tansy-pink to-tansy-pink-dark rounded-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 border border-white rounded-sm"></div>
                </div>
              </div>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How can I help you today?"
              className="w-full pl-12 pr-14 py-4 rounded-xl border-2 border-tansy-gray bg-white text-tansy-gray-darker placeholder-tansy-gray-dark focus:outline-none focus:border-tansy-teal transition-colors"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-tansy-teal text-white rounded-lg hover:bg-tansy-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

