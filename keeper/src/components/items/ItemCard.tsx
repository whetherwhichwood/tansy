'use client'

import { useState } from 'react'
import { Item } from '@/lib/types'
import { format } from 'date-fns'
import { Package, Calendar, DollarSign, Store, FileText } from 'lucide-react'
import StatusBadge from '@/components/shared/StatusBadge'
import CategoryIcon from '@/components/shared/CategoryIcon'
import ItemDetailModal from './ItemDetailModal'

interface ItemCardProps {
  item: Item & { status: string }
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const getDaysUntilExpiration = () => {
    if (!item.warrantyEndDate) return null
    const now = new Date()
    const diffTime = item.warrantyEndDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilExpiration = getDaysUntilExpiration()

  return (
    <>
      <div 
        className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CategoryIcon 
                category={item.category} 
                type="item" 
                className="h-6 w-6 text-neutral-400" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-neutral-900 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-neutral-500">
                {item.category.replace('_', ' ')}
              </p>
            </div>
          </div>
          <StatusBadge status={item.status as any} size="sm" />
        </div>

        <div className="space-y-2">
          {item.purchaseDate && (
            <div className="flex items-center text-sm text-neutral-600">
              <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
              <span>Purchased {format(item.purchaseDate, 'MMM d, yyyy')}</span>
            </div>
          )}

          {item.warrantyEndDate && (
            <div className="flex items-center text-sm text-neutral-600">
              <Package className="h-4 w-4 mr-2 text-neutral-400" />
              <span>
                Warranty {daysUntilExpiration !== null && daysUntilExpiration < 0 
                  ? 'expired' 
                  : `expires ${format(item.warrantyEndDate, 'MMM d, yyyy')}`
                }
                {daysUntilExpiration !== null && daysUntilExpiration >= 0 && (
                  <span className="ml-1 text-xs text-neutral-500">
                    ({daysUntilExpiration} days)
                  </span>
                )}
              </span>
            </div>
          )}

          {item.purchasePrice && (
            <div className="flex items-center text-sm text-neutral-600">
              <DollarSign className="h-4 w-4 mr-2 text-neutral-400" />
              <span>${item.purchasePrice.toFixed(2)}</span>
            </div>
          )}

          {item.vendor && (
            <div className="flex items-center text-sm text-neutral-600">
              <Store className="h-4 w-4 mr-2 text-neutral-400" />
              <span>{item.vendor}</span>
            </div>
          )}

          {item.receiptUrl && (
            <div className="flex items-center text-sm text-neutral-600">
              <FileText className="h-4 w-4 mr-2 text-neutral-400" />
              <span>Receipt attached</span>
            </div>
          )}
        </div>

        {item.notes && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 line-clamp-2">
              {item.notes}
            </p>
          </div>
        )}
      </div>

      <ItemDetailModal 
        item={item}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  )
}


