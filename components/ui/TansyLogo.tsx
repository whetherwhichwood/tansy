'use client'

interface TansyLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function TansyLogo({ size = 'md', showText = true, className = '' }: TansyLogoProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Pink circles in floral/spiky pattern */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          {/* Central circle */}
          <circle cx="12" cy="12" r="3" fill="#F687B3" />
          {/* Inner spiral circles */}
          <circle cx="12" cy="8" r="2" fill="#F687B3" />
          <circle cx="15" cy="10" r="1.5" fill="#F687B3" />
          <circle cx="9" cy="10" r="1.5" fill="#F687B3" />
          {/* Outer radiating circles */}
          <circle cx="12" cy="4" r="2" fill="#F687B3" />
          <circle cx="18" cy="8" r="1.5" fill="#F687B3" />
          <circle cx="20" cy="12" r="1.5" fill="#F687B3" />
          <circle cx="18" cy="16" r="1.5" fill="#F687B3" />
          <circle cx="12" cy="20" r="2" fill="#F687B3" />
          <circle cx="6" cy="16" r="1.5" fill="#F687B3" />
          <circle cx="4" cy="12" r="1.5" fill="#F687B3" />
          <circle cx="6" cy="8" r="1.5" fill="#F687B3" />
          {/* Additional accent circles */}
          <circle cx="16" cy="6" r="1" fill="#F687B3" />
          <circle cx="8" cy="6" r="1" fill="#F687B3" />
          <circle cx="16" cy="18" r="1" fill="#F687B3" />
          <circle cx="8" cy="18" r="1" fill="#F687B3" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-tansy-teal-dark`}>
          Tansy
        </span>
      )}
    </div>
  )
}

