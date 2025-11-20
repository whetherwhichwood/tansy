'use client'

import { useState, useEffect } from 'react'
import { PostCard } from './PostCard'
import { CreatePostModal } from './CreatePostModal'
import { SearchBar } from './SearchBar'
import { BottomNav } from '../layout/BottomNav'
import { UserMenu } from '../layout/UserMenu'
import { SkeletonCard } from '../ui/SkeletonCard'
import { Plus, Filter } from 'lucide-react'
import { Post, PostCategory, Resident } from '@/lib/types'

interface FeedContentProps {
  resident: Resident
}

export function FeedContent({ resident }: FeedContentProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<PostCategory | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [filter])

  useEffect(() => {
    filterAndSearchPosts()
  }, [posts, filter, searchQuery])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'ALL') {
        params.append('category', filter)
      }
      
      const response = await fetch(`/api/posts?${params}`)
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

  const filterAndSearchPosts = () => {
    let filtered = posts

    // Apply category filter
    if (filter !== 'ALL') {
      filtered = filtered.filter(post => post.category === filter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
    setShowCreateModal(false)
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ))
  }

  const categories = [
    { value: 'ALL', label: 'All Posts', count: posts.length },
    { value: 'HELP_NEEDED', label: 'Help Needed', count: posts.filter(p => p.category === 'HELP_NEEDED').length },
    { value: 'BORROW_LEND', label: 'Borrow/Lend', count: posts.filter(p => p.category === 'BORROW_LEND').length },
    { value: 'GROUP_BUY', label: 'Group Buy', count: posts.filter(p => p.category === 'GROUP_BUY').length },
    { value: 'LOCAL_TIP', label: 'Local Tips', count: posts.filter(p => p.category === 'LOCAL_TIP').length },
  ]

  return (
    <div className="mobile-content">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Neighborly</h1>
              <p className="text-sm text-gray-500">Sunset Ridge HOA</p>
            </div>
            <UserMenu resident={resident} />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b px-4 py-3">
        <SearchBar onSearch={handleSearch} placeholder="Search posts, authors, or descriptions..." />
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value as PostCategory | 'ALL')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === category.value
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <main className="px-4 py-4 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No posts match "${searchQuery}". Try a different search term.`
                : filter === 'ALL' 
                  ? "Be the first to post an errand or offer help!"
                  : `No ${categories.find(c => c.value === filter)?.label.toLowerCase()} posts yet.`
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Post First Errand
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PostCard
                  post={post}
                  currentResident={resident}
                  onPostUpdated={handlePostUpdated}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:scale-110 transition-all duration-200 flex items-center justify-center z-40 animate-bounce-gentle"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          resident={resident}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab="feed" />
    </div>
  )
}
