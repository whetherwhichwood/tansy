'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '../layout/BottomNav'
import { Users, Pin, Calendar, Megaphone } from 'lucide-react'
import { Announcement, Resident } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface CommunityContentProps {
  resident: Resident
}

export function CommunityContent({ resident }: CommunityContentProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      const data = await response.json()
      
      if (response.ok) {
        setAnnouncements(data.announcements)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const pinnedAnnouncements = announcements.filter(a => a.isPinned)
  const regularAnnouncements = announcements.filter(a => !a.isPinned)

  return (
    <div className="mobile-content">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Community</h1>
              <p className="text-sm text-gray-500">HOA announcements and updates</p>
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
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-500">
              Check back later for community updates and important information.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Pin className="w-4 h-4 mr-1" />
                  Pinned
                </h2>
                <div className="space-y-3">
                  {pinnedAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      isPinned={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Announcements */}
            {regularAnnouncements.length > 0 && (
              <div>
                {pinnedAnnouncements.length > 0 && (
                  <h2 className="text-sm font-medium text-gray-700 mb-3">Recent</h2>
                )}
                <div className="space-y-3">
                  {regularAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      isPinned={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="community" />
    </div>
  )
}

interface AnnouncementCardProps {
  announcement: Announcement
  isPinned: boolean
}

function AnnouncementCard({ announcement, isPinned }: AnnouncementCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${
      isPinned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isPinned && (
            <Pin className="w-4 h-4 text-yellow-600" />
          )}
          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
      
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {announcement.content}
      </div>
    </div>
  )
}








