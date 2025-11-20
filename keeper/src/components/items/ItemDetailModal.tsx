'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { 
  Calendar, 
  DollarSign, 
  Store, 
  FileText, 
  Edit, 
  Trash2, 
  ExternalLink 
} from 'lucide-react'
import { Item } from '@/lib/types'
import Modal from '@/components/shared/Modal'
import StatusBadge from '@/components/shared/StatusBadge'
import CategoryIcon from '@/components/shared/CategoryIcon'

interface ItemDetailModalProps {
  item: Item & { status: string }
  isOpen: boolean
  onClose: () => void
}

export default function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const getDaysUntilExpiration = () => {
    if (!item.warrantyEndDate) return null
    const now = new Date()
    const diffTime = item.warrantyEndDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilExpiration = getDaysUntilExpiration()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      onClose()
      router.refresh()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Item Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <CategoryIcon 
              category={item.category} 
              type="item" 
              className="h-8 w-8 text-neutral-400" 
            />
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{item.name}</h2>
              <p className="text-sm text-neutral-500">
                {item.category.replace('_', ' ')}
              </p>
            </div>
          </div>
          <StatusBadge status={item.status as any} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {item.purchaseDate && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Purchase Date</p>
                  <p className="text-sm text-neutral-600">
                    {format(item.purchaseDate, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {item.warrantyEndDate && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Warranty End Date</p>
                  <p className="text-sm text-neutral-600">
                    {format(item.warrantyEndDate, 'MMMM d, yyyy')}
                    {daysUntilExpiration !== null && (
                      <span className="ml-2 text-xs text-neutral-500">
                        ({daysUntilExpiration} days {daysUntilExpiration < 0 ? 'ago' : 'remaining'})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {item.purchasePrice && (
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Purchase Price</p>
                  <p className="text-sm text-neutral-600">${item.purchasePrice.toFixed(2)}</p>
                </div>
              </div>
            )}

            {item.vendor && (
              <div className="flex items-center space-x-3">
                <Store className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Vendor</p>
                  <p className="text-sm text-neutral-600">{item.vendor}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {item.receiptUrl && (
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">Receipt</p>
                  <a
                    href={item.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:text-accent/80 flex items-center space-x-1"
                  >
                    <span>View receipt</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Added</p>
                <p className="text-sm text-neutral-600">
                  {format(item.createdAt, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Notes</h3>
            <p className="text-sm text-neutral-600 whitespace-pre-wrap">{item.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
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
    </Modal>
  )
}


