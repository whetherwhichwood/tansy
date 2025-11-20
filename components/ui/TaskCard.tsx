import { Clipboard } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

interface TaskCardProps {
  title: string
  status: 'in-progress' | 'completed' | 'pending'
}

export default function TaskCard({ title, status }: TaskCardProps) {
  const statusColors = {
    'in-progress': 'bg-green-500',
    completed: 'bg-blue-500',
    pending: 'bg-gray-400',
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-tansy-gray flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Clipboard className="w-5 h-5 text-tansy-gray-dark" />
        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5 rounded-full" />
          <span className="text-tansy-gray-darker font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[status]}`}>
          {status === 'in-progress' ? 'In Progress' : status === 'completed' ? 'Completed' : 'Pending'}
        </span>
        <ChevronRight className="w-5 h-5 text-tansy-gray-dark" />
      </div>
    </div>
  )
}

