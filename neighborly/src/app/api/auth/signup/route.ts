import { NextRequest, NextResponse } from 'next/server'
import { createResident, setResidentSession } from '@/lib/auth'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  inviteCode: z.string().min(1, 'Invite code is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    
    // Create resident
    const resident = await createResident(validatedData)
    
    if (!resident) {
      return NextResponse.json(
        { error: 'Failed to create resident account' },
        { status: 400 }
      )
    }

    // Set session
    await setResidentSession(resident.id)

    return NextResponse.json({
      success: true,
      resident: {
        id: resident.id,
        name: resident.name,
        email: resident.email,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    )
  }
}








