import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get posts where the resident is either author or claimer and has messages
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: resident.id },
          { claimedById: resident.id },
        ],
        status: {
          in: ['CLAIMED', 'COMPLETED'],
        },
        messages: {
          some: {},
        },
      },
      include: {
        author: true,
        claimer: true,
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Format chat summaries
    const chats = posts.map(post => {
      const lastMessage = post.messages[0]
      const otherParticipant = post.authorId === resident.id ? post.claimer : post.author
      
      return {
        post: {
          id: post.id,
          title: post.title,
          author: post.author,
          claimer: post.claimer,
          status: post.status,
        },
        lastMessage: {
          content: lastMessage?.content || '',
          createdAt: lastMessage?.createdAt || post.createdAt,
          senderName: lastMessage?.sender.name || 'System',
        },
        unreadCount: 0, // For now, we'll implement this later if needed
      }
    })

    return NextResponse.json({ chats })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}








