import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'
import { z } from 'zod'

const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
})

export async function GET(
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

    // Only author or claimer can see messages
    if (post.authorId !== resident.id && post.claimedById !== resident.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { postId: params.id },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createMessageSchema.parse(body)

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.hoaId !== resident.hoaId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only author or claimer can send messages
    if (post.authorId !== resident.id && post.claimedById !== resident.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        postId: params.id,
        senderId: resident.id,
        content: validatedData.content,
      },
      include: {
        sender: true,
      },
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error creating message:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}








