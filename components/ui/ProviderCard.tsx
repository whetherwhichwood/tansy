import { ChevronRight } from 'lucide-react'

interface ProviderCardProps {
  name: string
}

export default function ProviderCard({ name }: ProviderCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-tansy-gray flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
      <span className="text-tansy-gray-darker font-medium">{name}</span>
      <ChevronRight className="w-5 h-5 text-tansy-gray-dark rotate-180" />
    </div>
  )
}

