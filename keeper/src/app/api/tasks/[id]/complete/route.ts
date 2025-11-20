import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateNextDueDate } from '@/lib/date-utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the task
    const task = await prisma.maintenanceTask.findFirst({
      where: {
        id: params.id,
        userId: user.email
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (!task.isActive) {
      return NextResponse.json({ error: 'Cannot complete inactive task' }, { status: 400 })
    }

    // Calculate next due date
    const now = new Date()
    const nextDueDate = calculateNextDueDate(
      now,
      task.frequency,
      task.customInterval
    )

    // Update the task
    const updatedTask = await prisma.maintenanceTask.update({
      where: { id: params.id },
      data: {
        lastCompletedAt: now,
        nextDueDate: nextDueDate,
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}


