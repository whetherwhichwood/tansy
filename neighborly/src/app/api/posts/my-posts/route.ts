import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'requests' or 'helping'

    let posts: any[] = []

    if (type === 'requests') {
      // Posts created by the resident
      posts = await prisma.post.findMany({
        where: {
          authorId: resident.id,
        },
        include: {
          author: true,
          claimer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else if (type === 'helping') {
      // Posts claimed by the resident
      posts = await prisma.post.findMany({
        where: {
          claimedById: resident.id,
        },
        include: {
          author: true,
          claimer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching my posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}








