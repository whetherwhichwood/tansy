'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, MapPin, Calendar, CheckCircle } from 'lucide-react'
import { ReputationBadge } from './ReputationBadge'
import { Resident, Post } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface ProfileContentProps {
  residentId: string
  currentResident: Resident
}

export function ProfileContent({ residentId, currentResident }: ProfileContentProps) {
  const [resident, setResident] = useState<Resident | null>(null)
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [residentId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/residents/${residentId}`)
      const data = await response.json()
      
      if (response.ok) {
        setResident(data.resident)
        setRecentPosts(data.recentPosts || [])
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!resident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const isOwnProfile = resident.id === currentResident.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {isOwnProfile ? 'Your Profile' : `${resident.name}'s Profile`}
              </h1>
              <p className="text-sm text-gray-500">Neighbor Profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              {resident.avatar ? (
                <span className="text-2xl font-medium text-emerald-700">
                  {resident.avatar}
                </span>
              ) : (
                <User className="w-8 h-8 text-emerald-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{resident.name}</h2>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {resident.address.split(',')[0]} {/* Show only street address for privacy */}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Member since {new Date(resident.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Reputation */}
          <ReputationBadge
            badges={resident.badges as Record<string, number>}
            reputationScore={resident.reputationScore}
            size="lg"
          />
        </div>

        {/* Recent Activity */}
        {recentPosts.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-l-4 border-emerald-200 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">{post.title}</h4>
                  <p className="text-sm text-gray-600">
                    {post.status === 'COMPLETED' ? 'Completed' : 'In progress'} •{' '}
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentPosts.length === 0 && (
          <div className="bg-white rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-500">
              {isOwnProfile 
                ? "You haven't completed any tasks yet. Start helping your neighbors!"
                : "This neighbor hasn't completed any tasks yet."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}








