import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get stats for the resident's HOA
    const [
      totalResidents,
      totalPosts,
      activePosts,
      completedPosts,
      totalMessages
    ] = await Promise.all([
      prisma.resident.count({
        where: { hoaId: resident.hoaId }
      }),
      prisma.post.count({
        where: { hoaId: resident.hoaId }
      }),
      prisma.post.count({
        where: { 
          hoaId: resident.hoaId,
          status: { in: ['OPEN', 'CLAIMED'] }
        }
      }),
      prisma.post.count({
        where: { 
          hoaId: resident.hoaId,
          status: 'COMPLETED'
        }
      }),
      prisma.message.count({
        where: {
          post: {
            hoaId: resident.hoaId
          }
        }
      })
    ])

    const stats = {
      totalResidents,
      totalPosts,
      activePosts,
      completedPosts,
      totalMessages
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}








