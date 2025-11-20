'use client'

import { Info } from 'lucide-react'
import Tooltip from './Tooltip'

interface InfoIconProps {
  content: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function InfoIcon({ content, size = 'sm', className = '' }: InfoIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <Tooltip content={content} position="top" delay={200}>
      <button
        className={`inline-flex items-center justify-center rounded-full bg-tansy-gray-light text-tansy-gray-dark hover:bg-tansy-gray hover:text-tansy-gray-darker transition-colors ${sizeClasses[size]} ${className}`}
        aria-label="More information"
      >
        <Info className={`${sizeClasses[size]} p-0.5`} />
      </button>
    </Tooltip>
  )
}

