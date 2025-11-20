'use client'

import { useState } from 'react'
import { Waves, Calendar } from 'lucide-react'
import InfoIcon from './InfoIcon'
import { useFeatureFlags } from '@/lib/featureFlags'

interface TabNavigationProps {
  mainTabs?: { id: string; label: string; icon?: React.ReactNode }[]
  subTabs?: { id: string; label: string }[]
  onMainTabChange?: (tabId: string) => void
  onSubTabChange?: (tabId: string) => void
  defaultMainTab?: string
  defaultSubTab?: string
}

export default function TabNavigation({
  mainTabs = [
    { id: 'feed', label: 'Feed', icon: <Waves className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
  ],
  subTabs,
  onMainTabChange,
  onSubTabChange,
  defaultMainTab = 'appointments',
  defaultSubTab = 'upcoming',
}: TabNavigationProps) {
  const [activeMainTab, setActiveMainTab] = useState(defaultMainTab)
  const [activeSubTab, setActiveSubTab] = useState(defaultSubTab)
  const { isBeforeMode } = useFeatureFlags()

  const handleMainTabClick = (tabId: string) => {
    setActiveMainTab(tabId)
    onMainTabChange?.(tabId)
  }

  const handleSubTabClick = (tabId: string) => {
    setActiveSubTab(tabId)
    onSubTabChange?.(tabId)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-6">
      <div className="flex gap-2 mb-4">
        {mainTabs.map((tab) => (
          <div key={tab.id} className="flex-1 flex items-center gap-2">
            <button
              onClick={() => handleMainTabClick(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeMainTab === tab.id
                  ? 'bg-white text-tansy-gray-darker shadow-sm'
                  : 'text-tansy-gray-dark hover:bg-white/50'
              }`}
            >
            {tab.icon}
            {tab.label}
          </button>
          {!isBeforeMode && tab.id === 'feed' && (
            <InfoIcon content="View your activity feed with recent updates, tasks, and notifications" />
          )}
          {!isBeforeMode && tab.id === 'appointments' && (
            <InfoIcon content="Manage your upcoming, past, and canceled appointments all in one place" />
          )}
          </div>
        ))}
      </div>
      {subTabs && activeMainTab === 'appointments' && (
        <div className="flex gap-2 items-center">
          {subTabs.map((tab) => (
            <div key={tab.id} className="flex items-center gap-1.5">
              <button
                onClick={() => handleSubTabClick(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-tansy-teal-dark text-white'
                    : 'text-tansy-gray-dark hover:bg-tansy-gray-light'
                }`}
              >
                {tab.label}
              </button>
              {!isBeforeMode && tab.id === 'upcoming' && (
                <InfoIcon content="View all your scheduled appointments that are coming up" size="sm" />
              )}
              {!isBeforeMode && tab.id === 'past' && (
                <InfoIcon content="Review your appointment history and past visits" size="sm" />
              )}
              {!isBeforeMode && tab.id === 'canceled' && (
                <InfoIcon content="See appointments that were canceled or rescheduled" size="sm" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

