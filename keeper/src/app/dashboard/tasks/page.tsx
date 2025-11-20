import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateStatus } from '@/lib/date-utils'
import TasksList from '@/components/tasks/TasksList'
import CreateTaskButton from '@/components/tasks/CreateTaskButton'

async function getTasks() {
  const user = await getCurrentUser()
  if (!user) return []

  const tasks = await prisma.maintenanceTask.findMany({
    where: { userId: user.email },
    orderBy: { nextDueDate: 'asc' }
  })

  return tasks.map(task => ({
    ...task,
    status: calculateStatus(task.nextDueDate)
  }))
}

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Maintenance Tasks</h1>
          <p className="text-neutral-600">Track recurring maintenance and upkeep</p>
        </div>
        <CreateTaskButton />
      </div>

      <TasksList tasks={tasks} />
    </div>
  )
}


