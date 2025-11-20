'use client'

import { useState } from 'react'
import { MaintenanceTask } from '@/lib/types'
import { format } from 'date-fns'
import { Repeat, Calendar, Clock, CheckCircle } from 'lucide-react'
import StatusBadge from '@/components/shared/StatusBadge'
import CategoryIcon from '@/components/shared/CategoryIcon'
import TaskDetailModal from './TaskDetailModal'

interface TaskCardProps {
  task: MaintenanceTask & { status: string }
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const getDaysUntilDue = () => {
    const now = new Date()
    const diffTime = task.nextDueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue()

  const getFrequencyText = () => {
    switch (task.frequency) {
      case 'MONTHLY': return 'Monthly'
      case 'QUARTERLY': return 'Quarterly'
      case 'SEMI_ANNUAL': return 'Semi-Annual'
      case 'ANNUAL': return 'Annual'
      case 'CUSTOM': return `Every ${task.customInterval} days`
      default: return task.frequency
    }
  }

  return (
    <>
      <div 
        className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer ${
          !task.isActive ? 'opacity-60' : ''
        }`}
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CategoryIcon 
                category={task.category} 
                type="task" 
                className="h-6 w-6 text-neutral-400" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-neutral-900 truncate">
                {task.name}
              </h3>
              <p className="text-sm text-neutral-500">
                {task.category}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!task.isActive && (
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                Inactive
              </span>
            )}
            <StatusBadge status={task.status as any} size="sm" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
            <span>
              Due {format(task.nextDueDate, 'MMM d, yyyy')}
              {daysUntilDue >= 0 && (
                <span className="ml-1 text-xs text-neutral-500">
                  ({daysUntilDue} days)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center text-sm text-neutral-600">
            <Repeat className="h-4 w-4 mr-2 text-neutral-400" />
            <span>{getFrequencyText()}</span>
          </div>

          {task.lastCompletedAt && (
            <div className="flex items-center text-sm text-neutral-600">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>
                Last completed {format(task.lastCompletedAt, 'MMM d, yyyy')}
              </span>
            </div>
          )}

          {task.description && (
            <div className="pt-2 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 line-clamp-2">
                {task.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <TaskDetailModal 
        task={task}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  )
}


