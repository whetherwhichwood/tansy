'use client'

import { ThumbsUp, MessageCircle, Clock } from 'lucide-react'

interface ReputationBadgeProps {
  badges: Record<string, number>
  reputationScore: number
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
}

export function ReputationBadge({ 
  badges, 
  reputationScore, 
  size = 'md',
  showScore = true 
}: ReputationBadgeProps) {
  const badgeData = [
    { emoji: '👍', label: 'Helpful', count: badges['👍'] || 0, icon: ThumbsUp },
    { emoji: '💬', label: 'Friendly', count: badges['💬'] || 0, icon: MessageCircle },
    { emoji: '⏱️', label: 'Quick', count: badges['⏱️'] || 0, icon: Clock },
  ]

  const sizeClasses = {
    sm: {
      container: 'text-xs',
      badge: 'px-2 py-1',
      icon: 'w-3 h-3',
      score: 'text-xs',
    },
    md: {
      container: 'text-sm',
      badge: 'px-3 py-1.5',
      icon: 'w-4 h-4',
      score: 'text-sm',
    },
    lg: {
      container: 'text-base',
      badge: 'px-4 py-2',
      icon: 'w-5 h-5',
      score: 'text-base',
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className={`${classes.container}`}>
      {/* Reputation Score */}
      {showScore && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">Reputation Score</span>
            <span className={`font-semibold text-emerald-600 ${classes.score}`}>
              {reputationScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(reputationScore, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Badge Counts */}
      <div className="flex flex-wrap gap-2">
        {badgeData.map((badge) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.emoji}
              className={`${classes.badge} bg-gray-100 rounded-full flex items-center space-x-1`}
            >
              <span className="text-lg">{badge.emoji}</span>
              <Icon className={`${classes.icon} text-gray-600`} />
              <span className="font-medium text-gray-700">{badge.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}








