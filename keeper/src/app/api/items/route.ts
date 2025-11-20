import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const createItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  purchaseDate: z.string(),
  warrantyEndDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  vendor: z.string().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.item.findMany({
      where: { userId: user.email },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createItemSchema.parse(body)

    const item = await prisma.item.create({
      data: {
        ...data,
        userId: user.email,
        purchaseDate: new Date(data.purchaseDate),
        warrantyEndDate: data.warrantyEndDate ? new Date(data.warrantyEndDate) : null,
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating item:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}


