import { DashboardItem } from '@/lib/types'
import { format } from 'date-fns'
import { Package, Repeat, FileText, Calendar, AlertCircle } from 'lucide-react'

interface DashboardCardProps {
  item: DashboardItem
}

const typeIcons = {
  item: Package,
  task: Repeat,
  document: FileText,
}

const urgencyStyles = {
  red: 'bg-red-50 border-red-200 text-red-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  green: 'bg-green-50 border-green-200 text-green-800',
}

const urgencyIcons = {
  red: 'text-red-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
}

export default function DashboardCard({ item }: DashboardCardProps) {
  const Icon = typeIcons[item.type]
  const urgencyStyle = urgencyStyles[item.urgency]
  const urgencyIcon = urgencyIcons[item.urgency]

  const getStatusText = () => {
    if (item.daysUntilDue < 0) return 'Overdue'
    if (item.daysUntilDue === 0) return 'Due today'
    if (item.daysUntilDue === 1) return 'Due tomorrow'
    return `Due in ${item.daysUntilDue} days`
  }

  const getCategoryLabel = () => {
    const categoryMap: Record<string, string> = {
      'APPLIANCE': 'Appliance',
      'ELECTRONICS': 'Electronics',
      'HOME_GOODS': 'Home Goods',
      'TOOLS': 'Tools',
      'FURNITURE': 'Furniture',
      'OTHER': 'Other',
      'HVAC': 'HVAC',
      'PLUMBING': 'Plumbing',
      'ELECTRICAL': 'Electrical',
      'YARD': 'Yard',
      'GENERAL': 'General',
      'CUSTOM': 'Custom',
      'DRIVERS_LICENSE': 'Driver\'s License',
      'PASSPORT': 'Passport',
      'CAR_REGISTRATION': 'Car Registration',
      'INSURANCE': 'Insurance',
      'PROFESSIONAL_LICENSE': 'Professional License',
      'SUBSCRIPTION': 'Subscription',
    }
    return categoryMap[item.category] || item.category
  }

  return (
    <div className={`rounded-lg border p-6 ${urgencyStyle}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-neutral-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-neutral-900 truncate">
              {item.name}
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              {getCategoryLabel()} • {item.type === 'item' ? 'Warranty' : item.type === 'task' ? 'Maintenance' : 'Document'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AlertCircle className={`h-5 w-5 ${urgencyIcon}`} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <span className="text-neutral-600">
            {format(item.dueDate, 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="text-sm font-medium">
          {getStatusText()}
        </div>
      </div>

      <div className="mt-4 flex space-x-3">
        <button className="text-sm font-medium text-accent hover:text-accent/80">
          View Details
        </button>
        {item.type === 'task' && (
          <button className="text-sm font-medium text-accent hover:text-accent/80">
            Mark Complete
          </button>
        )}
        <button className="text-sm font-medium text-neutral-500 hover:text-neutral-700">
          Snooze
        </button>
      </div>
    </div>
  )
}


