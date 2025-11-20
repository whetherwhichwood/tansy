import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateStatus, getUrgencyColor, getDaysUntilDue } from '@/lib/date-utils'
import { DashboardItem } from '@/lib/types'
import DueThisMonth from '@/components/dashboard/DueThisMonth'
import UpcomingSection from '@/components/dashboard/UpcomingSection'

async function getDashboardData() {
  const user = await getCurrentUser()
  if (!user) return { dueThisMonth: [], upcoming: [] }

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

  // Get items due within 30 days
  const items = await prisma.item.findMany({
    where: {
      userId: user.email,
      warrantyEndDate: {
        lte: thirtyDaysFromNow,
        gte: now
      }
    }
  })

  // Get tasks due within 30 days
  const tasks = await prisma.maintenanceTask.findMany({
    where: {
      userId: user.email,
      isActive: true,
      nextDueDate: {
        lte: thirtyDaysFromNow,
        gte: now
      }
    }
  })

  // Get documents due within 30 days
  const documents = await prisma.document.findMany({
    where: {
      userId: user.email,
      expirationDate: {
        lte: thirtyDaysFromNow,
        gte: now
      }
    }
  })

  // Get upcoming items (30-90 days)
  const upcomingItems = await prisma.item.findMany({
    where: {
      userId: user.email,
      warrantyEndDate: {
        lte: ninetyDaysFromNow,
        gt: thirtyDaysFromNow
      }
    }
  })

  const upcomingTasks = await prisma.maintenanceTask.findMany({
    where: {
      userId: user.email,
      isActive: true,
      nextDueDate: {
        lte: ninetyDaysFromNow,
        gt: thirtyDaysFromNow
      }
    }
  })

  const upcomingDocuments = await prisma.document.findMany({
    where: {
      userId: user.email,
      expirationDate: {
        lte: ninetyDaysFromNow,
        gt: thirtyDaysFromNow
      }
    }
  })

  // Process items
  const processedItems: DashboardItem[] = items.map(item => {
    const dueDate = item.warrantyEndDate!
    const status = calculateStatus(dueDate)
    const urgency = getUrgencyColor(status)
    const daysUntilDue = getDaysUntilDue(dueDate)
    
    return {
      id: item.id,
      type: 'item',
      name: item.name,
      category: item.category,
      dueDate,
      status,
      urgency,
      daysUntilDue,
      data: item
    }
  })

  // Process tasks
  const processedTasks: DashboardItem[] = tasks.map(task => {
    const dueDate = task.nextDueDate
    const status = calculateStatus(dueDate)
    const urgency = getUrgencyColor(status)
    const daysUntilDue = getDaysUntilDue(dueDate)
    
    return {
      id: task.id,
      type: 'task',
      name: task.name,
      category: task.category,
      dueDate,
      status,
      urgency,
      daysUntilDue,
      data: task
    }
  })

  // Process documents
  const processedDocuments: DashboardItem[] = documents.map(doc => {
    const dueDate = doc.expirationDate
    const status = calculateStatus(dueDate)
    const urgency = getUrgencyColor(status)
    const daysUntilDue = getDaysUntilDue(dueDate)
    
    return {
      id: doc.id,
      type: 'document',
      name: doc.name,
      category: doc.type,
      dueDate,
      status,
      urgency,
      daysUntilDue,
      data: doc
    }
  })

  // Process upcoming items
  const processedUpcomingItems: DashboardItem[] = upcomingItems.map(item => {
    const dueDate = item.warrantyEndDate!
    const status = calculateStatus(dueDate)
    const urgency = getUrgencyColor(status)
    const daysUntilDue = getDaysUntilDue(dueDate)
    
    return {
      id: item.id,
      type: 'item',
      name: item.name,
      category: item.category,
      dueDate,
      status,
      urgency,
      daysUntilDue,
      data: item
    }
  })

  const processedUpcomingTasks: DashboardItem[] = upcomingTasks.map(task => {
    const dueDate = task.nextDueDate
    const status = calculateStatus(dueDate)
    const urgency = getUrgencyColor(status)
    const daysUntilDue = getDaysUntilDue(dueDate)
    
    return {
      id: task.id,
      type: 'task',
      name: task.name,
      category: task.category,
      dueDate,
      status,
      urgency,
      daysUntilDue,
      data: task
    }
  })

  const processedUpcomingDocuments: DashboardItem[] = upcomingDocuments.map(doc => {
    const dueDate = doc.expirationDate
    const status = calculateStatus(dueDate)
    const urgency = getUrgencyColor(status)
    const daysUntilDue = getDaysUntilDue(dueDate)
    
    return {
      id: doc.id,
      type: 'document',
      name: doc.name,
      category: doc.type,
      dueDate,
      status,
      urgency,
      daysUntilDue,
      data: doc
    }
  })

  const dueThisMonth = [...processedItems, ...processedTasks, ...processedDocuments]
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)

  const upcoming = [...processedUpcomingItems, ...processedUpcomingTasks, ...processedUpcomingDocuments]
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)

  return { dueThisMonth, upcoming }
}

export default async function DashboardPage() {
  const { dueThisMonth, upcoming } = await getDashboardData()
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Hi {user?.name || 'there'}, here's what needs attention
        </h1>
        <p className="mt-2 text-neutral-600">
          {dueThisMonth.length} items due this month, {upcoming.length} upcoming
        </p>
      </div>

      {/* Due This Month */}
      <DueThisMonth items={dueThisMonth} />

      {/* Upcoming */}
      <UpcomingSection items={upcoming} />
    </div>
  )
}


