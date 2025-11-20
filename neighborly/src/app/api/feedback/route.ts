import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentResident } from '@/lib/auth'
import { z } from 'zod'

const createFeedbackSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  badges: z.array(z.string()).min(1, 'At least one badge is required'),
  comment: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const resident = await getCurrentResident()
    
    if (!resident) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createFeedbackSchema.parse(body)

    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
      include: {
        author: true,
        claimer: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.hoaId !== resident.hoaId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only author or claimer can leave feedback
    if (post.authorId !== resident.id && post.claimedById !== resident.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Determine who to give feedback to
    const feedbackRecipientId = post.authorId === resident.id ? post.claimedById : post.authorId

    if (!feedbackRecipientId) {
      return NextResponse.json({ error: 'No recipient for feedback' }, { status: 400 })
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        postId: validatedData.postId,
        fromResidentId: resident.id,
      },
    })

    if (existingFeedback) {
      return NextResponse.json({ error: 'Feedback already submitted' }, { status: 400 })
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        postId: validatedData.postId,
        fromResidentId: resident.id,
        toResidentId: feedbackRecipientId,
        badges: validatedData.badges,
        comment: validatedData.comment,
      },
    })

    // Update recipient's reputation
    await updateResidentReputation(feedbackRecipientId)

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error creating feedback:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}

async function updateResidentReputation(residentId: string) {
  try {
    // Get all feedback for this resident
    const feedbacks = await prisma.feedback.findMany({
      where: { toResidentId: residentId },
    })

    // Calculate badge counts
    const badgeCounts: Record<string, number> = { "👍": 0, "💬": 0, "⏱️": 0 }
    
    feedbacks.forEach(feedback => {
      feedback.badges.forEach(badge => {
        if (badge in badgeCounts) {
          badgeCounts[badge]++
        }
      })
    })

    // Calculate reputation score (weighted sum)
    const reputationScore = Math.min(100, 
      badgeCounts["👍"] * 3 + 
      badgeCounts["💬"] * 2 + 
      badgeCounts["⏱️"] * 2
    )

    // Update resident
    await prisma.resident.update({
      where: { id: residentId },
      data: {
        badges: badgeCounts,
        reputationScore,
      },
    })
  } catch (error) {
    console.error('Error updating reputation:', error)
  }
}








