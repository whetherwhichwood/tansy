import { Folder, Edit } from 'lucide-react'
import { Insurance } from '@/lib/mockData'

interface InsuranceCardProps {
  insurance: Insurance
}

export default function InsuranceCard({ insurance }: InsuranceCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5" />
          <span className="font-semibold">{insurance.type}</span>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-gray-400 text-sm mb-1">Policy Holder Name</div>
          <div className="font-medium">{insurance.policyHolderName}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Insurance Provider</div>
          <div className="font-medium">{insurance.provider}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Coverage Start Date</div>
          <div className="font-medium">{insurance.coverageStartDate}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Plan Type</div>
          <div className="font-medium">{insurance.planType}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Member ID</div>
          <div className="font-medium">{insurance.memberId}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Group Number</div>
          <div className="font-medium">{insurance.groupNumber}</div>
        </div>
      </div>
    </div>
  )
}

