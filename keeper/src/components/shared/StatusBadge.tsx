interface StatusBadgeProps {
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED'
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const statusConfig = {
    ACTIVE: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    EXPIRING_SOON: {
      label: 'Expiring Soon',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    EXPIRED: {
      label: 'Expired',
      className: 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  )
}


