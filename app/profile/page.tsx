'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Calendar, User as UserIcon, Plus } from 'lucide-react'
import ProfileCard from '@/components/ui/ProfileCard'
import InsuranceCard from '@/components/ui/InsuranceCard'
import InfoIcon from '@/components/ui/InfoIcon'
import { mockUser, mockInsurance } from '@/lib/mockData'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('insurance')

  const tabs = [
    { id: 'insurance', label: 'Insurance' },
    { id: 'files', label: 'Files' },
    { id: 'reports', label: 'Reports' },
    { id: 'tasks', label: 'Tasks' },
  ]

  return (
    <div className="min-h-screen bg-tansy-gray-light pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-tansy-gray-darker" />
            </Link>
            <h1 className="text-2xl font-semibold text-tansy-gray-darker">Profile</h1>
          </div>
          <button className="p-2 hover:bg-white rounded-full transition-colors">
            <Settings className="w-5 h-5 text-tansy-gray-darker" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="mb-6">
          <ProfileCard name={mockUser.name} avatar={mockUser.avatar} />
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-tansy-gray-darker mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-tansy-gray-light rounded-lg">
              <Calendar className="w-5 h-5 text-tansy-gray-dark" />
              <div>
                <div className="text-xs text-tansy-gray-dark mb-1">Date of Birth</div>
                <div className="font-medium text-tansy-gray-darker">{mockUser.dateOfBirth}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-tansy-gray-light rounded-lg">
              <UserIcon className="w-5 h-5 text-tansy-gray-dark" />
              <div>
                <div className="text-xs text-tansy-gray-dark mb-1">Sex at Birth</div>
                <div className="font-medium text-tansy-gray-darker">{mockUser.sexAtBirth}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-tansy-teal-dark text-white'
                      : 'text-tansy-gray-dark hover:bg-tansy-gray-light'
                  }`}
                >
                  {tab.label}
                </button>
                {tab.id === 'insurance' && (
                  <InfoIcon content="View and manage your insurance information, including policy details and coverage" size="sm" />
                )}
                {tab.id === 'files' && (
                  <InfoIcon content="Access your medical files, documents, and health records" size="sm" />
                )}
                {tab.id === 'reports' && (
                  <InfoIcon content="View lab results, test reports, and medical summaries" size="sm" />
                )}
                {tab.id === 'tasks' && (
                  <InfoIcon content="Track your healthcare tasks and action items" size="sm" />
                )}
              </div>
            ))}
          </div>

          {/* New Button */}
          <button className="mb-6 px-4 py-2 bg-tansy-teal-dark text-white rounded-lg font-medium flex items-center gap-2 hover:bg-tansy-teal transition-colors">
            <Plus className="w-4 h-4" />
            New
          </button>

          {/* Insurance Card */}
          {activeTab === 'insurance' && <InsuranceCard insurance={mockInsurance} />}

          {/* Empty states for other tabs */}
          {activeTab !== 'insurance' && (
            <div className="text-center py-12 text-tansy-gray-dark">
              No {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

