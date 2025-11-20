'use client'

import { useState } from 'react'
import { X, Loader2, ThumbsUp, MessageCircle, Clock } from 'lucide-react'
import { Resident } from '@/lib/types'

interface FeedbackModalProps {
  postId: string
  currentResident: Resident
  onClose: () => void
  onFeedbackSubmitted: () => void
}

const badgeOptions = [
  { emoji: '👍', label: 'Helpful', icon: ThumbsUp },
  { emoji: '💬', label: 'Friendly', icon: MessageCircle },
  { emoji: '⏱️', label: 'Quick', icon: Clock },
]

export function FeedbackModal({ postId, currentResident, onClose, onFeedbackSubmitted }: FeedbackModalProps) {
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedBadges.length === 0) {
      setError('Please select at least one badge')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          badges: selectedBadges,
          comment: comment.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      onFeedbackSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Leave Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              How was your experience? Select the badges that best describe the interaction.
            </p>
            
            <div className="space-y-3">
              {badgeOptions.map((badge) => {
                const Icon = badge.icon
                const isSelected = selectedBadges.includes(badge.emoji)
                
                return (
                  <button
                    key={badge.emoji}
                    type="button"
                    onClick={() => handleBadgeToggle(badge.emoji)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{badge.emoji}</span>
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{badge.label}</span>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Optional Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Share any additional thoughts about the interaction..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedBadges.length === 0}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}








