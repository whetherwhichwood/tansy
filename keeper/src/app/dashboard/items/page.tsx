import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateStatus } from '@/lib/date-utils'
import ItemsList from '@/components/items/ItemsList'
import CreateItemButton from '@/components/items/CreateItemButton'

async function getItems() {
  const user = await getCurrentUser()
  if (!user) return []

  const items = await prisma.item.findMany({
    where: { userId: user.email },
    orderBy: { createdAt: 'desc' }
  })

  return items.map(item => ({
    ...item,
    status: item.warrantyEndDate ? calculateStatus(item.warrantyEndDate) : 'ACTIVE'
  }))
}

export default async function ItemsPage() {
  const items = await getItems()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Items</h1>
          <p className="text-neutral-600">Track your warranties and purchases</p>
        </div>
        <CreateItemButton />
      </div>

      <ItemsList items={items} />
    </div>
  )
}


