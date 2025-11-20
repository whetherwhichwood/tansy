'use client'

import { useState } from 'react'
import { DashboardItem } from '@/lib/types'
import DashboardCard from './DashboardCard'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface UpcomingSectionProps {
  items: DashboardItem[]
}

export default function UpcomingSection({ items }: UpcomingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (items.length === 0) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h2 className="text-xl font-semibold text-neutral-900">
          Upcoming (Next 3 Months) ({items.length})
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-neutral-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-neutral-400" />
        )}
      </button>

      {isExpanded && (
        <div className="grid gap-4">
          {items.map((item) => (
            <DashboardCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}


