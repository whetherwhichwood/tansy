import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.hoaId !== resident.hoaId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (post.status !== 'OPEN') {
      return NextResponse.json({ error: 'Post is not available for claiming' }, { status: 400 })
    }

    if (post.authorId === resident.id) {
      return NextResponse.json({ error: 'Cannot claim your own post' }, { status: 400 })
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        status: 'CLAIMED',
        claimedById: resident.id,
      },
      include: {
        author: true,
        claimer: true,
      },
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Error claiming post:', error)
    return NextResponse.json(
      { error: 'Failed to claim post' },
      { status: 500 }
    )
  }
}








