'use client'

import { X, Smile, FileText, User, Phone, FileCheck } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  stepId: string
  stepTitle: string
  stepDescription: string
  onComplete: () => void
  children?: React.ReactNode
}

const stepIcons = {
  tutorial: Smile,
  consent: FileText,
  'basic-info': User,
  contact: Phone,
  coverage: FileCheck,
}

export default function OnboardingModal({
  isOpen,
  onClose,
  stepId,
  stepTitle,
  stepDescription,
  onComplete,
  children,
}: OnboardingModalProps) {
  if (!isOpen) return null

  const Icon = stepIcons[stepId as keyof typeof stepIcons] || FileText

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-tansy-gray px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tansy-teal-light rounded-lg">
              <Icon className="w-6 h-6 text-tansy-teal-dark" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-tansy-gray-darker">{stepTitle}</h2>
              <p className="text-sm text-tansy-gray-dark">{stepDescription}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tansy-gray-light rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-tansy-gray-darker" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-tansy-gray px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-tansy-gray-darker hover:bg-tansy-gray-light rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onComplete()
              onClose()
            }}
            className="px-6 py-2 bg-tansy-teal text-white rounded-lg hover:bg-tansy-teal-dark transition-colors font-medium"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  )
}

