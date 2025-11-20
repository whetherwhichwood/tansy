'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, MessageCircle, CheckCircle, XCircle, Clock, User } from 'lucide-react'
import { Post, Resident } from '@/lib/types'
import { ChatInterface } from '../chat/ChatInterface'
import { FeedbackModal } from '../feedback/FeedbackModal'

interface PostDetailProps {
  postId: string
  currentResident: Resident
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

export function PostDetail({ postId, currentResident }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      const data = await response.json()
      
      if (response.ok) {
        setPost(data.post)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    if (isClaiming) return
    
    setIsClaiming(true)
    try {
      const response = await fetch(`/api/posts/${postId}/claim`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
      }
    } catch (error) {
      console.error('Error claiming post:', error)
    } finally {
      setIsClaiming(false)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
        setShowFeedback(true)
      }
    } catch (error) {
      console.error('Error completing post:', error)
    }
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setPost(updatedPost)
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/feed')}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  const canClaim = post.status === 'OPEN' && post.authorId !== currentResident.id
  const isAuthor = post.authorId === currentResident.id
  const isClaimer = post.claimedById === currentResident.id
  const canChat = (isAuthor || isClaimer) && post.status !== 'COMPLETED'
  const canComplete = (isAuthor || isClaimer) && post.status === 'CLAIMED'

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
              <h1 className="text-lg font-semibold text-gray-900">Post Details</h1>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 space-y-4">
        {/* Author Info */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              {post.author.avatar ? (
                <span className="text-lg font-medium text-emerald-700">
                  {post.author.avatar}
                </span>
              ) : (
                <User className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[post.category]}`}>
              {categoryLabels[post.category]}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[post.status]}`}>
              {statusLabels[post.status]}
            </span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>
        </div>

        {/* Claimer Info */}
        {post.status === 'CLAIMED' && post.claimer && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Claimed by {post.claimer.name}</p>
                <p className="text-sm text-yellow-700">This task has been claimed and is in progress</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {post.status === 'COMPLETED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Task Completed</p>
                <p className="text-sm text-green-700">
                  Completed {formatDistanceToNow(new Date(post.completedAt!), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        )}

        {post.status === 'CANCELLED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Task Cancelled</p>
                <p className="text-sm text-red-700">This task has been cancelled by the author</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {canClaim && (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClaiming ? 'Claiming...' : 'Claim This Task'}
            </button>
          )}

          {canComplete && (
            <button
              onClick={handleComplete}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>

        {/* Chat Interface */}
        {canChat && (
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Messages</h3>
              </div>
            </div>
            <ChatInterface
              postId={postId}
              currentResident={currentResident}
              onPostUpdated={handlePostUpdated}
            />
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          postId={postId}
          currentResident={currentResident}
          onClose={() => setShowFeedback(false)}
          onFeedbackSubmitted={() => {
            setShowFeedback(false)
            fetchPost() // Refresh post data
          }}
        />
      )}
    </div>
  )
}








