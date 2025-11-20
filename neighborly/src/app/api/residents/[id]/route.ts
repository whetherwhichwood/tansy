import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentResident = await getCurrentResident()
    
    if (!currentResident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resident = await prisma.resident.findUnique({
      where: { id: params.id },
    })

    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 })
    }

    if (resident.hoaId !== currentResident.hoaId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get recent completed posts for this resident
    const recentPosts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: params.id, status: 'COMPLETED' },
          { claimedById: params.id, status: 'COMPLETED' },
        ],
      },
      include: {
        author: true,
        claimer: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 5,
    })

    return NextResponse.json({ 
      resident,
      recentPosts,
    })
  } catch (error) {
    console.error('Error fetching resident:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resident' },
      { status: 500 }
    )
  }
}








