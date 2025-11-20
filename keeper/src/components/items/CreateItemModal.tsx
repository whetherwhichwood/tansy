'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/shared/Modal'
import DatePicker from '@/components/shared/DatePicker'
import FileUpload from '@/components/shared/FileUpload'
import { ITEM_CATEGORIES } from '@/lib/maintenance-templates'

const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  warrantyEndDate: z.string().optional(),
  purchasePrice: z.string().optional(),
  vendor: z.string().optional(),
  notes: z.string().optional(),
})

type CreateItemData = z.infer<typeof createItemSchema>

interface CreateItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateItemModal({ isOpen, onClose }: CreateItemModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateItemData>({
    resolver: zodResolver(createItemSchema)
  })

  const onSubmit = async (data: CreateItemData) => {
    setIsLoading(true)
    setError('')

    try {
      // Upload file if selected
      let receiptUrl = ''
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        
        const uploadResponse = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          receiptUrl = uploadData.url
        }
      }

      // Create item
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
          receiptUrl: receiptUrl || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create item')
      }

      reset()
      setSelectedFile(null)
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
    setSelectedFile(null)
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Item" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Item Name *
            </label>
            <input
              {...register('name')}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="e.g., Samsung Refrigerator"
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
              {ITEM_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Purchase Date *
            </label>
            <DatePicker
              value={watch('purchaseDate')}
              onChange={(value) => setValue('purchaseDate', value)}
            />
            {errors.purchaseDate && (
              <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>
            )}
          </div>

          {/* Warranty End Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Warranty End Date
            </label>
            <DatePicker
              value={watch('warrantyEndDate')}
              onChange={(value) => setValue('warrantyEndDate', value)}
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Purchase Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-neutral-500 sm:text-sm">$</span>
              </div>
              <input
                {...register('purchasePrice')}
                type="number"
                step="0.01"
                className="block w-full pl-7 rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Vendor/Store
            </label>
            <input
              {...register('vendor')}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="e.g., Best Buy, Amazon"
            />
          </div>
        </div>

        {/* Receipt Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Receipt (Optional)
          </label>
          <FileUpload
            onFileSelect={setSelectedFile}
            accept="image/*,.pdf"
            maxSize={5}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            placeholder="Any additional notes about this item..."
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
            {isLoading ? 'Creating...' : 'Create Item'}
          </button>
        </div>
      </form>
    </Modal>
  )
}


