'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface FeatureFlagsContextType {
  showBeforeAfter: boolean
  toggleBeforeAfter: () => void
  isBeforeMode: boolean
  setIsBeforeMode: (value: boolean) => void
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined)

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [showBeforeAfter, setShowBeforeAfter] = useState(true)
  const [isBeforeMode, setIsBeforeMode] = useState(false)

  const toggleBeforeAfter = () => {
    setShowBeforeAfter(!showBeforeAfter)
  }

  return (
    <FeatureFlagsContext.Provider
      value={{
        showBeforeAfter,
        toggleBeforeAfter,
        isBeforeMode,
        setIsBeforeMode,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext)
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider')
  }
  return context
}

