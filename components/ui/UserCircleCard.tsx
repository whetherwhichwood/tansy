'use client'

import { Plus } from 'lucide-react'
import InfoIcon from './InfoIcon'
import { useFeatureFlags } from '@/lib/featureFlags'

export default function UserCircleCard() {
  const { isBeforeMode } = useFeatureFlags()
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-6">
      <div className="bg-gradient-to-r from-tansy-teal to-tansy-pink rounded-2xl p-6 flex items-center justify-between relative">
        {!isBeforeMode && (
          <div className="absolute top-4 right-4">
            <InfoIcon 
              content="Circles let you manage healthcare for yourself or family members. Switch between profiles to manage appointments and information for different people."
              size="sm"
              className="!bg-white/20 !text-white hover:!bg-white/30"
            />
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center border-2 border-tansy-pink">
            <span className="text-white text-2xl font-semibold">G</span>
          </div>
          <span className="text-tansy-teal-dark font-medium">Me</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-tansy-gray-dark flex items-center justify-center">
            <Plus className="w-6 h-6 text-tansy-gray-dark" />
          </div>
          <span className="text-tansy-gray-dark font-medium">
            {isBeforeMode ? 'New Circle' : 'Add to Circle'}
          </span>
        </div>
      </div>
    </div>
  )
}

