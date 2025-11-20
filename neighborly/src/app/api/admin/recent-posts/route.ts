import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: {
        hoaId: resident.hoaId,
      },
      include: {
        author: true,
        claimer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent posts' },
      { status: 500 }
    )
  }
}








