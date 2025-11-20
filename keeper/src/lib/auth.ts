import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Server-side functions only
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user-email')?.value
  
  if (!userEmail) {
    return null
  }
  
  return { email: userEmail }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }
  
  return user
}

export async function setUserSession(email: string) {
  const cookieStore = await cookies()
  cookieStore.set('user-email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete('user-email')
}
