'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Plus } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import ChatSearchBar from '@/components/ui/ChatSearchBar'
import UserCircleCard from '@/components/ui/UserCircleCard'
import TabNavigation from '@/components/ui/TabNavigation'
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist'
import ActiveActionCard from '@/components/ui/ActiveActionCard'
import Tooltip from '@/components/ui/Tooltip'
import InfoIcon from '@/components/ui/InfoIcon'
import { useFeatureFlags } from '@/lib/featureFlags'
import { mockOnboardingItems, mockOnboardingItemsBefore, mockActiveActions } from '@/lib/mockData'

export default function DashboardPage() {
  const [activeSubTab, setActiveSubTab] = useState('upcoming')
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const { isBeforeMode } = useFeatureFlags()

  // Check localStorage for onboarding completion status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('tansy_onboarding_complete') === 'true'
      setOnboardingComplete(completed)
    }
  }, [])

  // Show before version if in before mode
  if (isBeforeMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-tansy-gray-light to-white pb-8">
        <div className="pt-8">
          <SearchBar />
          
          {/* Onboarding Checklist - Below search bar in before mode */}
          <div className="w-full max-w-2xl mx-auto px-4 mt-6 mb-6">
            <OnboardingChecklist items={mockOnboardingItemsBefore} />
          </div>
          
          <UserCircleCard />
          <TabNavigation
            subTabs={[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past' },
              { id: 'canceled', label: 'Canceled' },
            ]}
            onSubTabChange={setActiveSubTab}
          />
          <div className="w-full max-w-2xl mx-auto px-4 mt-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-tansy-pink to-tansy-pink-dark rounded-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
              </div>
            </div>
            <p className="text-tansy-gray-dark text-lg">Nothing here</p>
          </div>
        </div>
      </div>
    )
  }

  // Improved version
  return (
    <div className="min-h-screen bg-gradient-to-b from-tansy-gray-light to-white pb-8">
      <div className="pt-8">
        {/* Onboarding Checklist - Auto-hides when complete */}
        <div className="w-full max-w-2xl mx-auto px-4 mb-6">
          <OnboardingChecklist 
            items={mockOnboardingItems} 
            onCompletionChange={setOnboardingComplete}
          />
        </div>

        {/* Rest of UI - Only shown when onboarding is complete */}
        {onboardingComplete && (
          <>
            {/* Chat with Tansy - Merged Search/Chat Input */}
            <div className="w-full max-w-2xl mx-auto px-4 mb-6">
              <ChatSearchBar />
            </div>

            {/* Quick Actions Section */}
            <div className="w-full max-w-2xl mx-auto px-4 mb-6">
              <div className="bg-gradient-to-r from-tansy-teal to-tansy-pink rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                  <InfoIcon 
                    content="Quick access to your most important tasks and actions. Click on any action to get started." 
                    size="sm"
                    className="!bg-white/20 !text-white hover:!bg-white/30"
                  />
                </div>
                
                {/* Active Actions - Chat with Tansy is first (user-centered design) */}
                <div className="space-y-3">
                  {mockActiveActions.map((action) => (
                    <ActiveActionCard key={action.id} {...action} />
                  ))}
                </div>
              </div>
            </div>

            {/* User Circles */}
            <UserCircleCard />

            {/* Tab Navigation */}
            <TabNavigation
              subTabs={[
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'past', label: 'Past' },
                { id: 'canceled', label: 'Canceled' },
              ]}
              onSubTabChange={setActiveSubTab}
            />

            {/* Content Area */}
            <div className="w-full max-w-2xl mx-auto px-4 mt-8">
              {activeSubTab === 'upcoming' && (
                <div className="bg-white rounded-2xl p-6 border border-tansy-gray">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 relative mb-4 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-tansy-pink to-tansy-pink-dark rounded-sm"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                      </div>
                    </div>
                    <p className="text-tansy-gray-dark text-lg mb-2">No upcoming appointments</p>
                    <Link
                      href="/chat"
                      className="inline-flex items-center gap-2 text-tansy-teal-dark font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Schedule one now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

