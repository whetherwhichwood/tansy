'use client'

import Link from 'next/link'
import { MessageCircle, Calendar, CheckSquare, Clock, ArrowRight } from 'lucide-react'
import ResponseTimeEstimate from './ResponseTimeEstimate'

interface ActiveActionCardProps {
  id: string
  title: string
  description: string
  type: 'chat' | 'task' | 'appointment'
  priority: 'high' | 'medium' | 'low'
  estimatedTime?: number
}

export default function ActiveActionCard({
  id,
  title,
  description,
  type,
  priority,
  estimatedTime,
}: ActiveActionCardProps) {
  const iconMap = {
    chat: MessageCircle,
    task: CheckSquare,
    appointment: Calendar,
  }

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-blue-500 bg-blue-50',
  }

  const Icon = iconMap[type]
  const href = type === 'chat' ? '/chat' : '/dashboard'
  
  // Enhanced visual hierarchy for Chat with Tansy (primary action)
  const isPrimaryAction = id === 'chat'
  const cardClasses = isPrimaryAction
    ? 'block border-l-4 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all border-l-tansy-teal bg-gradient-to-r from-tansy-teal-light/30 to-white'
    : `block border-l-4 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${priorityColors[priority]}`

  return (
    <Link
      href={href}
      className={cardClasses}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${isPrimaryAction ? 'bg-tansy-teal text-white' : 'bg-white'}`}>
            <Icon className={`w-5 h-5 ${isPrimaryAction ? 'text-white' : 'text-tansy-teal-dark'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold mb-1 ${isPrimaryAction ? 'text-tansy-teal-dark text-lg' : 'text-tansy-gray-darker'}`}>
              {title}
            </h3>
            <p className="text-sm text-tansy-gray-dark mb-2">{description}</p>
            {estimatedTime && (
              <ResponseTimeEstimate minutes={estimatedTime} variant="inline" />
            )}
          </div>
        </div>
        <ArrowRight className={`w-5 h-5 flex-shrink-0 ${isPrimaryAction ? 'text-tansy-teal-dark' : 'text-tansy-gray-dark'}`} />
      </div>
    </Link>
  )
}

