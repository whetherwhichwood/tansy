'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import CreateItemModal from './CreateItemModal'

export default function CreateItemButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </button>

      <CreateItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}


