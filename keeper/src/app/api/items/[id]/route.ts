import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  purchaseDate: z.string().optional(),
  warrantyEndDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  vendor: z.string().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const item = await prisma.item.findFirst({
      where: {
        id: params.id,
        userId: user.email
      }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = updateItemSchema.parse(body)

    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findFirst({
      where: {
        id: params.id,
        userId: user.email
      }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const updateData: any = { ...data }
    
    // Convert date strings to Date objects
    if (data.purchaseDate) {
      updateData.purchaseDate = new Date(data.purchaseDate)
    }
    if (data.warrantyEndDate) {
      updateData.warrantyEndDate = new Date(data.warrantyEndDate)
    }

    const item = await prisma.item.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating item:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findFirst({
      where: {
        id: params.id,
        userId: user.email
      }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.item.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}


