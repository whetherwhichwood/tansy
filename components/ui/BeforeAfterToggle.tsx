'use client'

import { useFeatureFlags } from '@/lib/featureFlags'
import { Eye, EyeOff } from 'lucide-react'

export default function BeforeAfterToggle() {
  const { isBeforeMode, setIsBeforeMode, showBeforeAfter } = useFeatureFlags()

  if (!showBeforeAfter) return null

  return (
    <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg border border-tansy-gray p-2 flex items-center gap-2">
      <button
        onClick={() => setIsBeforeMode(!isBeforeMode)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isBeforeMode
            ? 'bg-gray-200 text-gray-700'
            : 'bg-tansy-teal text-white'
        }`}
      >
        {isBeforeMode ? (
          <>
            <EyeOff className="w-4 h-4 inline mr-2" />
            Before
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 inline mr-2" />
            After
          </>
        )}
      </button>
      <div className="text-xs text-tansy-gray-dark px-2">
        {isBeforeMode ? 'Original Design' : 'Improved Design'}
      </div>
    </div>
  )
}

