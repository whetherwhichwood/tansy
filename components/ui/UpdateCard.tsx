import { Search } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

interface UpdateCardProps {
  message: string
}

export default function UpdateCard({ message }: UpdateCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-tansy-gray flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-tansy-gray-dark" />
        <span className="text-tansy-gray-darker">{message}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-tansy-gray-dark" />
    </div>
  )
}

