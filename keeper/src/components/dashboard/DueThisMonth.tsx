import { DashboardItem } from '@/lib/types'
import DashboardCard from './DashboardCard'

interface DueThisMonthProps {
  items: DashboardItem[]
}

export default function DueThisMonth({ items }: DueThisMonthProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
        <div className="text-neutral-500">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">All caught up!</h3>
          <p>Nothing is due this month. Great job staying on top of things!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        Due This Month ({items.length})
      </h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <DashboardCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  )
}


