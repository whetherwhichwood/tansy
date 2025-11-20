'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { 
  Calendar, 
  Repeat, 
  Clock, 
  CheckCircle, 
  Edit, 
  Trash2,
  Play
} from 'lucide-react'
import { MaintenanceTask } from '@/lib/types'
import Modal from '@/components/shared/Modal'
import StatusBadge from '@/components/shared/StatusBadge'
import CategoryIcon from '@/components/shared/CategoryIcon'

interface TaskDetailModalProps {
  task: MaintenanceTask & { status: string }
  isOpen: boolean
  onClose: () => void
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

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

  const handleComplete = async () => {
    if (!confirm('Mark this task as complete? The next due date will be automatically calculated.')) {
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}/complete`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to complete task')
      }

      onClose()
      router.refresh()
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Failed to complete task. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      onClose()
      router.refresh()
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !task.isActive
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Failed to update task. Please try again.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <CategoryIcon 
              category={task.category} 
              type="task" 
              className="h-8 w-8 text-neutral-400" 
            />
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{task.name}</h2>
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
            <StatusBadge status={task.status as any} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Next Due Date</p>
                <p className="text-sm text-neutral-600">
                  {format(task.nextDueDate, 'MMMM d, yyyy')}
                  {daysUntilDue >= 0 && (
                    <span className="ml-2 text-xs text-neutral-500">
                      ({daysUntilDue} days remaining)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Repeat className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Frequency</p>
                <p className="text-sm text-neutral-600">{getFrequencyText()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Reminder</p>
                <p className="text-sm text-neutral-600">
                  {task.reminderDays} days before due
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {task.lastCompletedAt && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Last Completed</p>
                  <p className="text-sm text-neutral-600">
                    {format(task.lastCompletedAt, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Created</p>
                <p className="text-sm text-neutral-600">
                  {format(task.createdAt, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Description</h3>
            <p className="text-sm text-neutral-600 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-neutral-200">
          <div className="flex space-x-3">
            <button
              onClick={handleComplete}
              disabled={isCompleting || !task.isActive}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4 mr-2" />
              {isCompleting ? 'Completing...' : 'Mark Complete'}
            </button>

            <button
              onClick={handleToggleActive}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              {task.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}


