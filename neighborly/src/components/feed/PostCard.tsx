'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Clock, CheckCircle, XCircle, User } from 'lucide-react'
import { Post, PostCategory, PostStatus, Resident } from '@/lib/types'

interface PostCardProps {
  post: Post
  currentResident: Resident
  onPostUpdated: (post: Post) => void
}

const categoryLabels = {
  HELP_NEEDED: 'Help Needed',
  BORROW_LEND: 'Borrow/Lend',
  GROUP_BUY: 'Group Buy',
  LOCAL_TIP: 'Local Tip',
}

const categoryColors = {
  HELP_NEEDED: 'bg-red-100 text-red-700',
  BORROW_LEND: 'bg-blue-100 text-blue-700',
  GROUP_BUY: 'bg-green-100 text-green-700',
  LOCAL_TIP: 'bg-purple-100 text-purple-700',
}

const statusLabels = {
  OPEN: 'Open',
  CLAIMED: 'Claimed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const statusColors = {
  OPEN: 'bg-green-100 text-green-700',
  CLAIMED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export function PostCard({ post, currentResident, onPostUpdated }: PostCardProps) {
  const [isClaiming, setIsClaiming] = useState(false)
  const router = useRouter()

  const handleClaim = async () => {
    if (isClaiming) return
    
    setIsClaiming(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/claim`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        onPostUpdated(data.post)
      }
    } catch (error) {
      console.error('Error claiming post:', error)
    } finally {
      setIsClaiming(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/feed/${post.id}`)
  }

  const canClaim = post.status === 'OPEN' && post.authorId !== currentResident.id
  const isAuthor = post.authorId === currentResident.id
  const isClaimer = post.claimedById === currentResident.id

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Link 
            href={`/profile/${post.author.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors"
          >
            {post.author.avatar ? (
              <span className="text-sm font-medium text-emerald-700">
                {post.author.avatar}
              </span>
            ) : (
              <User className="w-5 h-5 text-emerald-600" />
            )}
          </Link>
          <div>
            <Link 
              href={`/profile/${post.author.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-gray-900 hover:text-emerald-600 transition-colors"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
            {categoryLabels[post.category]}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
            {statusLabels[post.status]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {post.description.length > 150 
            ? `${post.description.substring(0, 150)}...` 
            : post.description
          }
        </p>
      </div>

      {/* Claimer Info */}
      {post.status === 'CLAIMED' && post.claimer && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Claimed by {post.claimer.name}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {(isAuthor || isClaimer) && post.status !== 'COMPLETED' && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>Chat available</span>
            </div>
          )}
          {post.status === 'COMPLETED' && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
          {post.status === 'CANCELLED' && (
            <div className="flex items-center space-x-1 text-red-600">
              <XCircle className="w-4 h-4" />
              <span>Cancelled</span>
            </div>
          )}
        </div>

        {canClaim && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClaim()
            }}
            disabled={isClaiming}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClaiming ? 'Claiming...' : 'Claim This'}
          </button>
        )}
      </div>
    </div>
  )
}
