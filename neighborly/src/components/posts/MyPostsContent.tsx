'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PostCard } from '../feed/PostCard'
import { BottomNav } from '../layout/BottomNav'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Post, PostStatus, Resident } from '@/lib/types'

interface MyPostsContentProps {
  resident: Resident
}

export function MyPostsContent({ resident }: MyPostsContentProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'requests' | 'helping'>('requests')
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [activeTab])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts/my-posts?type=${activeTab}`)
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ))
  }

  const getStatusIcon = (status: PostStatus) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="w-4 h-4 text-green-600" />
      case 'CLAIMED':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-gray-600" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusText = (status: PostStatus) => {
    switch (status) {
      case 'OPEN':
        return 'Waiting for someone to help'
      case 'CLAIMED':
        return 'Someone is helping'
      case 'COMPLETED':
        return 'Task completed'
      case 'CANCELLED':
        return 'Task cancelled'
    }
  }

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'OPEN':
        return 'text-green-600'
      case 'CLAIMED':
        return 'text-yellow-600'
      case 'COMPLETED':
        return 'text-gray-600'
      case 'CANCELLED':
        return 'text-red-600'
    }
  }

  return (
    <div className="mobile-content">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">My Posts</h1>
              <p className="text-sm text-gray-500">Manage your errands and help</p>
            </div>
            <button
              onClick={() => router.push('/feed')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              New Post
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Requests
            </button>
            <button
              onClick={() => setActiveTab('helping')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'helping'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Helping Others
            </button>
          </div>
        </div>
      </div>

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
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'requests' ? 'No requests yet' : 'Not helping anyone yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'requests' 
                ? "You haven't posted any errands yet. Create your first request!"
                : "You haven't claimed any tasks yet. Browse the feed to help your neighbors!"
              }
            </p>
            <button
              onClick={() => router.push('/feed')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {activeTab === 'requests' ? 'Post First Request' : 'Browse Feed'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                {/* Status Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(post.status)}
                    <span className={`text-sm font-medium ${getStatusColor(post.status)}`}>
                      {getStatusText(post.status)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {activeTab === 'requests' ? 'Your request' : 'Helping with'}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {post.description.length > 100 
                      ? `${post.description.substring(0, 100)}...` 
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
                        {activeTab === 'requests' 
                          ? `Being helped by ${post.claimer.name}`
                          : `You're helping ${post.author.name}`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => router.push(`/feed/${post.id}`)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    View Details
                  </button>
                  
                  {post.status === 'COMPLETED' && (
                    <span className="text-xs text-gray-500">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="my-posts" />
    </div>
  )
}








