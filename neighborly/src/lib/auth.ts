import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { Resident } from './types'

export async function getCurrentResident(): Promise<Resident | null> {
  try {
    const cookieStore = cookies()
    const residentId = cookieStore.get('residentId')?.value

    if (!residentId) {
      return null
    }

    const resident = await prisma.resident.findUnique({
      where: { id: residentId },
    })

    return resident as Resident | null
  } catch (error) {
    console.error('Error getting current resident:', error)
    return null
  }
}

export async function setResidentSession(residentId: string) {
  const cookieStore = cookies()
  cookieStore.set('residentId', residentId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearResidentSession() {
  const cookieStore = cookies()
  cookieStore.delete('residentId')
}

export async function verifyInviteCode(inviteCode: string): Promise<boolean> {
  try {
    const hoa = await prisma.hOA.findUnique({
      where: { inviteCode },
    })
    return !!hoa
  } catch (error) {
    console.error('Error verifying invite code:', error)
    return false
  }
}

export async function createResident(data: {
  name: string
  email: string
  address: string
  inviteCode: string
}): Promise<Resident | null> {
  try {
    // Verify invite code
    const hoa = await prisma.hOA.findUnique({
      where: { inviteCode: data.inviteCode },
    })

    if (!hoa) {
      throw new Error('Invalid invite code')
    }

    // Check if email already exists
    const existingResident = await prisma.resident.findUnique({
      where: { email: data.email },
    })

    if (existingResident) {
      throw new Error('Email already registered')
    }

    // Create resident
    const resident = await prisma.resident.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        hoaId: hoa.id,
        isVerified: true, // Auto-verify for demo
      },
    })

    return resident as Resident
  } catch (error) {
    console.error('Error creating resident:', error)
    return null
  }
}








