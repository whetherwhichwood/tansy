'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, MessageCircle, ArrowRight, Smile, FileText, User, Phone, FileCheck } from 'lucide-react'
import { useFeatureFlags } from '@/lib/featureFlags'
import { analytics } from '@/lib/analytics'
import OnboardingModal from './OnboardingModal'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface OnboardingChecklistProps {
  items: ChecklistItem[]
  onComplete?: () => void
  onCompletionChange?: (completed: boolean) => void
}

const stepDescriptions: Record<string, string> = {
  tutorial: 'Learn about Tansy',
  consent: 'Read and agree for us to begin scheduling on your behalf',
  'basic-info': 'Complete your profile to get started',
  contact: 'Let us know how we can best contact you for important updates',
  coverage: "We'll help you make the most of your insurance by showing covered options",
  chat: 'Start a conversation with Tansy',
}

const stepIcons: Record<string, React.ReactNode> = {
  tutorial: <Smile className="w-6 h-6" />,
  consent: <FileText className="w-6 h-6" />,
  'basic-info': <User className="w-6 h-6" />,
  contact: <Phone className="w-6 h-6" />,
  coverage: <FileCheck className="w-6 h-6" />,
  chat: <MessageCircle className="w-6 h-6" />,
}

export default function OnboardingChecklist({ items: initialItems, onComplete, onCompletionChange }: OnboardingChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems)
  const { isBeforeMode } = useFeatureFlags()
  const [isVisible, setIsVisible] = useState(true)
  const [hasStartedTracking, setHasStartedTracking] = useState(false)
  const [openModal, setOpenModal] = useState<string | null>(null)

  const allCompleted = items.every(item => item.completed)
  const chatItem = items.find(item => item.id === 'chat')
  const otherItemsCompleted = items.filter(item => item.id !== 'chat').every(item => item.completed)
  const canStartChat = otherItemsCompleted && chatItem && !chatItem.completed

  useEffect(() => {
    // Start tracking onboarding time
    if (!hasStartedTracking && !isBeforeMode) {
      analytics.startOnboarding('user-1')
      setHasStartedTracking(true)
    }
  }, [hasStartedTracking, isBeforeMode])

  useEffect(() => {
    // Notify parent of completion status
    onCompletionChange?.(allCompleted)
    
    if (allCompleted && !isBeforeMode) {
      // Save completion status to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tansy_onboarding_complete', 'true')
      }
      
      // Track completion
      analytics.completeOnboarding('user-1')
      
      // Auto-hide after 2 seconds when all tasks are done
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [allCompleted, isBeforeMode, onComplete, onCompletionChange])

  // Check if onboarding was already completed on mount
  useEffect(() => {
    if (!isBeforeMode && typeof window !== 'undefined') {
      const wasCompleted = localStorage.getItem('tansy_onboarding_complete') === 'true'
      if (wasCompleted && !allCompleted) {
        // If it was completed before, hide the checklist
        setIsVisible(false)
        onCompletionChange?.(true)
      }
    }
  }, [isBeforeMode, allCompleted, onCompletionChange])

  const handleStepComplete = (stepId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === stepId ? { ...item, completed: true } : item
      )
    )
  }

  const handleStartConversation = () => {
    if (canStartChat) {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === 'chat' ? { ...item, completed: true } : item
        )
      )
    }
  }

  const handleToggleItem = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleResetChecklist = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, completed: false }))
    )
    setIsVisible(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tansy_onboarding_complete')
    }
    onCompletionChange?.(false)
  }

  const handleCompleteChecklist = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, completed: true }))
    )
  }

  if (!isVisible) return null

  const completedCount = items.filter(item => item.completed).length
  const progress = (completedCount / items.length) * 100

  // Before mode - simple checklist without modals
  if (isBeforeMode) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-tansy-gray mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-tansy-gray-darker">Getting Started</h3>
          <div className="flex items-center gap-3">
            <div className="text-sm text-tansy-teal font-medium">
              {completedCount} of {items.length} completed
            </div>
            {allCompleted ? (
              <button
                onClick={handleResetChecklist}
                className="px-4 py-2 text-sm font-medium text-tansy-teal-dark bg-tansy-teal-light rounded-lg hover:bg-tansy-teal/20 transition-colors"
              >
                Reset Checklist
              </button>
            ) : (
              <button
                onClick={handleCompleteChecklist}
                className="px-4 py-2 text-sm font-medium text-white bg-tansy-teal rounded-lg hover:bg-tansy-teal-dark transition-colors"
              >
                Complete Checklist
              </button>
            )}
          </div>
        </div>
        
        <div className="w-full bg-tansy-gray-light rounded-full h-2 mb-4">
          <div
            className="bg-tansy-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left bg-white border-tansy-gray hover:border-tansy-teal hover:shadow-sm"
            >
              <div className={`p-2 rounded-lg ${
                item.completed ? 'bg-tansy-teal text-white' : 'bg-tansy-gray-light text-tansy-gray-dark'
              }`}>
                {stepIcons[item.id] || <Circle className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-tansy-teal flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-tansy-gray-dark flex-shrink-0" />
                  )}
                  <h4 className={`font-semibold ${
                    item.completed
                      ? 'text-tansy-gray-dark line-through'
                      : 'text-tansy-gray-darker'
                  }`}>
                    {item.label}
                  </h4>
                </div>
                <p className="text-sm ml-7 text-tansy-gray-dark">
                  {stepDescriptions[item.id] || ''}
                </p>
              </div>
              {!item.completed && (
                <ArrowRight className="w-5 h-5 text-tansy-gray-dark flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // After mode - with modals
  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-tansy-gray mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-tansy-gray-darker">Getting Started</h3>
          <div className="flex items-center gap-3">
            <div className="text-sm text-tansy-teal font-medium">
              {completedCount} of {items.length} completed
            </div>
            {allCompleted ? (
              <button
                onClick={handleResetChecklist}
                className="px-4 py-2 text-sm font-medium text-tansy-teal-dark bg-tansy-teal-light rounded-lg hover:bg-tansy-teal/20 transition-colors"
              >
                Reset Checklist
              </button>
            ) : (
              <button
                onClick={handleCompleteChecklist}
                className="px-4 py-2 text-sm font-medium text-white bg-tansy-teal rounded-lg hover:bg-tansy-teal-dark transition-colors"
              >
                Complete Checklist
              </button>
            )}
          </div>
        </div>
        
        <div className="w-full bg-tansy-gray-light rounded-full h-2 mb-4">
          <div
            className="bg-tansy-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const isChat = item.id === 'chat'
            const isDisabled = isChat && !otherItemsCompleted
            
            const content = (
              <>
                <div className={`p-2 rounded-lg ${
                  item.completed ? 'bg-tansy-teal text-white' : 'bg-tansy-gray-light text-tansy-gray-dark'
                }`}>
                  {stepIcons[item.id] || <Circle className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-tansy-teal flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-tansy-gray-dark flex-shrink-0" />
                    )}
                    <h4 className={`font-semibold ${
                      item.completed
                        ? 'text-tansy-gray-dark line-through'
                        : isDisabled
                        ? 'text-tansy-gray-dark'
                        : 'text-tansy-gray-darker'
                    }`}>
                      {item.label}
                    </h4>
                  </div>
                  <p className={`text-sm ml-7 ${
                    item.completed || isDisabled
                      ? 'text-tansy-gray-dark'
                      : 'text-tansy-gray-dark'
                  }`}>
                    {stepDescriptions[item.id] || ''}
                  </p>
                </div>
                {!item.completed && !isDisabled && (
                  <ArrowRight className="w-5 h-5 text-tansy-gray-dark flex-shrink-0" />
                )}
              </>
            )
            
            if (isChat) {
              return (
                <Link
                  key={item.id}
                  href={canStartChat ? "/chat" : "#"}
                  onClick={(e) => {
                    if (!canStartChat) {
                      e.preventDefault()
                    } else {
                      handleStartConversation()
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-tansy-gray-light border-tansy-gray'
                      : isDisabled
                      ? 'bg-tansy-gray-light border-tansy-gray opacity-50 cursor-not-allowed'
                      : 'bg-white border-tansy-gray hover:border-tansy-teal hover:shadow-sm'
                  }`}
                >
                  {content}
                </Link>
              )
            }
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!item.completed) {
                    setOpenModal(item.id)
                  }
                }}
                disabled={item.completed}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  item.completed
                    ? 'bg-tansy-gray-light border-tansy-gray cursor-default'
                    : 'bg-white border-tansy-gray hover:border-tansy-teal hover:shadow-sm'
                }`}
              >
                {content}
              </button>
            )
          })}
        </div>

        {allCompleted && (
          <div className="mt-4 p-3 bg-tansy-teal-light rounded-lg text-center text-tansy-teal-dark font-medium">
            🎉 All set! You're ready to go.
          </div>
        )}
      </div>

      {/* Modals for each step */}
      {items.map((item) => {
        if (item.id === 'chat') return null
        
        return (
          <OnboardingModal
            key={item.id}
            isOpen={openModal === item.id}
            onClose={() => setOpenModal(null)}
            stepId={item.id}
            stepTitle={item.label}
            stepDescription={stepDescriptions[item.id] || ''}
            onComplete={() => handleStepComplete(item.id)}
          >
            {item.id === 'tutorial' && (
              <div className="space-y-4">
                <p className="text-tansy-gray-darker">
                  Welcome to Tansy! We're here to help you navigate your healthcare journey.
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-tansy-gray-light rounded-lg">
                    <h4 className="font-semibold text-tansy-gray-darker mb-2">What is Tansy?</h4>
                    <p className="text-sm text-tansy-gray-dark">
                      Tansy is your AI-powered healthcare assistant that helps you schedule appointments, 
                      navigate insurance, find providers, and manage your healthcare needs.
                    </p>
                  </div>
                  <div className="p-4 bg-tansy-gray-light rounded-lg">
                    <h4 className="font-semibold text-tansy-gray-darker mb-2">How it works</h4>
                    <p className="text-sm text-tansy-gray-dark">
                      Simply chat with Tansy about your healthcare needs, and we'll help coordinate 
                      appointments, verify insurance coverage, and connect you with the right providers.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {item.id === 'consent' && (
              <div className="space-y-4">
                <div className="p-4 bg-tansy-gray-light rounded-lg max-h-96 overflow-y-auto">
                  <h4 className="font-semibold text-tansy-gray-darker mb-3">Consent Agreement</h4>
                  <div className="space-y-3 text-sm text-tansy-gray-dark">
                    <p>
                      By using Tansy, you consent to allow us to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Schedule appointments on your behalf with healthcare providers</li>
                      <li>Access and verify your insurance information</li>
                      <li>Share necessary information with providers to facilitate care</li>
                      <li>Send you appointment reminders and updates</li>
                    </ul>
                    <p className="mt-4">
                      Your privacy is important to us. We will only share information necessary 
                      for scheduling and coordination purposes.
                    </p>
                  </div>
                </div>
                <label className="flex items-start gap-3 p-4 border border-tansy-gray rounded-lg cursor-pointer hover:bg-tansy-gray-light">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-tansy-teal border-tansy-gray rounded focus:ring-tansy-teal"
                  />
                  <span className="text-sm text-tansy-gray-darker">
                    I have read and agree to the consent agreement
                  </span>
                </label>
              </div>
            )}
            
            {item.id === 'basic-info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Sex at Birth
                  </label>
                  <select className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            )}
            
            {item.id === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Preferred Contact Method
                  </label>
                  <select className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal">
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            )}
            
            {item.id === 'coverage' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    placeholder="SelectHealth, Blue Cross, etc."
                    className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Member ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your member ID"
                    className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tansy-gray-darker mb-2">
                    Group Number (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group number"
                    className="w-full px-3 py-2 border border-tansy-gray rounded-lg focus:outline-none focus:border-tansy-teal"
                  />
                </div>
                <div className="p-3 bg-tansy-teal-light rounded-lg">
                  <p className="text-sm text-tansy-teal-dark">
                    We'll use this information to show you covered providers and help you make the most of your insurance benefits.
                  </p>
                </div>
              </div>
            )}
          </OnboardingModal>
        )
      })}
    </>
  )
}
