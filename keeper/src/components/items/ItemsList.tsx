'use client'

import { useState } from 'react'
import { Item } from '@/lib/types'
import ItemCard from './ItemCard'
import CreateItemModal from './CreateItemModal'

interface ItemsListProps {
  items: (Item & { status: string })[]
}

export default function ItemsList({ items }: ItemsListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['ALL', 'APPLIANCE', 'ELECTRONICS', 'HOME_GOODS', 'TOOLS', 'FURNITURE', 'OTHER']
  const statuses = ['ALL', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED']

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : category.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-neutral-500">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {items.length === 0 ? 'No items yet' : 'No items match your filters'}
            </h3>
            <p className="mb-4">
              {items.length === 0 
                ? 'Get started by adding your first item with a warranty.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Add Your First Item
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateItemModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}


