'use client'

import { useState } from 'react'
import { MaintenanceTask } from '@/lib/types'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'

interface TasksListProps {
  tasks: (MaintenanceTask & { status: string })[]
}

export default function TasksList({ tasks }: TasksListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [activeFilter, setActiveFilter] = useState('ALL')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || task.category === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    const matchesActive = activeFilter === 'ALL' || 
      (activeFilter === 'ACTIVE' && task.isActive) ||
      (activeFilter === 'INACTIVE' && !task.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesActive
  })

  const categories = ['ALL', 'HVAC', 'PLUMBING', 'ELECTRICAL', 'YARD', 'GENERAL', 'CUSTOM']
  const statuses = ['ALL', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED']
  const activeStatuses = ['ALL', 'ACTIVE', 'INACTIVE']

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
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
                  {category === 'ALL' ? 'All Categories' : category}
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

          {/* Active Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Active
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="block w-full rounded-md border border-neutral-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            >
              {activeStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Tasks' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-neutral-500">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="mb-4">
              {tasks.length === 0 
                ? 'Get started by adding your first maintenance task.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Add Your First Task
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}


