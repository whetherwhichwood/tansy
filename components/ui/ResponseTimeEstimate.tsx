'use client'

import { Clock } from 'lucide-react'

interface ResponseTimeEstimateProps {
  minutes: number
  variant?: 'inline' | 'badge' | 'card'
}

export default function ResponseTimeEstimate({ minutes, variant = 'inline' }: ResponseTimeEstimateProps) {
  const getTimeText = (mins: number) => {
    if (mins < 1) return 'Less than a minute'
    if (mins === 1) return '1 minute'
    return `${mins} minutes`
  }

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-tansy-teal-light rounded-full">
        <Clock className="w-4 h-4 text-tansy-teal-dark" />
        <span className="text-sm font-medium text-tansy-teal-dark">
          Est. {getTimeText(minutes)}
        </span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="bg-tansy-gray-light rounded-lg p-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-tansy-teal-dark" />
        <div>
          <div className="text-xs text-tansy-gray-dark">Estimated response time</div>
          <div className="text-sm font-semibold text-tansy-gray-darker">
            {getTimeText(minutes)}
          </div>
        </div>
      </div>
    )
  }

  // inline variant (default)
  return (
    <span className="inline-flex items-center gap-1 text-sm text-tansy-gray-dark">
      <Clock className="w-4 h-4" />
      Estimated response: {getTimeText(minutes)}
    </span>
  )
}

