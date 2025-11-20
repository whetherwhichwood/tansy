'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/shared/Modal'
import DatePicker from '@/components/shared/DatePicker'
import { MAINTENANCE_TEMPLATES, TASK_CATEGORIES, FREQUENCY_OPTIONS } from '@/lib/maintenance-templates'

const createTaskSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  customInterval: z.number().optional(),
  nextDueDate: z.string().min(1, 'Next due date is required'),
  reminderDays: z.number().min(0).max(365).optional(),
})

type CreateTaskData = z.infer<typeof createTaskSchema>

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      reminderDays: 7
    }
  })

  const selectedFrequency = watch('frequency')

  const handleTemplateSelect = (templateId: string) => {
    const template = MAINTENANCE_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setValue('name', template.name)
      setValue('description', template.description)
      setValue('category', template.category)
      setValue('frequency', template.frequency)
    }
  }

  const onSubmit = async (data: CreateTaskData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          customInterval: data.frequency === 'CUSTOM' ? data.customInterval : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task')
      }

      reset()
      setSelectedTemplate('')
      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedTemplate('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Task" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Quick Start Templates (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {MAINTENANCE_TEMPLATES.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                className={`p-3 text-left border rounded-md transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-accent bg-accent/5'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-neutral-500">{template.description}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  {template.category} • {template.frequency}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Task Name *
            </label>
            <input
              {...register('name')}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="e.g., Change HVAC Filter"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Category *
            </label>
            <select
              {...register('category')}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            >
              <option value="">Select category</option>
              {TASK_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Frequency *
            </label>
            <select
              {...register('frequency')}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            >
              <option value="">Select frequency</option>
              {FREQUENCY_OPTIONS.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            {errors.frequency && (
              <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
            )}
          </div>

          {/* Custom Interval */}
          {selectedFrequency === 'CUSTOM' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Custom Interval (Days)
              </label>
              <input
                {...register('customInterval', { valueAsNumber: true })}
                type="number"
                min="1"
                className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                placeholder="e.g., 14"
              />
              {errors.customInterval && (
                <p className="mt-1 text-sm text-red-600">{errors.customInterval.message}</p>
              )}
            </div>
          )}

          {/* Next Due Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Next Due Date *
            </label>
            <DatePicker
              value={watch('nextDueDate')}
              onChange={(value) => setValue('nextDueDate', value)}
            />
            {errors.nextDueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.nextDueDate.message}</p>
            )}
          </div>

          {/* Reminder Days */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Reminder (Days Before)
            </label>
            <input
              {...register('reminderDays', { valueAsNumber: true })}
              type="number"
              min="0"
              max="365"
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="7"
            />
            {errors.reminderDays && (
              <p className="mt-1 text-sm text-red-600">{errors.reminderDays.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            placeholder="Optional description or instructions..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-accent border border-transparent rounded-md shadow-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}


