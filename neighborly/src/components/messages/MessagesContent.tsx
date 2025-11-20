'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '../layout/BottomNav'
import { MessageCircle, User, Clock } from 'lucide-react'
import { Post, Resident } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface MessagesContentProps {
  resident: Resident
}

interface ChatSummary {
  post: Post
  lastMessage: {
    content: string
    createdAt: Date
    senderName: string
  }
  unreadCount: number
}

export function MessagesContent({ resident }: MessagesContentProps) {
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      
      if (response.ok) {
        setChats(data.chats)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatClick = (postId: string) => {
    router.push(`/feed/${postId}`)
  }

  return (
    <div className="mobile-content">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500">Active conversations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active conversations</h3>
            <p className="text-gray-500 mb-4">
              Start a conversation by claiming a task or posting an errand.
            </p>
            <button
              onClick={() => router.push('/feed')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Feed
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.post.id}
                onClick={() => handleChatClick(chat.post.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {chat.post.author.avatar ? (
                      <span className="text-sm font-medium text-emerald-700">
                        {chat.post.author.avatar}
                      </span>
                    ) : (
                      <User className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {chat.post.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      with {chat.post.author.name}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.senderName}: {chat.lastMessage.content}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="messages" />
    </div>
  )
}








