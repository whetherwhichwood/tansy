'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Plus } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import UserCircleCard from '@/components/ui/UserCircleCard'
import TabNavigation from '@/components/ui/TabNavigation'
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist'
import ActiveActionCard from '@/components/ui/ActiveActionCard'
import Tooltip from '@/components/ui/Tooltip'
import ResponseTimeEstimate from '@/components/ui/ResponseTimeEstimate'
import { useFeatureFlags } from '@/lib/featureFlags'
import { mockOnboardingItems, mockActiveActions } from '@/lib/mockData'

export default function DashboardPageImproved() {
  const [activeSubTab, setActiveSubTab] = useState('upcoming')
  const { isBeforeMode } = useFeatureFlags()

  // Show before version if in before mode
  if (isBeforeMode) {
    return <DashboardPageBefore />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tansy-gray-light to-white pb-8">
      <div className="pt-8">
        {/* Onboarding Checklist - Auto-hides when complete */}
        <div className="w-full max-w-2xl mx-auto px-4 mb-6">
          <OnboardingChecklist items={mockOnboardingItems} />
        </div>

        {/* Chat & Actions Front-and-Center Section */}
        <div className="w-full max-w-2xl mx-auto px-4 mb-6">
          <div className="bg-gradient-to-r from-tansy-teal to-tansy-pink rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              <Tooltip content="Start a conversation with Tansy AI to get help with appointments, insurance, or any healthcare questions">
                <Link
                  href="/chat"
                  className="flex items-center gap-2 bg-white text-tansy-teal-dark px-4 py-2 rounded-lg font-medium hover:bg-tansy-gray-light transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </Link>
              </Tooltip>
            </div>
            
            {/* Active Actions */}
            <div className="space-y-3">
              {mockActiveActions.map((action) => (
                <ActiveActionCard key={action.id} {...action} />
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar with Tooltip */}
        <div className="w-full max-w-2xl mx-auto px-4 mb-6">
          <Tooltip content="Search for providers, appointments, or ask Tansy AI a question">
            <div>
              <SearchBar />
            </div>
          </Tooltip>
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
                <Tooltip content="Click to schedule a new appointment">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 text-tansy-teal-dark font-medium hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Schedule one now
                  </Link>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Before version component
function DashboardPageBefore() {
  const [activeSubTab, setActiveSubTab] = useState('upcoming')

  return (
    <div className="min-h-screen bg-gradient-to-b from-tansy-gray-light to-white pb-8">
      <div className="pt-8">
        <SearchBar />
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

